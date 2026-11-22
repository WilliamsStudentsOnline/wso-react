import React, { useState } from "react";
import { Button, CommentCard, Line, Paragraph } from "../../ui";

import { useAppSelector } from "../../../lib/store";
import { getCurrUser, getWSO } from "../../../lib/authSlice";

import { Link, useNavigate } from "react-router";
import Markdown from "markdown-to-jsx";
import { formatBoardDate, BoardThread } from "./BulletinUtils";

type BoardPost = NonNullable<BoardThread["posts"]>[number];

const markdownOptions = {
  overrides: {
    h1: { component: "h5" as const, props: {} },
    h2: { component: "h5" as const, props: {} },
    h3: { component: "h5" as const, props: {} },
    h4: { component: "h5" as const, props: {} },
    h5: { component: "h5" as const, props: {} },
    h6: { component: "h5" as const, props: {} },
  },
};

export interface DiscussionPostProps {
  post: BoardPost;
  onDeleted?: (post: BoardPost) => void;
}

const DiscussionPost = ({ post, onDeleted }: DiscussionPostProps) => {
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
    const confirmDelete = confirm("Are you sure?");
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
    const confirmFlag = confirm("Flag this post for moderator review?");
    if (!confirmFlag) return;

    try {
      await wso.boardService.flagBoardReply(post.id!);
      updateFlagged(true);
    } catch (error) {
      navigateTo("/error", { replace: true, state: { error } });
    }
  };

  const editControls = () => {
    const isOwner = Boolean(currPost.isMine);
    if (currUser && (isOwner || currUser.admin)) {
      return (
        <>
          {isOwner ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => setEdit(true)}
            >
              Edit
            </Button>
          ) : null}
          <Button type="button" variant="secondary" onClick={deleteHandler}>
            Delete
          </Button>
        </>
      );
    }
    if (currUser && !isOwner && !flagged) {
      return (
        <Button type="button" variant="secondary" onClick={flagHandler}>
          Flag
        </Button>
      );
    }
    if (flagged) return <span className="small-font">Flagged</span>;
    return null;
  };

  const generateCommentWriter = () => {
    let writer: React.ReactNode = currPost.exUserName || null;
    if (currPost.user) {
      writer = (
        <Link to={`/facebook/users/${currPost.userID}`}>
          {currPost.user.name}
        </Link>
      );
    }

    if (currPost.anonymous) {
      return writer ? (
        <>
          Anonymous <span className="board-anon-reveal">({writer})</span>
        </>
      ) : (
        "Anonymous"
      );
    }

    return writer ?? "WSO User";
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
      header={
        <h1>
          {generateCommentWriter()}
          {currPost.byOP ? (
            <span className="board-chip board-chip-static board-op-badge">
              OP
            </span>
          ) : null}
        </h1>
      }
      body={
        <div className="markdown-content">
          <Markdown options={markdownOptions}>
            {currPost.content ?? ""}
          </Markdown>
        </div>
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
