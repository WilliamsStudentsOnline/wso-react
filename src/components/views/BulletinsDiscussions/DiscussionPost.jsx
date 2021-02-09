// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Line, Paragraph } from "../../Skeleton";

// Redux imports
import { connect } from "react-redux";
import { getCurrUser, getWSO } from "../../../selectors/auth";
import { actions } from "redux-router5";

// Additional imports
import { Link } from "react-router5";

const DiscussionPost = ({ currUser, navigateTo, post, wso }) => {
  const [deleted, updateDeleted] = useState(false);
  const [edit, setEdit] = useState(false);
  const [reply, updateReply] = useState(post.content);
  const [currPost, updateCurrPost] = useState(post);

  // Handles submission of updated post.
  const submitHandler = async (event) => {
    event.preventDefault();

    if (reply === "") return;
    const params = { content: reply };

    try {
      const response = await wso.bulletinService.updatePost(post.id, params);
      setEdit(false);
      updateCurrPost(response.data);
    } catch (error) {
      navigateTo("error", { error });
    }
  };

  // Handles deletion of discussion post
  const deleteHandler = async () => {
    // eslint-disable-next-line no-restricted-globals, no-alert
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      await wso.bulletinService.deletePost(post.id);
      updateDeleted(true);
    } catch (error) {
      navigateTo("error", { error });
    }
  };

  // renders edit controls if the current user has permissions
  const editControls = () => {
    if (!post.userID) return null;
    if (currUser && (post.userID === currUser.id || currUser.admin)) {
      return (
        <div>
          {post.userID === currUser.id ? (
            <button
              className="inline-button"
              type="button"
              onClick={() => setEdit(true)}
            >
              Edit
            </button>
          ) : null}

          <button
            className="inline-button"
            type="button"
            onClick={deleteHandler}
          >
            Delete
          </button>
          <br />
        </div>
      );
    }
    return null;
  };

  // Comment Writer
  const generateCommentWriter = () => {
    if (currPost.user) {
      return (
        <Link
          routeName="facebook.users"
          routeParams={{ userID: currPost.userID }}
        >
          {currPost.user.name}
        </Link>
      );
    }

    if (currPost.exUserName !== "") return currPost.exUserName;

    return "WSO User";
  };

  // Generates comment contents
  const commentContent = () => {
    if (!edit) {
      return (
        <div className="comment-content">
          <b>{generateCommentWriter()}</b>
          &nbsp;
          <em>{new Date(currPost.createdTime).toDateString()}</em>
          <br />
          {editControls()}
          {currPost.content}
        </div>
      );
    }

    // Editing comment.
    return (
      <form onSubmit={submitHandler}>
        <textarea
          id="post_content"
          value={reply}
          onChange={(event) => {
            updateReply(event.target.value);
          }}
        >
          {currPost.content}
        </textarea>
        <input
          type="submit"
          value="Save"
          className="submit"
          data-disable-with="Save"
        />
      </form>
    );
  };

  if (deleted) return null;
  return <div className="comment">{commentContent()}</div>;
};

DiscussionPost.propTypes = {
  currUser: PropTypes.object,
  navigateTo: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  wso: PropTypes.object.isRequired,
};

DiscussionPost.defaultProps = {
  currUser: null,
};

const DiscussionPostSkeleton = () => (
  <div className="comment">
    <div className="comment-content">
      <Line width="20%" />
      &nbsp;
      <Line width="20%" />
      <br />
      <Paragraph numRows={5} />
    </div>
  </div>
);

const mapStateToProps = (state) => ({
  currUser: getCurrUser(state),
  wso: getWSO(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DiscussionPost);
export { DiscussionPostSkeleton };
