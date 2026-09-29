// React imports
import React, { useState, useEffect } from "react";
import { Button, CommentCard, Line, Paragraph } from "../../ui";
import Markdown from "markdown-to-jsx";

// Redux and Routing imports
import { useAppSelector } from "../../../lib/store";
import { getCurrUser, getWSO } from "../../../lib/authSlice";

// Additional Imports
import { Link, useNavigate, useParams } from "react-router-dom";
import { PostType } from "../../../lib/types";
import type {
  ModelsBulletinRide,
  ModelsBulletin,
} from "wso-api-client/lib/services/types";
import { generateBulletinDate, generateBulletinTitle } from "./BulletinUtils";

const markdownOptions = {
  overrides: {
    h1: { component: "h2" as const, props: {} },
    h2: { component: "h2" as const, props: {} },
    h3: { component: "h2" as const, props: {} },
    h4: { component: "h5" as const, props: {} },
    h5: { component: "h5" as const, props: {} },
    h6: { component: "h5" as const, props: {} },
  },
};

const BulletinShow = () => {
  const wso = useAppSelector(getWSO);
  const currUser = useAppSelector(getCurrUser);

  const params = useParams();
  const navigateTo = useNavigate();

  const [bulletin, updateBulletin] = useState<
    ModelsBulletinRide | ModelsBulletin | undefined
  >(undefined);

  const deleteHandler = async () => {
    // eslint-disable-next-line no-restricted-globals, no-alert
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      if (!bulletin?.id) {
        throw new Error("No bulletin ID found. Fail to delete.");
      }
      if ("type" in bulletin) {
        await wso.bulletinService.deleteBulletin(bulletin.id);
        navigateTo(`/bulletins/${bulletin.type}`);
      } else {
        await wso.bulletinService.deleteRide(bulletin.id);
        navigateTo(`/bulletins/${PostType.Rides}`);
      }
    } catch (error) {
      navigateTo("/error", { replace: true, state: { error } });
    }
  };

  useEffect(() => {
    const loadBulletin = async () => {
      if (!params.bulletinID) return;

      try {
        let bulletinResponse;
        if (params.type === PostType.Rides) {
          bulletinResponse = await wso.bulletinService.getRide(
            Number(params.bulletinID)
          );
        } else {
          bulletinResponse = await wso.bulletinService.getBulletin(
            Number(params.bulletinID)
          );
        }

        updateBulletin(bulletinResponse.data);
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((error as any).errorCode === 404)
          navigateTo("/404", { replace: true });
      }
    };

    loadBulletin();
  }, [params.bulletinID, params.type, wso]);

  const generateBulletinStarter = () => {
    if (bulletin?.userID && bulletin.user?.name) {
      return (
        <Link to={`/facebook/users/${bulletin.userID}`}>
          {bulletin.user.name}
        </Link>
      );
    }

    if (bulletin?.user?.name) return bulletin.user.name;

    return "WSO User";
  };

  const editDeleteButtons = () => {
    if (currUser && (currUser.id === bulletin?.user?.id || currUser.admin)) {
      return (
        <div className="main-table-corner-actions">
          {currUser.id === bulletin?.user?.id ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigateTo("edit")}
            >
              Edit
            </Button>
          ) : null}
          <Button type="button" variant="secondary" onClick={deleteHandler}>
            Delete
          </Button>
        </div>
      );
    }
    return null;
  };

  if (!bulletin)
    return (
      <section className="discussion-thread">
        <div className="thread-title-row">
          <h3 className="thread-title">
            <Line width="50%" />
          </h3>
        </div>
        <CommentCard
          className="discussion-post"
          header={<Line width="30%" />}
          body={<Paragraph numRows={5} />}
          meta={<Line width="25%" />}
        />
      </section>
    );

  return (
    <section className="discussion-thread">
      <div className="thread-title-row">
        <h3 className="thread-title">{generateBulletinTitle(bulletin)}</h3>
        {editDeleteButtons()}
      </div>
      <CommentCard
        className="discussion-post"
        header={<h1>{generateBulletinStarter()}</h1>}
        body={
          <div className="markdown-content">
            <Markdown options={markdownOptions}>
              {bulletin.body ||
                "There was an error displaying the content for this post."}
            </Markdown>
          </div>
        }
        meta={<span>{generateBulletinDate(bulletin)}</span>}
      />
    </section>
  );
};

export default BulletinShow;
