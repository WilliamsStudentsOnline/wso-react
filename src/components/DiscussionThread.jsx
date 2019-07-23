// React imports
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DiscussionLayout from './DiscussionLayout';

const DiscussionThread = ({ threads, currentUser, notice, warning }) => {
  const perPage = 20;
  const [page, updatePage] = useState(0);
  const displayThreads =
    threads.length - 1 > (page + 1) * perPage
      ? threads.slice(page * perPage, (page + 1) * perPage)
      : threads.slice(page * perPage, threads.length - 1);

  const clickHandler = number => {
    if (number === -1 && page > 0) {
      updatePage(page - 1);
    } else if (number === 1 && threads.length - (page + 1) * perPage > 0) {
      updatePage(page + 1);
    }
  };

  const lastCommenter = thread => {
    if (!thread.children) return '';
    const last = thread.children[thread.children.length - 1];
    if (!last) return '';
    if (last.user) return last.user.name;
    return last.ex_user_name;
  };
  return (
    <DiscussionLayout
      notice={notice}
      warning={warning}
      currentUser={currentUser}
    >
      <article className="main-table">
        <section className="margin-vertical-small">
          {displayThreads.map(thread => (
            <div className="comment" key={thread.id}>
              <h5>
                <b>
                  <a href={`/discussions/${thread.id}`}>{thread.title}</a>
                </b>
              </h5>
              <div className="small-font">
                Started 
                {' '}
                {new Date(thread.created_at).toDateString()}
                {' by '}
                {thread.user ? thread.user.name : thread.ex_user_name}
              </div>
              <div className="small-font">
                <span>
                  Posts: 
                  {' '}
                  <b>{thread.children.length}</b>
                </span>
                {thread.children.length > 0
                  ? `| Last post was ${new Date(
                      thread.created_at
                    ).toDateString()} ago by ${lastCommenter(thread)}`
                  : null}
              </div>
              {currentUser.admin ? (
                <div>
                  <a
                    confirm="Are you sure?"
                    rel="nofollow"
                    data-method="delete"
                    href={`/discussions/${thread.id}`}
                  >
                    [CLOSE]
                  </a>
                </div>
              ) : null}
            </div>
          ))}
          <button
            type="button"
            onClick={() => clickHandler(-1)}
            disabled={page === 0}
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => clickHandler(1)}
            disabled={threads.length - (page + 1) * perPage <= 0}
          >
            Next
          </button>
        </section>
      </article>
    </DiscussionLayout>
  );
};

DiscussionThread.propTypes = {
  threads: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentUser: PropTypes.object,
  notice: PropTypes.string,
  warning: PropTypes.string,
};

DiscussionThread.defaultProps = {
  notice: '',
  warning: '',
  currentUser: {},
};

export default DiscussionThread;
