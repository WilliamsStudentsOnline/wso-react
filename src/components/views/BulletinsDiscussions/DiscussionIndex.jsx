// React imports
import React, { useState, useEffect } from "react";
import { Pagination } from "../../ui";
import ThreadListItem from "./ThreadListItem";

// Redux/Routing imports
import { useAppSelector } from "../../../lib/store";
import { getCurrUser, getWSO } from "../../../lib/authSlice";

// Additional Imports
import { Link, useNavigate } from "react-router-dom";
import { format } from "timeago.js";

const DiscussionIndex = () => {
  const currUser = useAppSelector(getCurrUser);
  const wso = useAppSelector(getWSO);

  const navigateTo = useNavigate();

  const perPage = 20;
  const [page, updatePage] = useState(0);
  const [total, updateTotal] = useState(0);
  const [threads, updateThreads] = useState(null);

  const loadThreads = async (newPage) => {
    const params = {
      limit: 20,
      offset: newPage * perPage,
      preload: ["user", "postsUsers"],
    };
    try {
      const discussionsResponse = await wso.bulletinService.listDiscussions(
        params
      );

      updateThreads(discussionsResponse.data);
      updateTotal(discussionsResponse.paginationTotal);
    } catch (error) {
      navigateTo("/error", { replace: true, state: { error } });
    }
  };

  useEffect(() => {
    loadThreads(0);
    // eslint-disable-next-line
  }, [wso]);

  const clickHandler = (number) => {
    if (number === -1 && page > 0) {
      loadThreads(page - 1);
      updatePage(page - 1);
    } else if (number === 1 && total - (page + 1) * perPage > 0) {
      loadThreads(page + 1);
      updatePage(page + 1);
    }
  };

  const selectionHandler = (newPage) => {
    updatePage(newPage);
    loadThreads(newPage);
  };

  const lastCommenter = (thread) => {
    if (!thread.posts) return "";
    const last = thread.posts[thread.posts.length - 1];
    if (!last) return "WSO User";
    if (last.user) return last.user.name;
    if (last.exUserName !== "") return last.exUserName;
    return "WSO User";
  };

  const threadStarter = (thread) => {
    if (thread.user) return thread.user.name;
    if (thread.exUserName !== "") return thread.exUserName;
    return "WSO User";
  };

  const deleteHandler = async (threadID) => {
    // eslint-disable-next-line no-restricted-globals
    const confirmDelete = confirm("Are you sure?"); // eslint-disable-line no-alert
    if (!confirmDelete) return;

    try {
      await wso.bulletinService.deleteDiscussion(threadID);
      loadThreads(page);
    } catch (error) {
      navigateTo("/error", { replace: true, state: { error } });
    }
  };

  const canDelete = (thread) =>
    Boolean(currUser && (currUser.admin || currUser.id === thread.userID));

  return (
    <section className="margin-vertical-small">
      <Pagination
        selectionHandler={selectionHandler}
        clickHandler={clickHandler}
        page={page}
        total={total}
        perPage={perPage}
        showPages
      />
      {threads
        ? threads.map((thread) => (
            <ThreadListItem
              key={thread.id}
              title={
                <Link to={`/discussions/threads/${thread.id}`}>
                  {thread.title}
                </Link>
              }
              meta={`Started ${new Date(
                thread.createdTime
              ).toDateString()} by ${threadStarter(thread)}`}
              detail={
                thread.posts
                  ? `Posts: ${
                      thread.posts.length
                    } | Last post was about ${format(
                      new Date(thread.lastActive)
                    )} ago by ${lastCommenter(thread)}`
                  : undefined
              }
              showDelete={canDelete(thread)}
              onDelete={() => deleteHandler(thread.id)}
            />
          ))
        : [...Array(20)].map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <ThreadListItem key={i} skeleton />
          ))}

      <Pagination
        selectionHandler={selectionHandler}
        clickHandler={clickHandler}
        page={page}
        total={total}
        perPage={perPage}
        showPages
      />
      <br />
    </section>
  );
};

export default DiscussionIndex;
