// React imports
import React, { useState, useEffect } from "react";
import { Button, CommentCard, Line, Paragraph } from "../../ui";
import Markdown from "markdown-to-jsx";
import DiscussionPost, { DiscussionPostSkeleton } from "./DiscussionPost";

// Redux and Routing imports
import { useAppSelector } from "../../../lib/store";
import { getCurrUser, getWSO } from "../../../lib/authSlice";

// Additional Imports
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  BoardThread,
  boardFeedPathForType,
  boardThreadDate,
  boardThreadTitle,
} from "./BulletinUtils";

type BoardPost = NonNullable<BoardThread["posts"]>[number];

const markdownOptions = {
  overrides: {
    h1: { component: "h2" as const, props: {} },
    h2: { component: "h2" as const, props: {} },
    h3: { component: "h2" as const, props: {} },
    h4: { component: "h5" as const, props: {} },
    h5: { component: "h5" as const, props: {} },
    h6: { component: "h5" as const, props: {} },
  },
};

const BulletinShow = () => {
  const wso = useAppSelector(getWSO);
  const currUser = useAppSelector(getCurrUser);

  const params = useParams();
  const navigateTo = useNavigate();

  const [thread, updateThread] = useState<BoardThread | undefined>(undefined);
  const [posts, updatePosts] = useState<BoardPost[] | null>(null);
  const [reply, updateReply] = useState("");
  const [errors, updateErrors] = useState<string[]>([]);
  const [flagged, updateFlagged] = useState(false);

  const deleteHandler = async () => {
    // eslint-disable-next-line no-restricted-globals, no-alert
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      if (!thread?.id) {
        throw new Error("No thread ID found. Fail to delete.");
      }
      await wso.boardService.deleteBoardThread(thread.id);
      navigateTo(boardFeedPathForType(params.type || thread.type));
    } catch (error) {
      navigateTo("/error", { replace: true, state: { error } });
    }
  };

  const flagHandler = async () => {
    // eslint-disable-next-line no-restricted-globals, no-alert
    const confirmFlag = confirm("Flag this thread for moderator review?");
    if (!confirmFlag || !thread?.id) return;

    try {
      await wso.boardService.flagBoardThread(thread.id);
      updateFlagged(true);
    } catch (error) {
      navigateTo("/error", { replace: true, state: { error } });
    }
  };

  const submitReply = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!reply.trim() || !thread?.id) return;

    try {
      const response = await wso.boardService.createBoardReply(thread.id, {
        content: reply,
      });
      const created = response.data;
      if (!created) {
        updateErrors(["Failed to post reply."]);
        return;
      }
      updatePosts((prev) => (prev || []).concat([created]));
      updateReply("");
      updateErrors([]);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const e = error as any;
      if (e?.message) {
        updateErrors([e.message]);
      } else if (e?.errors) {
        updateErrors(e.errors);
      } else {
        updateErrors(["Failed to post reply."]);
      }
    }
  };

  useEffect(() => {
    const loadThread = async () => {
      if (!params.bulletinID) return;

      try {
        const response = await wso.boardService.getBoardThread(
          Number(params.bulletinID)
        );
        updateThread(response.data);
        updatePosts(response.data?.posts || []);
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((error as any).errorCode === 404)
          navigateTo("/404", { replace: true });
      }
    };

    loadThread();
  }, [params.bulletinID, wso, navigateTo]);

  const generateBulletinStarter = () => {
    if (thread?.userID && thread.user?.name) {
      return (
        <Link to={`/facebook/users/${thread.userID}`}>{thread.user.name}</Link>
      );
    }

    if (thread?.user?.name) return thread.user.name;
    if (thread?.exUserName) return thread.exUserName;

    return "WSO User";
  };

  const isOwner = Boolean(currUser && currUser.id === thread?.userID);
  const canModerate = Boolean(currUser && (isOwner || currUser.admin));
  const repliesEnabled = thread?.repliesEnabled !== false;

  const editDeleteButtons = () => {
    if (!currUser || !thread) return null;

    return (
      <div className="main-table-corner-actions">
        {isOwner ? (
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigateTo("edit")}
          >
            Edit
          </Button>
        ) : null}
        {canModerate ? (
          <Button type="button" variant="secondary" onClick={deleteHandler}>
            Delete Thread
          </Button>
        ) : null}
        {!isOwner && !flagged ? (
          <Button type="button" variant="secondary" onClick={flagHandler}>
            Flag
          </Button>
        ) : null}
        {flagged ? <span className="small-font">Flagged</span> : null}
      </div>
    );
  };

  const renderPosts = () => {
    if (!posts) {
      return [...Array(3)].map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <DiscussionPostSkeleton key={index} />
      ));
    }

    if (posts.length > 0) {
      return posts.map((post) => (
        <DiscussionPost
          post={post}
          key={post.id}
          onDeleted={(deletedPost: BoardPost) => {
            const remaining = (posts || []).filter(
              (p) => p.id !== deletedPost.id
            );
            // OP (or last post) delete cascades to the whole thread
            if (deletedPost.isOP || remaining.length === 0) {
              navigateTo(boardFeedPathForType(params.type || thread?.type));
              return;
            }
            updatePosts(remaining);
          }}
        />
      ));
    }

    // Fallback when API has body but no posts array
    if (thread?.body) {
      return (
        <CommentCard
          className="discussion-post"
          header={<h1>{generateBulletinStarter()}</h1>}
          body={
            <div className="markdown-content">
              <Markdown options={markdownOptions}>
                {thread.body ||
                  "There was an error displaying the content for this post."}
              </Markdown>
            </div>
          }
          meta={<span>{boardThreadDate(thread)}</span>}
        />
      );
    }

    return null;
  };

  const replyArea = () => {
    if (!currUser || !thread || !repliesEnabled) return null;

    return (
      <div className="reply">
        <form onSubmit={submitReply}>
          <strong>Reply</strong>
          <textarea
            id="post_content"
            value={reply}
            onChange={(event) => updateReply(event.target.value)}
          />
          {errors.length > 0 && (
            <div id="errors">
              <b>Please correct the following error(s):</b>
              {errors.map((msg) => (
                <p key={msg}>{msg}</p>
              ))}
            </div>
          )}
          <Button type="submit" variant="submit">
            Submit
          </Button>
        </form>
      </div>
    );
  };

  if (!thread)
    return (
      <section className="discussion-thread">
        <div className="thread-title-row">
          <h3 className="thread-title">
            <Line width="50%" />
          </h3>
        </div>
        <CommentCard
          className="discussion-post"
          header={<Line width="30%" />}
          body={<Paragraph numRows={5} />}
          meta={<Line width="25%" />}
        />
      </section>
    );

  return (
    <section className="discussion-thread">
      <div className="thread-title-row">
        <h3 className="thread-title">{boardThreadTitle(thread)}</h3>
        {editDeleteButtons()}
      </div>
      {renderPosts()}
      {replyArea()}
    </section>
  );
};

export default BulletinShow;
