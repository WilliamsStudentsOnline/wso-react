// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DiscussionPost, { DiscussionPostSkeleton } from "./DiscussionPost";
import { Line } from "../../Skeleton";

// Redux/Routing imports
import { connect } from "react-redux";
import { createRouteNodeSelector } from "redux-router5";
import { getAPI } from "../../../selectors/auth";

const DiscussionShow = ({ api, route }) => {
  const [posts, updatePosts] = useState(null);
  const [reply, updateReply] = useState("");
  const [discussion, updateDiscussion] = useState(null);

  const [errors, updateErrors] = useState([]);

  useEffect(() => {
    const loadDiscussion = async () => {
      try {
        const discussionResponse = await api.bulletinService.getDiscussion(
          route.params.discussionID,
          ["posts", "postsUsers"]
        );

        updateDiscussion(discussionResponse.data);
        updatePosts(discussionResponse.data.posts || []);
      } catch (error) {
        if (error.errors) {
          updateErrors(error.errors);
        } else {
          updateErrors(error.message);
        }
      }
    };

    loadDiscussion();
  }, [api, route.params.discussionID]);

  const submitHandler = async (event) => {
    event.preventDefault();

    if (!reply) return;

    const params = { content: reply, discussionID: discussion.id };

    try {
      const response = await api.bulletinService.createPost(params);
      updatePosts(posts.concat([response.data]));
      updateReply("");
    } catch (error) {
      // eslint-disable-next-line no-empty
    }
  };

  const renderPosts = () => {
    if (!posts)
      return [...Array(5)].map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <DiscussionPostSkeleton key={index} />
      ));
    if (posts.length === 0) return null;

    return posts.map((post) => <DiscussionPost post={post} key={post.id} />);
  };

  const replyArea = () => {
    return (
      <div className="reply">
        <form onSubmit={submitHandler}>
          <strong>Reply</strong>
          <textarea
            id="post_content"
            value={reply}
            onChange={(event) => updateReply(event.target.value)}
          />

          {errors && errors.length > 0 && (
            <div id="errors">
              <b>Please correct the following error(s):</b>
              {errors.map((msg) => (
                <p key={msg}>{msg}</p>
              ))}
            </div>
          )}

          <input
            type="submit"
            value="Submit"
            className="submit"
            data-disable-with="Submit"
          />
        </form>
      </div>
    );
  };

  return (
    <section className="discussion-thread">
      <h5>
        <b>{discussion ? discussion.title : <Line width="50%" />}</b>
        <br />
        <br />
        <br />
      </h5>

      {renderPosts()}
      {replyArea()}
    </section>
  );
};

DiscussionShow.propTypes = {
  api: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

DiscussionShow.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("discussions");

  return (state) => ({
    api: getAPI(state),
    ...routeNodeSelector(state),
  });
};

export default connect(mapStateToProps)(DiscussionShow);
