// React imports
import React, { useCallback, useEffect, useState } from "react";
import { EmptyState, Line, Pagination } from "../../ui";
import BoardListControls from "./BoardListControls";

// Redux and routing imports
import { getWSO, getCurrUser } from "../../../lib/authSlice";
import { useAppSelector } from "../../../lib/store";

// Additional imports
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PostType } from "../../../lib/types";
import {
  BoardThread,
  boardApiType,
  boardThreadAuthor,
  boardThreadDate,
  boardThreadPath,
  boardThreadTitle,
  boardThreadTypeLabel,
} from "./BulletinUtils";
import "./BoardFeed.css";

const perPage = 20;

const parseTypesParam = (raw: string | null): PostType[] => {
  if (!raw) return [];
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter((t): t is PostType => Object.values<string>(PostType).includes(t));
};

const excerpt = (body?: string) => {
  if (!body) return undefined;
  const trimmed = body.replace(/\s+/g, " ").trim();
  if (!trimmed) return undefined;
  return trimmed.length > 180 ? `${trimmed.slice(0, 180)}…` : trimmed;
};

/** Unified board feed — optional ?types=announcement,job filters. */
const BulletinIndex = () => {
  const wso = useAppSelector(getWSO);
  const currUser = useAppSelector(getCurrUser);
  const navigateTo = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [threads, updateThreads] = useState<BoardThread[] | undefined>(
    undefined
  );
  const [page, updatePage] = useState(0);
  const [total, updateTotal] = useState(0);
  const [selectedTypes, updateSelectedTypes] = useState<PostType[]>(() =>
    parseTypesParam(searchParams.get("types"))
  );

  const setTypes = (types: PostType[]) => {
    updateSelectedTypes(types);
    updatePage(0);
    const next = new URLSearchParams(searchParams);
    if (types.length === 0) {
      next.delete("types");
    } else {
      next.set("types", types.join(","));
    }
    setSearchParams(next, { replace: true });
  };

  const loadThreads = useCallback(
    async (pageIndex: number) => {
      const params = {
        limit: perPage,
        offset: pageIndex * perPage,
        sort: "activity" as const,
        ...(selectedTypes.length > 0
          ? { type: selectedTypes.map(boardApiType) }
          : {}),
      };

      try {
        const response = await wso.boardService.listBoardThreads(params);
        const pageThreads = response.data?.threads ?? [];
        const pageTotal = response.paginationTotal ?? 0;
        updateTotal(pageTotal);
        if (pageThreads.length === 0 && pageIndex > 0 && pageTotal > 0) {
          const lastPage = Math.max(0, Math.ceil(pageTotal / perPage) - 1);
          updatePage(lastPage);
          return;
        }
        updateThreads(pageThreads);
      } catch (error) {
        navigateTo("/error", { replace: true, state: { error } });
      }
    },
    [wso, selectedTypes, navigateTo]
  );

  // Load from page — do not reset page when loadThreads identity changes
  // (e.g. token refresh), or arrow clicks snap back to page 0.
  useEffect(() => {
    loadThreads(page);
  }, [page, loadThreads]);

  const clickHandler = (direction: number) => {
    if (direction === -1 && page > 0) {
      updatePage(page - 1);
    } else if (direction === 1 && total - (page + 1) * perPage > 0) {
      updatePage(page + 1);
    }
  };

  const selectionHandler = (newPage: number) => {
    updatePage(newPage);
  };

  const deleteHandler = async (threadID?: number) => {
    // eslint-disable-next-line no-restricted-globals, no-alert
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      if (!threadID) {
        throw new Error("No thread ID could be found. Fail to delete.");
      }
      await wso.boardService.deleteBoardThread(threadID);
      loadThreads(page);
    } catch (error) {
      navigateTo("/error", { replace: true, state: { error } });
    }
  };

  const canDelete = (thread: BoardThread) =>
    Boolean(
      (thread.userID && currUser?.id === thread.userID) || currUser?.admin
    );

  const headerChips = (
    <div className="board-table-header">
      <BoardListControls
        selectedTypes={selectedTypes}
        onTypesChange={setTypes}
      />
    </div>
  );

  const pager = (
    <Pagination
      clickHandler={clickHandler}
      page={page}
      perPage={perPage}
      total={total}
      showPages
      selectionHandler={selectionHandler}
    />
  );

  if (threads && threads.length === 0) {
    return (
      <section className="margin-vertical-small board-feed">
        <div className="board-table">
          {headerChips}
          <EmptyState variant="no-posts">No Posts</EmptyState>
        </div>
      </section>
    );
  }

  return (
    <section className="margin-vertical-small board-feed">
      {pager}
      <div className="board-table">
        {headerChips}
        <div className="board-table-body">
          {threads
            ? threads.map((thread) => {
                const bodyExcerpt = excerpt(thread.body);
                const replyCount = thread.replyCount || 0;
                const replies = `${replyCount} ${
                  replyCount === 1 ? "reply" : "replies"
                }`;
                return (
                  <div className="board-table-row" key={thread.id}>
                    <div className="board-table-row-main">
                      <div className="board-table-row-headline">
                        <span className="board-chip board-chip-static is-active">
                          {boardThreadTypeLabel(thread)}
                        </span>
                        <Link
                          className="board-table-title"
                          to={boardThreadPath(thread)}
                        >
                          {boardThreadTitle(thread)}
                        </Link>
                      </div>
                      <div className="board-table-row-meta">
                        {thread.userID ? (
                          <Link to={`/facebook/users/${thread.userID}`}>
                            {boardThreadAuthor(thread)}
                          </Link>
                        ) : (
                          boardThreadAuthor(thread)
                        )}
                        {replies ? ` · ${replies}` : ""}
                      </div>
                      {bodyExcerpt ? (
                        <div className="board-table-row-excerpt">
                          {bodyExcerpt}
                        </div>
                      ) : null}
                    </div>
                    <div className="board-table-row-aside">
                      <span className="board-table-date list-date">
                        {boardThreadDate(thread)}
                      </span>
                      {canDelete(thread) ? (
                        <button
                          type="button"
                          className="board-table-delete"
                          onClick={() => deleteHandler(thread.id)}
                        >
                          Delete
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })
            : [...Array(8)].map((_, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <div className="board-table-row" key={i}>
                  <div className="board-table-row-main">
                    <Line width="70%" />
                  </div>
                  <span className="board-table-date list-date">
                    <Line width="90%" center />
                  </span>
                </div>
              ))}
        </div>
      </div>
      {pager}
    </section>
  );
};

export default BulletinIndex;
