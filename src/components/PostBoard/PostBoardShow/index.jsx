// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DiscussionPost, { DiscussionPostSkeleton } from "../DiscussionPost";
import { Line } from "../../common/Skeleton";

// Redux/Routing imports
import { connect } from "react-redux";
import { actions, createRouteNodeSelector } from "redux-router5";
import { getWSO, getCurrUser } from "../../../selectors/auth";
import { discussionType, bulletinTypeRide } from "../../../constants/general";

const PostBoardShow = ({ currUser, navigateTo, route, wso }) => {
  const [posts, setPosts] = useState(null);
  const [reply, setReply] = useState("");
  const [discussion, setBulletin] = useState(null);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const loadDiscussion = async () => {
      try {
        const discussionResponse = await wso.bulletinService.getDiscussion(
          route.params.bulletinID,
          ["posts", "postsUsers"]
        );

        if (isMounted) {
          setBulletin(discussionResponse.data);
          setPosts(discussionResponse.data.posts || []);
        }
      } catch (error) {
        if (error.errorCode === 404) navigateTo("404");
      }
    };

    const loadRide = async () => {
      try {
        const rideResponse = await wso.bulletinService.getRide(
          route.params.bulletinID
        );

        if (isMounted) {
          setBulletin(rideResponse.data);
          setPosts([]);
        }
      } catch (error) {
        if (error.errorCode === 404) navigateTo("404");
      }
    };

    const loadBulletin = async () => {
      try {
        const rideResponse = await wso.bulletinService.getBulletin(
          route.params.bulletinID
        );

        if (isMounted) {
          setBulletin(rideResponse.data);
          setPosts([]);
        }
      } catch (error) {
        if (error.errorCode === 404) navigateTo("404");
      }
    };

    if (route.params.type === discussionType) loadDiscussion();
    else if (route.params.type === bulletinTypeRide) loadRide();
    else loadBulletin();

    return () => {
      isMounted = false;
    };
  }, [navigateTo, route.params, wso]);

  const submitHandler = async (event) => {
    event.preventDefault();

    if (!reply) return;

    const params = { content: reply, discussionID: discussion.id };

    try {
      const response = await wso.bulletinService.createPost(params);
      setPosts(posts.concat([response.data]));
      setReply("");
    } catch (error) {
      if (error.message) {
        setErrors([error.message]);
      } else if (error.errors) {
        setErrors(error.errors);
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
            onChange={(event) => setReply(event.target.value)}
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
    <div style={{ width: "100%" }}>
      <h5>
        <b>{discussion ? discussion.title : <Line width="50%" />}</b>
        <br />
        <br />
        <br />
      </h5>

      {renderPosts()}
      {replyArea()}
    </div>
  );
};

PostBoardShow.propTypes = {
  currUser: PropTypes.object,
  navigateTo: PropTypes.func.isRequired,
  route: PropTypes.object.isRequired,
  wso: PropTypes.object.isRequired,
};

PostBoardShow.defaultProps = {
  currUser: null,
};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("bulletins");

  return (state) => ({
    currUser: getCurrUser(state),
    wso: getWSO(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostBoardShow);
