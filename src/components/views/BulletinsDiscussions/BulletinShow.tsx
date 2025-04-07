// React imports
import React, { useState, useEffect } from "react";
import { Line, Paragraph } from "../../Skeleton";
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

  // Generate bulletin creator name
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

  // Generate the edit button only if the current user is the bulletin starter
  const editButton = () => {
    if (currUser && currUser.id === bulletin?.user?.id) {
      return (
        <button
          type="button"
          onClick={() => navigateTo("edit")}
          className="inline-button"
        >
          Edit
        </button>
      );
    }

    return null;
  };

  // Generate the edit + delete buttons
  const editDeleteButtons = () => {
    if (currUser && (currUser.id === bulletin?.user?.id || currUser.admin)) {
      return (
        <>
          <br />
          {editButton()}
          <button
            type="button"
            onClick={deleteHandler}
            className="inline-button"
          >
            Delete
          </button>
        </>
      );
    }
    return null;
  };

  if (!bulletin)
    return (
      <article className="list-creation">
        <section>
          <div className="field">
            <h3>
              <br />
              <Line width="100%" />
              <br />
              <br />
            </h3>
            <Line width="30%" />
            <br />
            <br />
            <Paragraph numRows={5} />
          </div>
          <br />
        </section>
      </article>
    );

  return (
    <article className="list-creation">
      <section>
        <div className="field">
          <h3>
            <br />
            {generateBulletinTitle(bulletin)}
            <br />
            <br />
          </h3>
          {`${generateBulletinDate(bulletin)} by `}
          {generateBulletinStarter()}
          {editDeleteButtons()}
          <br />
          <br />
          <div className="markdown-content">
            <Markdown>
              {bulletin.body ||
                "There was an error displaying the content for this post."}
            </Markdown>
          </div>{" "}
        </div>
        <br />
      </section>
    </article>
  );
};

export default BulletinShow;
