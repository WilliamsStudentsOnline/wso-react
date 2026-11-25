import React, { useState, useEffect } from "react";

import { getWSO } from "../../../lib/authSlice";
import { useAppSelector } from "../../../lib/store";
import { useNavigate, useParams, useSearchParams } from "react-router";

import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
/// Keep this after the "react-date-picker" import so that this css style will take priority.
import "../../stylesheets/DatePicker.css";
import { PostType, PostTypeSingular } from "../../../lib/types";
import { boardApiType, boardThreadPath } from "./BulletinUtils";
import "./BoardFeed.css";

const MIN_POLL_OPTIONS = 2;
const POLL_SLOTS = 4;

const endOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

const BulletinForm = () => {
  const wso = useAppSelector(getWSO);

  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigateTo = useNavigate();

  const initialType =
    (params.type as PostType | undefined) ||
    (searchParams.get("type") as PostType | null) ||
    PostType.Announcements;

  const [title, updateTitle] = useState("");
  const [source, updateSource] = useState("");
  const [destination, updateDestination] = useState("");
  const [offer, updateOffer] = useState(false);
  const [startDate, updateStartDate] = useState(new Date());
  const [type, updateType] = useState<PostType>(
    Object.values(PostType).includes(initialType)
      ? initialType
      : PostType.Announcements
  );
  const [body, updateBody] = useState<string>("");
  const [pollEnabled, updatePollEnabled] = useState(false);
  const [pollOptions, updatePollOptions] = useState<string[]>(
    Array(POLL_SLOTS).fill("")
  );
  const [pollCloses, updatePollCloses] = useState<Date | null>(null);
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
          onChange={(value) => {
            if (value instanceof Date) updateStartDate(value);
          }}
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

    const withPoll = type === PostType.Discussions && !editing && pollEnabled;
    const options = pollOptions.map((o) => o.trim()).filter(Boolean);
    if (withPoll && options.length < MIN_POLL_OPTIONS) {
      updateErrors([`Polls need at least ${MIN_POLL_OPTIONS} options.`]);
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
          ...(type !== PostType.Discussions
            ? { startsAt: dateAdjusted.toISOString() }
            : {}),
          ...(withPoll
            ? {
                poll: {
                  options,
                  ...(pollCloses
                    ? { closesAt: endOfDay(pollCloses).toISOString() }
                    : {}),
                },
              }
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
        <div className="board-tabs" role="group" aria-label="Post type">
          {Object.values(PostType).map((t) => (
            <button
              key={t}
              type="button"
              className={`board-tab${type === t ? " is-active" : ""}`}
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

  const rideSpecificFields = () => (
    <div className="board-form__row">
      <div className="field">
        <h5>
          <b>From</b>
        </h5>
        <input
          type="text"
          value={source}
          onChange={(event) => updateSource(event.target.value)}
        />
      </div>
      <div className="field">
        <h5>
          <b>To</b>
        </h5>
        <input
          type="text"
          value={destination}
          onChange={(event) => updateDestination(event.target.value)}
        />
      </div>
    </div>
  );

  const rideDateField = () => (
    <div className="board-form__row">
      <div className="field">
        <h5>
          <b>Date</b>
        </h5>
        <DatePicker
          value={startDate}
          onChange={(value) => {
            if (value instanceof Date) updateStartDate(value);
          }}
        />
      </div>
      <div className="field">
        <h5>
          <b>I&apos;m</b>
        </h5>
        <div className="board-tabs" role="group" aria-label="Ride direction">
          {[
            { label: "Requesting a ride", value: false },
            { label: "Offering a ride", value: true },
          ].map((option) => (
            <button
              key={option.label}
              type="button"
              className={`board-tab${offer === option.value ? " is-active" : ""}`}
              aria-pressed={offer === option.value}
              onClick={() => updateOffer(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const setPollOption = (index: number, value: string) =>
    updatePollOptions((prev) => prev.map((o, i) => (i === index ? value : o)));

  const pollFields = () => (
    <>
      <div className="field">
        <h5>
          <b>Poll options</b>
        </h5>
        <div className="board-poll-grid">
          {pollOptions.map((option, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div className="board-poll-cell" key={index}>
              <input
                type="text"
                maxLength={255}
                placeholder={`Option ${index + 1}`}
                aria-label={`Option ${index + 1}`}
                value={option}
                onChange={(event) => setPollOption(index, event.target.value)}
              />
              {option ? (
                <button
                  type="button"
                  className="board-poll-clear"
                  aria-label={`Clear option ${index + 1}`}
                  onClick={() => setPollOption(index, "")}
                >
                  ×
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </div>
      <div className="field">
        <h5>
          <b>Poll closes (optional)</b>
        </h5>
        <DatePicker
          value={pollCloses}
          minDate={new Date()}
          onChange={(value) =>
            updatePollCloses(value instanceof Date ? value : null)
          }
        />
      </div>
    </>
  );

  const pollToggle = () => {
    if (type !== PostType.Discussions || editing) return null;
    return (
      <>
        <div className="field">
          <div className="board-tabs">
            <button
              type="button"
              className={`board-tab${pollEnabled ? " is-active" : ""}`}
              aria-pressed={pollEnabled}
              onClick={() => updatePollEnabled((prev) => !prev)}
            >
              {pollEnabled ? "Poll added" : "+ Add a poll"}
            </button>
          </div>
        </div>
        {pollEnabled ? pollFields() : null}
      </>
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
    <article className="list-creation board-form">
      <section>
        <form onSubmit={submitHandler}>
          {generateErrors()}
          {typeChips()}

          {type === PostType.Rides ? rideSpecificFields() : titleField()}
          {type === PostType.Rides ? rideDateField() : null}

          <div className="field">
            <h5>
              <b>Message</b>
            </h5>
            <textarea
              value={body}
              onChange={(event) => updateBody(event.target.value)}
            />
          </div>

          {type === PostType.Rides ? null : startDateField()}
          {pollToggle()}

          <div className="board-form__actions">
            <input
              type="submit"
              value="Submit"
              className="submit"
              data-disable-with="Submit"
            />
            <button
              type="button"
              className="board-text-btn"
              onClick={() =>
                window.history.state?.idx > 0
                  ? navigateTo(-1)
                  : navigateTo("/bulletin")
              }
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </article>
  );
};

export default BulletinForm;
