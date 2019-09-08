// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { getToken, getCurrUser } from "../../../selectors/auth";

import { getDiscussions } from "../../../api/bulletins";

import { checkAndHandleError } from "../../../lib/general";
import { connect } from "react-redux";
import { Link } from "react-router5";

import { format } from "timeago.js";

const DiscussionIndex = ({ currUser, token }) => {
  const perPage = 20;
  const [page, updatePage] = useState(0);
  const [total, updateTotal] = useState(0);
  const [threads, updateThreads] = useState([]);

  const loadThreads = async (newPage) => {
    const params = {
      limit: 20,
      offset: newPage * perPage,
      start: new Date(),
      preload: ["user", "postsUsers"],
    };
    const discussionsResponse = await getDiscussions(token, params);
    if (checkAndHandleError(discussionsResponse)) {
      updateThreads(discussionsResponse.data.data);
      updateTotal(discussionsResponse.data.paginationTotal);
    }
  };

  useEffect(() => {
    loadThreads(0);
  }, [token]);

  const clickHandler = (number) => {
    if (number === -1 && page > 0) {
      updatePage(page - 1);
      loadThreads(page - 1);
    } else if (number === 1 && total - (page + 1) * perPage > 0) {
      updatePage(page + 1);
      loadThreads(page + 1);
    }
  };

  const lastCommenter = (thread) => {
    if (!thread.posts) return "";
    const last = thread.posts[thread.posts.length - 1];
    if (!last) return "";
    if (last.user) return last.user.name;
    return last.exUserName;
  };

  if (threads.length < 0) return null;

  return (
    <section className="margin-vertical-small">
      {threads.map((thread) => (
        <div className="comment" key={thread.id}>
          <h5>
            <b>
              <Link
                routeName="discussions.show"
                routeParams={{ discussionID: thread.id }}
              >
                {thread.title}
              </Link>
            </b>
          </h5>
          <div className="small-font">
            Started {new Date(thread.createdTime).toDateString()}
            {" by "}
            {thread.user ? thread.user.name : thread.exUserName}
          </div>
          <div className="small-font">
            <span>
              Posts: <b>{thread.posts.length}</b>
            </span>
            {thread.posts.length > 0
              ? `| Last post was about ${format(
                  new Date(thread.lastActive)
                )} ago by ${lastCommenter(thread)}`
              : null}
          </div>
          {currUser.admin ? (
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
      <div>
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
          disabled={total - (page + 1) * perPage <= 0}
        >
          Next
        </button>
      </div>
    </section>
  );
};

DiscussionIndex.propTypes = {
  currUser: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
};

DiscussionIndex.defaultProps = {};

const mapStateToProps = (state) => ({
  token: getToken(state),
  currUser: getCurrUser(state),
});

export default connect(mapStateToProps)(DiscussionIndex);
