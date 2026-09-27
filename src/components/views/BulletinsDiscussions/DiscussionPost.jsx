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

const DiscussionPost = ({ post }) => {
  const currUser = useAppSelector(getCurrUser);
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();

  const [deleted, updateDeleted] = useState(false);
  const [edit, setEdit] = useState(false);
  const [reply, updateReply] = useState(post.content);
  const [currPost, updateCurrPost] = useState(post);

  const submitHandler = async (event) => {
    event.preventDefault();

    if (reply === "") return;
    const params = { content: reply };

    try {
      const response = await wso.bulletinService.updatePost(post.id, params);
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
      await wso.bulletinService.deletePost(post.id);
      updateDeleted(true);
    } catch (error) {
      navigateTo("/error", { replace: true, state: { error } });
    }
  };

  const editControls = () => {
    if (!post.userID) return null;
    if (currUser && (post.userID === currUser.id || currUser.admin)) {
      return (
        <>
          {post.userID === currUser.id ? (
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

    if (currPost.exUserName !== "") return currPost.exUserName;

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
      meta={<span>{new Date(currPost.createdTime).toDateString()}</span>}
      cornerActions={editControls()}
    />
  );
};

DiscussionPost.propTypes = {
  post: PropTypes.object.isRequired,
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
