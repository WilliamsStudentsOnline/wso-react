// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DiscussionPost from "./DiscussionPost";

// Redux/Routing imports
import { connect } from "react-redux";
import { createRouteNodeSelector } from "redux-router5";
import { getToken } from "../../../selectors/auth";

// Additional Imports
import { checkAndHandleError } from "../../../lib/general";
import { getDiscussion, postPost } from "../../../api/bulletins";

const DiscussionShow = ({ token, route }) => {
  // const perPage = 20;
  // const [page, updatePage] = useState(0);
  // const [total, updateTotal] = useState(0);
  const [posts, updatePosts] = useState([]);
  const [reply, updateReply] = useState("");
  const [discussion, updateDiscussion] = useState(null);

  const [errors, updateErrors] = useState([]);

  useEffect(() => {
    const loadDiscussion = async () => {
      const discussionResponse = await getDiscussion(
        token,
        route.params.discussionID
      );

      if (checkAndHandleError(discussionResponse)) {
        updateDiscussion(discussionResponse.data.data);
        updatePosts(discussionResponse.data.data.posts);
        // updateTotal(discussionResponse.data.paginationTotal);
      } else if (discussionResponse.error.errors) {
        updateErrors(discussionResponse.error.errors);
      } else {
        updateErrors(discussionResponse.error.message);
      }
    };

    loadDiscussion();
  }, [token, route.params.discussionID]);

  const submitHandler = async (event) => {
    event.preventDefault();

    if (!reply) return;

    const params = { content: reply, discussionID: discussion.id };
    const response = await postPost(token, params);

    if (checkAndHandleError(response)) {
      updatePosts(posts.concat([response.data.data]));
    }
  };

  const renderPosts = () => {
    if (posts.length === 0) return null;

    return posts.map((post) => (
      <DiscussionPost post={post} key={post.id} token={token} />
    ));
  };

  if (!discussion) return null;

  return (
    <section className="discussion-thread">
      <h5>
        <b>{discussion.title}</b>
        <br />
        <br />
        <br />
      </h5>

      {renderPosts()}

      <div className="reply">
        <form onSubmit={submitHandler}>
          <strong>Reply</strong>
          <textarea
            id="post_content"
            value={reply}
            onChange={(event) => updateReply(event.target.value)}
          />

          {errors && errors.length > 0 ? (
            <div id="errors">
              <b>Please correct the following error(s):</b>
              {errors.map((msg) => (
                <p key={msg}>{msg}</p>
              ))}
            </div>
          ) : null}

          <input
            type="submit"
            value="Submit"
            className="submit"
            data-disable-with="Submit"
          />
        </form>
      </div>
    </section>
  );
};

DiscussionShow.propTypes = {
  token: PropTypes.string.isRequired,
  route: PropTypes.object.isRequired,
};

DiscussionShow.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("discussions");

  return (state) => ({
    token: getToken(state),
    ...routeNodeSelector(state),
  });
};

export default connect(mapStateToProps)(DiscussionShow);
