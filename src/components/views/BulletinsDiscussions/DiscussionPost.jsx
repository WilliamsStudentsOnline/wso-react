// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, CommentCard, Line, Paragraph } from "../../ui";

// Redux imports
import { useAppSelector } from "../../../lib/store";
import { getCurrUser, getWSO } from "../../../lib/authSlice";

// Additional imports
import { Link, useNavigate } from "react-router-dom";
import Markdown from "markdown-to-jsx";
import { formatBoardDate } from "./BulletinUtils";

const markdownOptions = {
  overrides: {
    h1: { component: "h5" },
    h2: { component: "h5" },
    h3: { component: "h5" },
    h4: { component: "h5" },
    h5: { component: "h5" },
    h6: { component: "h5" },
  },
};

const DiscussionPost = ({ post, onDeleted }) => {
  const currUser = useAppSelector(getCurrUser);
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();

  const [deleted, updateDeleted] = useState(false);
  const [edit, setEdit] = useState(false);
  const [reply, updateReply] = useState(post.content);
  const [currPost, updateCurrPost] = useState(post);
  const [flagged, updateFlagged] = useState(false);

  const submitHandler = async (event) => {
    event.preventDefault();

    if (reply === "") return;
    const params = { content: reply };

    try {
      const response = await wso.boardService.updateBoardReply(post.id, params);
      setEdit(false);
      updateCurrPost(response.data);
    } catch (error) {
      navigateTo("/error", { replace: true, state: { error } });
    }
  };

  const deleteHandler = async () => {
    // eslint-disable-next-line no-restricted-globals, no-alert
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      await wso.boardService.deleteBoardReply(post.id);
      // OP delete cascades to the whole thread — parent should navigate away
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
      await wso.boardService.flagBoardReply(post.id);
      updateFlagged(true);
    } catch (error) {
      navigateTo("/error", { replace: true, state: { error } });
    }
  };

  const editControls = () => {
    if (!post.userID) return null;
    const isOwner = currUser && post.userID === currUser.id;
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
        <div className="markdown-content">
          <Markdown options={markdownOptions}>{currPost.content}</Markdown>
        </div>
      }
      meta={<span>{formatBoardDate(currPost.createdAt)}</span>}
      cornerActions={editControls()}
    />
  );
};

DiscussionPost.propTypes = {
  post: PropTypes.object.isRequired,
  onDeleted: PropTypes.func,
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
