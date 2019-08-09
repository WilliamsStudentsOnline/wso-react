// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";

import axios from "axios";
import DiscussionPost from "./DiscussionPost";
import DiscussionLayout from "./DiscussionLayout";

const DiscussionShow = ({
  thread,
  posts,
  currentUser,
  authToken,
  notice,
  warning,
}) => {
  const [currPosts, updatePosts] = useState(posts);
  const [reply, updateReply] = useState("");

  const replyHandler = () => {
    axios({
      url: `/posts`,
      data: {
        utf8: "✓",
        post: {
          discussion_id: thread.id,
          content: reply,
        },
        commit: "submit",
      },
      method: "post",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    }).then((response) => {
      updatePosts(currPosts.concat([response.data.post]));
      updateReply("");
    });
  };

  const renderPosts = () => {
    if (currPosts.length === 0) return null;
    return currPosts.map((post) => (
      <DiscussionPost
        currentUser={currentUser}
        authToken={authToken}
        post={post}
        key={post.id}
      />
    ));
  };

  return (
    <DiscussionLayout
      notice={notice}
      warning={warning}
      currentUser={currentUser}
    >
      <section className="discussion-thread">
        <h5>
          <b>{thread.title}</b>
          <br />
          <br />
          <br />
        </h5>

        {renderPosts()}

        <div className="reply">
          <form
            className="new_post"
            id="new_post"
            action="/posts"
            acceptCharset="UTF-8"
            data-remote="true"
            method="post"
          >
            <input name="utf8" type="hidden" value="✓" />
            <input
              value={thread.id}
              type="hidden"
              name="post[discussion_id]"
              id="post_discussion_id"
            />
            <strong>Reply</strong>
            <textarea
              name="post[content]"
              id="post_content"
              value={reply}
              onChange={(event) => updateReply(event.target.value)}
            />

            <div id="errors" />
            <button
              type="button"
              name="commit"
              value="Submit"
              data-disable-with="Submit"
              onClick={replyHandler}
            >
              Submit
            </button>
          </form>
        </div>
      </section>
    </DiscussionLayout>
  );
};

DiscussionShow.propTypes = {
  thread: PropTypes.object.isRequired,
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentUser: PropTypes.object,
  authToken: PropTypes.string.isRequired,
  notice: PropTypes.string,
  warning: PropTypes.string,
};

DiscussionShow.defaultProps = {
  notice: "",
  warning: "",
  currentUser: {},
};

export default DiscussionShow;
