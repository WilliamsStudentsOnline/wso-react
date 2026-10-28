// React imports
import React, { useState, useEffect } from "react";

// Redux and routing imports
import { getWSO } from "../../../lib/authSlice";
import { useAppSelector } from "../../../lib/store";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

// Additional Imports
import DatePicker from "react-date-picker";
/// Keep this after the "react-date-picker" import so that this css style will take priority.
import "../../stylesheets/DatePicker.css";
import { PostType, PostTypeSingular } from "../../../lib/types";
import { boardApiType, boardThreadPath } from "./BulletinUtils";
import "./BoardFeed.css";

const BulletinForm = () => {
  const wso = useAppSelector(getWSO);

  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigateTo = useNavigate();

  const initialType =
    (params.type as PostType | undefined) ||
    (searchParams.get("type") as PostType | null) ||
    PostType.Announcements;

  // For non-rides / non-discussion
  const [title, updateTitle] = useState("");

  // For rides
  const [source, updateSource] = useState("");
  const [destination, updateDestination] = useState("");
  const [offer, updateOffer] = useState(false);

  // Common
  const [startDate, updateStartDate] = useState(new Date());
  const [type, updateType] = useState<PostType>(
    Object.values(PostType).includes(initialType)
      ? initialType
      : PostType.Announcements
  );
  const [body, updateBody] = useState<string>("");
  const [errors, updateErrors] = useState<string[]>([]);
  const editing = Boolean(params.bulletinID);

  useEffect(() => {
    const loadThread = async () => {
      const threadID = Number(params.bulletinID);

      try {
        const response = await wso.boardService.getBoardThread(threadID);
        const thread = response.data;
        if (!thread) return;

        updateBody(thread.body ?? "");
        if (thread.type === PostType.Rides || thread.type === "ride") {
          updateType(PostType.Rides);
          updateSource(thread.ride?.source ?? "");
          updateDestination(thread.ride?.destination ?? "");
          updateOffer(Boolean(thread.ride?.offeringRide));
          updateStartDate(() => {
            if (thread.startsAt) return new Date(thread.startsAt);
            return new Date();
          });
        } else {
          if (thread.type === "discussion") {
            updateType(PostType.Discussions);
          } else if (
            Object.values<string>(PostType).includes(thread.type || "")
          ) {
            updateType(thread.type as PostType);
          }
          updateTitle(thread.title ?? "");
          updateStartDate(() => {
            if (thread.startsAt) return new Date(thread.startsAt);
            return new Date();
          });
        }
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((error as any).errorCode === 403) {
          navigateTo("/403", { replace: true });
        }
      }
    };

    if (params.bulletinID) {
      loadThread();
    } else if (
      params.type &&
      Object.values<string>(PostType).includes(params.type)
    ) {
      updateType(params.type as PostType);
    }
  }, [wso, params.bulletinID, params.type, navigateTo]);

  const startDateField = () => {
    if (type !== PostType.Announcements && type !== PostType.Rides) return null;

    return (
      <div className="field">
        <h5>
          <b>Show my post starting on</b>
        </h5>
        <DatePicker
          value={startDate}
          onChange={(date: Date) => updateStartDate(date)}
        />
      </div>
    );
  };

  const submitHandler: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();

    if (!body.trim()) {
      updateErrors(["Message is empty."]);
      return;
    }
    if (type !== PostType.Rides && !title.trim()) {
      updateErrors(["Title is empty."]);
      return;
    }

    try {
      let response;
      const dateAdjusted = new Date(startDate.getTime() + 30000);
      const apiType = boardApiType(type);

      if (type === PostType.Rides) {
        const rideParams = {
          type: apiType,
          title: `${source} to ${destination}`,
          body,
          startsAt: dateAdjusted.toISOString(),
          repliesEnabled: true,
          ride: {
            offeringRide: offer,
            source,
            destination,
          },
        };
        response = params.bulletinID
          ? await wso.boardService.updateBoardThread(
              Number(params.bulletinID),
              rideParams
            )
          : await wso.boardService.createBoardThread(rideParams);
      } else {
        const bulletinParams = {
          type: apiType,
          title,
          body,
          repliesEnabled: true,
          // discussions stay undated; other types get startsAt
          ...(type !== PostType.Discussions
            ? { startsAt: dateAdjusted.toISOString() }
            : {}),
        };
        response = params.bulletinID
          ? await wso.boardService.updateBoardThread(
              Number(params.bulletinID),
              bulletinParams
            )
          : await wso.boardService.createBoardThread(bulletinParams);
      }

      const created = response?.data;
      if (created?.id) {
        navigateTo(
          boardThreadPath({
            ...created,
            type: created.type || apiType,
          })
        );
      }
    } catch (error) {
      console.log(error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const e = error as any;
      if ("errors" in e) {
        updateErrors(e.errors);
      } else {
        updateErrors([e.message]);
      }
    }
  };

  const generateErrors = () => {
    if (errors && errors.length > 0) {
      return (
        <div id="errors">
          <b>Please correct the following error(s):</b>
          {errors.map((msg) => (
            <p key={msg}>{msg}</p>
          ))}
        </div>
      );
    }

    return null;
  };

  const typeChips = () => {
    if (editing) return null;
    return (
      <div className="field">
        <h5>
          <b>Type</b>
        </h5>
        <div className="board-type-chips" role="group" aria-label="Post type">
          {Object.values(PostType).map((t) => (
            <button
              key={t}
              type="button"
              className={`board-chip${type === t ? " is-active" : ""}`}
              aria-pressed={type === t}
              onClick={() => updateType(t)}
            >
              {PostTypeSingular.get(t)}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const rideSpecificFields = () => {
    return (
      <>
        <div className="field">
          <label htmlFor="ride_offer">
            <input
              type="checkbox"
              checked={offer}
              onChange={(event) => updateOffer(event.target.checked)}
            />
            I&apos;m offering this ride
          </label>
        </div>

        <div className="field">
          <h5>
            <b>Source</b>
          </h5>
          <input
            type="text"
            value={source}
            onChange={(event) => updateSource(event.target.value)}
          />
        </div>

        <div className="field">
          <h5>
            <b>Destination</b>
          </h5>
          <input
            type="text"
            value={destination}
            onChange={(event) => updateDestination(event.target.value)}
          />
        </div>
      </>
    );
  };

  const rideDateField = () => {
    return (
      <div className="field">
        <h5>
          <b>I am offering/requesting a ride on</b>
        </h5>
        <DatePicker
          value={startDate}
          onChange={(date: Date) => updateStartDate(date)}
        />
      </div>
    );
  };

  const titleField = () => {
    if (type === PostType.Rides) return null;
    return (
      <div className="field">
        <h5>
          <b>Title</b>
        </h5>
        <input
          type="text"
          value={title}
          onChange={(event) => updateTitle(event.target.value)}
        />
      </div>
    );
  };

  return (
    <article className="list-creation">
      <section>
        <form onSubmit={submitHandler}>
          <br />
          {generateErrors()}
          {typeChips()}

          {type === PostType.Rides ? rideSpecificFields() : titleField()}
          {type === PostType.Rides ? rideDateField() : startDateField()}

          <div className="field">
            <h5>
              <b>Message</b>
            </h5>
            <textarea
              value={body}
              onChange={(event) => updateBody(event.target.value)}
            />
          </div>

          <input
            type="submit"
            value="Submit"
            className="submit"
            data-disable-with="Submit"
          />
        </form>
      </section>
    </article>
  );
};

export default BulletinForm;
