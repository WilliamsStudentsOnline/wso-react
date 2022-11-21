// React imports
import React, { useState, useEffect } from "react";
import "../../stylesheets/BulletinBox.css";
import { Line } from "../../Skeleton";

// Redux/Routing imports
import { getWSO } from "../../../lib/authSlice";
import { useAppSelector } from "../../../lib/store";

// Additional imports
import { Link } from "react-router-dom";
import {
  ModelsBulletin,
  ModelsBulletinRide,
  ModelsDiscussion,
} from "wso-api-client/lib/services/types";
import { PostType, PostTypeName } from "../../../lib/types";

type NonRideThread = ModelsDiscussion | ModelsBulletin;
type Thread = NonRideThread | ModelsBulletinRide;

const BulletinBox = ({ type }: { type: PostType }) => {
  const wso = useAppSelector(getWSO);
  const [threads, updateThreads] = useState<Thread[] | undefined>(undefined);

  // Load the appropriate discussions/bulletins
  useEffect(() => {
    let isMounted = true;
    const loadParams = { limit: 5, type: type };

    const getThreads = async () => {
      let response;
      if (type === PostType.Discussions) {
        response = await wso.bulletinService.listDiscussions(loadParams);
      } else if (type === PostType.Rides) {
        response = await wso.bulletinService.listRides(loadParams);
      } else {
        response = await wso.bulletinService.listBulletins(loadParams);
      }
      if (isMounted) {
        updateThreads(response.data);
      }
    };

    try {
      if (wso.isAuthenticated()) {
        getThreads();
      }
    } catch (e) {
      // We aren't really expecting any errors here, unless the token is empty for some reason.
      updateThreads([]);
    }

    return () => {
      isMounted = false;
    };
  }, [wso, type]);

  const formatDate = (showDate: string | undefined) => {
    if (!showDate) {
      return "";
    }

    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
    };

    return new Date(showDate).toLocaleString("en-US", options);
  };

  // Generates the threadTitle
  const threadTitle = (thread: Thread) => {
    if (type === PostType.Rides) {
      const rideThread = thread as ModelsBulletinRide;
      const threadOffer = rideThread.offer ? "Offer" : "Request";
      return `${rideThread.source} to ${rideThread.destination} [${threadOffer}]`;
    }

    const otherThread = thread as NonRideThread;
    return otherThread.title;
  };

  // Generates thread Date
  const threadDate = (thread: Thread) => {
    if (type === PostType.Rides) {
      return (thread as ModelsBulletinRide).date;
    }
    if (type === PostType.Discussions) {
      return (thread as ModelsDiscussion).lastActive;
    }
    return (thread as ModelsBulletin).startDate;
  };

  // Generate bulletin title link
  const bulletinTitle = () => {
    if (type === PostType.Discussions) {
      return (
        <div className="bulletin-title">
          <Link className="bulletin-link" to="discussions">
            {PostTypeName.get(type)}
          </Link>
        </div>
      );
    }

    return (
      <div className="bulletin-title">
        <Link className="bulletin-link" to={`bulletins/${type}`}>
          {PostTypeName.get(type)}
        </Link>
      </div>
    );
  };

  const bulletinSkeleton = () =>
    [...Array(5)].map((_, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <div className="bulletin-children" key={i}>
        <Line width="90%" center />

        <span className="list-date">
          <Line width="90%" center />
        </span>
      </div>
    ));

  const bulletinThreads = () => {
    return (
      <div className="bulletin-children-container">
        {threads
          ? threads.map((thread) => {
              return (
                <div className="bulletin-children" key={thread.id}>
                  {type === PostType.Discussions ? (
                    <Link
                      className="thread-link"
                      to={`/discussions/threads/${thread.id}`}
                    >
                      {threadTitle(thread)}
                    </Link>
                  ) : (
                    <Link
                      className="thread-link"
                      to={`/bulletins/${type}/${thread.id}`}
                    >
                      {threadTitle(thread)}
                    </Link>
                  )}

                  <span className="list-date">
                    {formatDate(threadDate(thread))}
                  </span>
                </div>
              );
            })
          : bulletinSkeleton()}
      </div>
    );
  };

  return (
    <div className="bulletin">
      {bulletinTitle()}
      {bulletinThreads()}
    </div>
  );
};

export default BulletinBox;
