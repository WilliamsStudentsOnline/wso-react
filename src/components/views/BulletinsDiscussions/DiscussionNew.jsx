// React imports
import React from "react";
import PropTypes from "prop-types";
import DiscussionLayout from "./DiscussionLayout";

const DiscussionsNew = ({
  thread,
  post,
  authToken,
  notice,
  warning,
  currentUser,
}) => {
  const renderErrors = () => {
    if (!thread.errors && !post.errors) return null;
    if (thread.errors.length === 0 && post.errors.length === 0) return null;

    return (
      <div id="error_explanation">
        <b>{`${thread.errors.length + post.errors.length} errors:`}</b>
        <ul>
          {thread.errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
          {post.errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <DiscussionLayout
      notice={notice}
      warning={warning}
      currentUser={currentUser}
    >
      <article className="list-creation">
        <section>
          {renderErrors()}
          <form
            className="new_post"
            id="new_post"
            action="/posts"
            acceptCharset="UTF-8"
            method="post"
          >
            <br />
            <input name="utf8" type="hidden" value="✓" />
            <input type="hidden" name="authenticity_token" value={authToken} />
            <input
              placeholder="Title"
              type="text"
              name="post[title]"
              id="post_title"
            />
            <textarea
              placeholder="Body"
              name="post[content]"
              id="post_content"
            />
            <input
              type="submit"
              name="commit"
              value="Submit"
              className="submit"
              data-disable-with="Submit"
            />
          </form>
        </section>
      </article>
    </DiscussionLayout>
  );
};

DiscussionsNew.propTypes = {
  thread: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  authToken: PropTypes.string.isRequired,
  currentUser: PropTypes.object,
  notice: PropTypes.string,
  warning: PropTypes.string,
};

DiscussionsNew.defaultProps = {
  warning: "",
  currentUser: {},
  notice: "",
};

export default DiscussionsNew;
