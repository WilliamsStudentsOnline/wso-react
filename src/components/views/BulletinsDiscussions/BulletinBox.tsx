import React, { useCallback, useEffect, useState } from "react";
import "./BoardFeed.css";
import { Line } from "../../ui";
import BoardListControls from "./BoardListControls";
import { getWSO } from "../../../lib/authSlice";
import { useAppSelector } from "../../../lib/store";
import { Link } from "react-router";
import { ModelsBoardThread } from "wso-api-client/lib/services/types";
import { PostType } from "../../../lib/types";
import {
  boardApiType,
  boardThreadDate,
  boardThreadPath,
  boardThreadTitle,
  boardThreadTypeSingular,
} from "./BulletinUtils";

const HOME_LIMIT = 6;

const BulletinBox = () => {
  const wso = useAppSelector(getWSO);
  const [threads, updateThreads] = useState<ModelsBoardThread[] | undefined>(
    undefined
  );
  const [selectedTypes, updateSelectedTypes] = useState<PostType[]>([]);

  const loadThreads = useCallback(async () => {
    if (!wso.isAuthenticated()) {
      updateThreads([]);
      return;
    }
    try {
      const response = await wso.boardService.listBoardThreads({
        limit: HOME_LIMIT,
        sort: "activity",
        ...(selectedTypes.length > 0
          ? { type: selectedTypes.map(boardApiType) }
          : {}),
      });
      updateThreads(response.data ?? []);
    } catch {
      updateThreads([]);
    }
  }, [wso, selectedTypes]);

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  return (
    <div className="board-table">
      <div className="board-table-header">
        <BoardListControls
          selectedTypes={selectedTypes}
          onTypesChange={updateSelectedTypes}
        >
          <Link
            className="board-tab board-tab--new"
            to={
              selectedTypes.length === 1
                ? `/bulletin/new?type=${selectedTypes[0]}`
                : "/bulletin/new"
            }
          >
            + New post
          </Link>
        </BoardListControls>
      </div>
      <div className="board-table-body">
        {threads
          ? threads.map((thread) => (
              <div className="board-table-row" key={thread.id}>
                <div className="board-table-row-main">
                  <div className="board-table-row-headline">
                    <span className="board-type">
                      {boardThreadTypeSingular(thread)}
                    </span>
                    <Link
                      className="board-table-title"
                      to={boardThreadPath(thread)}
                    >
                      {boardThreadTitle(thread)}
                    </Link>
                  </div>
                </div>
                <span className="board-table-date">
                  {boardThreadDate(thread)}
                </span>
              </div>
            ))
          : [...Array(HOME_LIMIT)].map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <div className="board-table-row" key={i}>
                <div className="board-table-row-main">
                  <Line width="70%" />
                </div>
                <span className="board-table-date">
                  <Line width="90%" center />
                </span>
              </div>
            ))}
      </div>
    </div>
  );
};

export default BulletinBox;
