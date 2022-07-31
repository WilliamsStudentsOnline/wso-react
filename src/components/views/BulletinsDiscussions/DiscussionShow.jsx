// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DiscussionPost, { DiscussionPostSkeleton } from "./DiscussionPost";
import { Line } from "../../Skeleton";

// Redux/Routing imports
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getWSO, getCurrUser } from "../../../selectors/auth";

const DiscussionShow = ({ currUser, wso }) => {
  const params = useParams();
  const navigateTo = useNavigate();

  const [posts, updatePosts] = useState(null);
  const [reply, updateReply] = useState("");
  const [discussion, updateDiscussion] = useState(null);
  const [errors, updateErrors] = useState([]);

  useEffect(() => {
    const loadDiscussion = async () => {
      try {
        const discussionResponse = await wso.bulletinService.getDiscussion(
          params.discussionID,
          ["posts", "postsUsers"]
        );

        updateDiscussion(discussionResponse.data);
        updatePosts(discussionResponse.data.posts || []);
      } catch (error) {
        if (error.errorCode === 404) navigateTo("/404", { replace: true });
      }
    };

    loadDiscussion();
  }, [params.discussionID, wso]);

  const submitHandler = async (event) => {
    event.preventDefault();

    if (!reply) return;

    const reqParams = { content: reply, discussionID: discussion.id };

    try {
      const response = await wso.bulletinService.createPost(reqParams);
      updatePosts(posts.concat([response.data]));
      updateReply("");
    } catch (error) {
      if (error.message) {
        updateErrors([error.message]);
      } else if (error.errors) {
        updateErrors(error.errors);
      }
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
    if (!currUser) return null;

    return (
      <div className="reply">
        <form onSubmit={submitHandler}>
          <strong>Reply</strong>
          <textarea
            id="post_content"
            value={reply}
            onChange={(event) => updateReply(event.target.value)}
          />
          {errors?.length > 0 && (
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
  currUser: PropTypes.object,
  wso: PropTypes.object.isRequired,
};

DiscussionShow.defaultProps = {
  currUser: null,
};

const mapStateToProps = () => {
  return (state) => ({
    currUser: getCurrUser(state),
    wso: getWSO(state),
  });
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DiscussionShow);
