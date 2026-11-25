import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { EmptyState, Line } from "../../ui";
import BoardPager from "./BoardPager";
import Markdown from "markdown-to-jsx/react";
import { boardPreviewOptions } from "./boardMarkdown";

import { getWSO, getCurrUser } from "../../../lib/authSlice";
import { useAppSelector } from "../../../lib/store";

import { Link, useNavigate, useSearchParams } from "react-router";
import { PostType } from "../../../lib/types";
import {
  BoardThread,
  boardApiType,
  boardThreadAuthor,
  boardThreadDate,
  boardThreadPath,
  boardThreadTitle,
  boardThreadTypeSingular,
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

const PREVIEW_CHARS = 400;

const BulletinIndex = () => {
  const wso = useAppSelector(getWSO);
  const currUser = useAppSelector(getCurrUser);
  const navigateTo = useNavigate();
  const [searchParams] = useSearchParams();
  const typesParam = searchParams.get("types");
  const selectedTypes = useMemo(
    () => parseTypesParam(typesParam),
    [typesParam]
  );
  const latestRequest = useRef(0);

  const [threads, updateThreads] = useState<BoardThread[] | undefined>(
    undefined
  );
  const [page, updatePage] = useState(0);
  const [total, updateTotal] = useState(0);
  const [prevTypesParam, updatePrevTypesParam] = useState(typesParam);
  if (prevTypesParam !== typesParam) {
    updatePrevTypesParam(typesParam);
    updatePage(0);
  }

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

      latestRequest.current += 1;
      const request = latestRequest.current;

      try {
        const response = await wso.boardService.listBoardThreads(params);
        if (request !== latestRequest.current) return;
        const pageThreads = response.data ?? [];
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

  useEffect(() => {
    loadThreads(page);
  }, [page, loadThreads]);

  const changePage = (newPage: number) => {
    updatePage(newPage);
    window.scrollTo(0, 0);
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

  if (threads && threads.length === 0) {
    return (
      <section className="board-feed">
        <EmptyState variant="no-posts">No Posts</EmptyState>
      </section>
    );
  }

  return (
    <section className="board-feed">
      <ul className="board-list">
        {threads
          ? threads.map((thread) => {
              const replyCount = thread.replyCount || 0;
              return (
                <li className="board-list__row" key={thread.id}>
                  <div className="board-list__line">
                    <Link
                      className="board-list__title"
                      to={boardThreadPath(thread)}
                    >
                      {boardThreadTitle(thread)}
                    </Link>
                    <span className="board-list__date">
                      {boardThreadDate(thread)}
                    </span>
                  </div>
                  {thread.body?.trim() ? (
                    <div className="board-list__excerpt">
                      <Markdown options={boardPreviewOptions}>
                        {thread.body.slice(0, PREVIEW_CHARS)}
                      </Markdown>
                    </div>
                  ) : null}
                  <div className="board-list__line board-list__meta">
                    <span>
                      {boardThreadTypeSingular(thread)}
                      {" · "}
                      {thread.userID ? (
                        <Link to={`/facebook/users/${thread.userID}`}>
                          {boardThreadAuthor(thread)}
                        </Link>
                      ) : (
                        boardThreadAuthor(thread)
                      )}
                      {` · ${replyCount} ${
                        replyCount === 1 ? "reply" : "replies"
                      }`}
                      {thread.poll ? " · Poll" : ""}
                    </span>
                    {canDelete(thread) ? (
                      <button
                        type="button"
                        className="board-text-btn"
                        onClick={() => deleteHandler(thread.id)}
                      >
                        Delete
                      </button>
                    ) : null}
                  </div>
                </li>
              );
            })
          : [...Array(8)].map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <li className="board-list__row" key={i}>
                <Line width="50%" />
                <Line width="70%" />
                <Line width="30%" />
              </li>
            ))}
      </ul>
      <BoardPager
        page={page}
        pageCount={Math.ceil(total / perPage)}
        onChange={changePage}
      />
    </section>
  );
};

export default BulletinIndex;
