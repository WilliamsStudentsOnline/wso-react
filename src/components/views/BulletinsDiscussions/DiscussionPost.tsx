import React, { useState } from "react";
import { Button, CommentCard, Line, Paragraph } from "../../ui";

import { useAppSelector } from "../../../lib/store";
import { getCurrUser, getWSO } from "../../../lib/authSlice";

import { Link, useNavigate } from "react-router";
import Markdown from "markdown-to-jsx/react";
import { boardMarkdownOptions } from "./boardMarkdown";
import { formatBoardDate, BoardThread } from "./BulletinUtils";

type BoardPost = NonNullable<BoardThread["posts"]>[number];

export interface DiscussionPostProps {
  post: BoardPost;
  onDeleted?: (post: BoardPost) => void;
  poll?: React.ReactNode;
}

const DiscussionPost = ({ post, onDeleted, poll }: DiscussionPostProps) => {
  const currUser = useAppSelector(getCurrUser);
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();

  const [deleted, updateDeleted] = useState(false);
  const [edit, setEdit] = useState(false);
  const [reply, updateReply] = useState(post.content);
  const [currPost, updateCurrPost] = useState(post);
  const [flagged, updateFlagged] = useState(false);

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (reply === "") return;
    const params = { content: reply };

    try {
      const response = await wso.boardService.updateBoardReply(
        post.id!,
        params
      );
      setEdit(false);
      if (response.data) updateCurrPost(response.data);
    } catch (error) {
      navigateTo("/error", { replace: true, state: { error } });
    }
  };

  const deleteHandler = async () => {
    // eslint-disable-next-line no-restricted-globals, no-alert
    const confirmDelete = confirm(
      post.isOP ? "Delete this thread and all its replies?" : "Are you sure?"
    );
    if (!confirmDelete) return;

    try {
      await wso.boardService.deleteBoardReply(post.id!);
      if (typeof onDeleted === "function") {
        onDeleted(post);
      } else {
        updateDeleted(true);
      }
    } catch (error) {
      navigateTo("/error", { replace: true, state: { error } });
    }
  };

  const flagHandler = async () => {
    // eslint-disable-next-line no-restricted-globals, no-alert
    const confirmFlag = confirm(
      `Flag this ${post.isOP ? "thread" : "post"} for moderator review?`
    );
    if (!confirmFlag) return;

    try {
      if (post.isOP) {
        await wso.boardService.flagBoardThread(post.threadID!);
      } else {
        await wso.boardService.flagBoardReply(post.id!);
      }
      updateFlagged(true);
    } catch (error) {
      navigateTo("/error", { replace: true, state: { error } });
    }
  };

  const editControls = () => {
    if (!currUser || !post.userID) return null;
    const isOwner = post.userID === currUser.id;
    return (
      <>
        {isOwner ? (
          <button
            type="button"
            className="board-text-btn"
            onClick={() => (post.isOP ? navigateTo("edit") : setEdit(true))}
          >
            Edit
          </button>
        ) : null}
        {!isOwner && !flagged ? (
          <button
            type="button"
            className="board-text-btn"
            onClick={flagHandler}
          >
            Flag
          </button>
        ) : null}
        {flagged ? <span className="small-font">Flagged</span> : null}
        {isOwner || currUser.admin ? (
          <button
            type="button"
            className="board-text-btn"
            onClick={deleteHandler}
          >
            {post.isOP ? "Delete thread" : "Delete"}
          </button>
        ) : null}
      </>
    );
  };

  const generateCommentWriter = () => {
    if (currPost.user) {
      return (
        <Link to={`/facebook/users/${currPost.userID}`}>
          {currPost.user.name}
        </Link>
      );
    }

    if (currPost.exUserName) return currPost.exUserName;

    return "WSO User";
  };

  if (deleted) return null;

  if (edit) {
    return (
      <CommentCard
        className="discussion-post"
        body={
          <form onSubmit={submitHandler}>
            <textarea
              id="post_content"
              value={reply}
              onChange={(event) => {
                updateReply(event.target.value);
              }}
            />
            <Button type="submit" variant="submit">
              Save
            </Button>
          </form>
        }
      />
    );
  }

  return (
    <CommentCard
      className="discussion-post"
      header={<h1>{generateCommentWriter()}</h1>}
      body={
        <>
          <div className="markdown-content">
            <Markdown options={boardMarkdownOptions}>
              {currPost.content ?? ""}
            </Markdown>
          </div>
          {poll}
        </>
      }
      meta={<span>{formatBoardDate(currPost.createdAt)}</span>}
      cornerActions={editControls()}
    />
  );
};

const DiscussionPostSkeleton = () => (
  <CommentCard
    className="discussion-post"
    header={<Line width="20%" />}
    body={<Paragraph numRows={5} />}
    meta={<Line width="20%" />}
  />
);

export default DiscussionPost;
export { DiscussionPostSkeleton };
