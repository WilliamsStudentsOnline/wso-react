// React imports
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const DiscussionPost = ({ post, currentUser, authToken }) => {
  const [deleted, setDeleted] = useState(post.deleted);
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState(post.content);

  const deleteHandler = () => {
    // @TODO: write something to overcome this confirm
    // eslint-disable-next-line no-restricted-globals
    const confirmDelete = confirm('Are you sure?'); // eslint-disable-line no-alert
    if (!confirmDelete) return;
    axios({
      url: `/posts/${post.id}`,
      method: 'delete',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    }).then(() => {
      setDeleted(true);
    });
  };
  const editHandler = () => {
    // @TODO: write something to overcome this confirm
    setEdit(true);
  };

  const editControls = () => {
    if (!post.user_id) return null;
    if (post.user_id === currentUser.id || currentUser.admin) {
      return (
        <>
          <button
            className="inline-button"
            type="button"
            onClick={deleteHandler}
          >
            Delete
          </button>
          <button className="inline-button" type="button" onClick={editHandler}>
            Edit
          </button>
        </>
      );
    }
    return null;
  };

  const commentContent = () => {
    if (!deleted && !edit) {
      return (
        <>
          <div className="comment-content">
            <b>
              {post.user ? (
                <a href={`/facebook/users/${post.user.id}`}>{post.user.name}</a>
              ) : (
                post.ex_user_name
              )}
            </b>
            &nbsp;
            <em>{new Date(post.created_at).toDateString()}</em>
            <br />
            <br />
            {post.content}
          </div>
          <div>{editControls()}</div>
        </>
      );
    }

    if (deleted) return 'Deleted';

    return (
      <form
        className="edit_post"
        id={`edit_post_${post.id}`}
        action={`/posts/${post.id}`}
        acceptCharset="UTF-8"
        method="post"
      >
        <input name="utf8" type="hidden" value="✓" />
        <input type="hidden" name="_method" value="patch" />
        <input type="hidden" name="authenticity_token" value={authToken} />
        <textarea
          name="post[content]"
          id="post_content"
          value={value}
          onChange={event => {
            setValue(event.target.value);
          }}
        >
          {post.content}
        </textarea>
        <input
          type="submit"
          name="commit"
          value="Save"
          className="submit"
          data-disable-with="Save"
        />
      </form>
    );
  };

  return (
    <div id={`p${post.id}`} className="comment">
      <div className="comment-image" />
      {commentContent()}
    </div>
  );
};

DiscussionPost.propTypes = {
  post: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  authToken: PropTypes.string.isRequired,
};

export default DiscussionPost;
