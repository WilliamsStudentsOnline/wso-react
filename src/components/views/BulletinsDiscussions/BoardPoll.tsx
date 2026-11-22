import React, { useState } from "react";
import { ModelsBoardPoll } from "wso-api-client/lib/services/types";

import { useAppSelector } from "../../../lib/store";
import { getCurrUser, getWSO } from "../../../lib/authSlice";
import "./BoardFeed.css";

type BoardPollProps = {
  threadID: number;
  poll: ModelsBoardPoll;
};

const formatClosesAt = (raw: string) =>
  new Date(raw).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const BoardPoll = ({ threadID, poll: initialPoll }: BoardPollProps) => {
  const wso = useAppSelector(getWSO);
  const currUser = useAppSelector(getCurrUser);

  const [poll, updatePoll] = useState(initialPoll);
  const [error, updateError] = useState("");

  const total = poll.totalVotes;
  const showResults = total !== undefined && total !== null;
  const canVote = Boolean(currUser) && !poll.closed;

  const vote = async (optionID?: number) => {
    if (!optionID || !canVote || optionID === poll.myVote) return;

    try {
      const response = await wso.boardService.voteBoardPoll(threadID, {
        optionID,
      });
      if (response.data) updatePoll(response.data);
      updateError("");
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateError((err as any)?.message ?? "Failed to vote.");
    }
  };

  const status = () => {
    if (poll.closed) return "Poll closed";
    if (!currUser) return "Log in to vote";
    const parts = showResults ? [] : ["Vote to see results"];
    if (poll.closesAt) parts.push(`Closes ${formatClosesAt(poll.closesAt)}`);
    return parts.join(" · ");
  };

  return (
    <div className="board-poll">
      {poll.options?.map((option) => {
        const votes = option.votes ?? 0;
        const percent =
          showResults && total ? Math.round((votes * 100) / total) : 0;
        const mine = option.id === poll.myVote;
        return (
          <button
            key={option.id}
            type="button"
            className={`board-poll-option${mine ? " is-mine" : ""}`}
            disabled={!canVote}
            aria-pressed={mine}
            onClick={() => vote(option.id)}
          >
            {showResults ? (
              <span
                className="board-poll-bar"
                style={{ width: `${percent}%` }}
              />
            ) : null}
            <span className="board-poll-label">{option.label}</span>
            {showResults ? (
              <span className="board-poll-count">
                {percent}% ({votes})
              </span>
            ) : null}
          </button>
        );
      })}
      <div className="board-poll-meta">
        {[
          showResults ? `${total} ${total === 1 ? "vote" : "votes"}` : "",
          status(),
        ]
          .filter(Boolean)
          .join(" · ")}
      </div>
      {error ? <p className="board-poll-error">{error}</p> : null}
    </div>
  );
};

export default BoardPoll;
