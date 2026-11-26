import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAppSelector } from "../../../lib/store";
import { getWSO } from "../../../lib/authSlice";
import {
  AdminModeratorTaskResponse,
  ModelsBoardPost,
  ModelsBoardThread,
  ModelsFactrakSurvey,
} from "wso-api-client/lib/services/types";
import {
  boardThreadAuthor,
  boardThreadPath,
  boardThreadTitle,
} from "../BulletinsDiscussions/BulletinUtils";
import AdminTaskSection from "./AdminTaskSection";
import "./Admin.css";

const TASK_FACTRAK = "FACTRAK_REVIEW";
const TASK_NEW_TAG = "NEW_USER_TAG";
const TASK_USER_PHOTO = "USER_PHOTO_REVIEW";
const TASK_BOARD_THREAD = "BOARD_THREAD_REVIEW";
const TASK_BOARD_POST = "BOARD_POST_REVIEW";
const RESOLUTION_APPROVED = "APPROVED";
const RESOLUTION_REJECTED = "REJECTED";

type TaskGroup = {
  taskReference: string;
  taskType: string;
  tasks: AdminModeratorTaskResponse[];
  sample: AdminModeratorTaskResponse;
};

type FactrakReviewContext = {
  survey?: ModelsFactrakSurvey;
};

type ApiError = {
  errorCode?: number;
};

const groupByReference = (tasks: AdminModeratorTaskResponse[]): TaskGroup[] => {
  const order: string[] = [];
  const byRef = new Map<string, TaskGroup>();

  tasks.forEach((task) => {
    const key = task.taskReference || String(task.id);
    let group = byRef.get(key);
    if (!group) {
      group = {
        taskReference: key,
        taskType: String(task.taskType || ""),
        tasks: [],
        sample: task,
      };
      byRef.set(key, group);
      order.push(key);
    }
    group.tasks.push(task);
  });

  return order.flatMap((key) => {
    const group = byRef.get(key);
    return group ? [group] : [];
  });
};

const surveyFromContext = (task: AdminModeratorTaskResponse) => {
  const ctx = task.context as FactrakReviewContext | undefined;
  return ctx?.survey ?? null;
};

const tagContext = (task: AdminModeratorTaskResponse) => {
  const ctx = task.context as
    | {
        targetUserID?: number;
        tagName?: string;
        tag?: { id?: number; name?: string };
      }
    | undefined;
  return ctx ?? {};
};

const photoContext = (task: AdminModeratorTaskResponse) => {
  const ctx = task.context as
    { targetUserID?: number; name?: string; unixID?: string } | undefined;
  return ctx ?? {};
};

const boardContext = (task: AdminModeratorTaskResponse) => {
  const ctx = task.context as
    { thread?: ModelsBoardThread; post?: ModelsBoardPost } | undefined;
  return { post: ctx?.post, thread: ctx?.thread ?? ctx?.post?.thread };
};

const UserPhotoPreview = ({ unixID }: { unixID: string }) => {
  const wso = useAppSelector(getWSO);
  const [src, setSrc] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let url = "";
    let cancelled = false;
    setFailed(false);
    wso.userService
      .getUserLargePhoto(unixID)
      .then((blob) => {
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        setSrc(url);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [wso, unixID]);

  if (failed) return <p className="admin-task-meta">Photo unavailable</p>;
  if (!src) return null;
  return <img className="admin-task-photo" src={src} alt={unixID} />;
};

const AdminTasks = () => {
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();
  const [tasks, setTasks] = useState<AdminModeratorTaskResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      const response = await wso.adminService.listModeratorTasks({
        preload: ["requestingUser"],
      });
      setTasks(response.data ?? []);
    } catch (error) {
      navigateTo("/error", { replace: true, state: { error } });
    } finally {
      setLoading(false);
    }
  }, [wso, navigateTo]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const factrakGroups = useMemo(
    () =>
      groupByReference(
        tasks.filter((t) => String(t.taskType) === TASK_FACTRAK)
      ),
    [tasks]
  );

  const tagGroups = useMemo(
    () =>
      groupByReference(
        tasks.filter((t) => String(t.taskType) === TASK_NEW_TAG)
      ),
    [tasks]
  );

  const photoGroups = useMemo(
    () =>
      groupByReference(
        tasks.filter((t) => String(t.taskType) === TASK_USER_PHOTO)
      ),
    [tasks]
  );

  const boardGroups = useMemo(
    () =>
      groupByReference(
        tasks.filter((t) =>
          [TASK_BOARD_THREAD, TASK_BOARD_POST].includes(String(t.taskType))
        )
      ),
    [tasks]
  );

  const removeGroup = (taskReference: string) => {
    setTasks((prev) => prev.filter((t) => t.taskReference !== taskReference));
  };

  const resolveGroup = async (
    group: TaskGroup,
    resolution: typeof RESOLUTION_APPROVED | typeof RESOLUTION_REJECTED
  ) => {
    const seedID = group.sample.id;
    if (!seedID) return;

    if (resolution === RESOLUTION_APPROVED) {
      // eslint-disable-next-line no-restricted-globals, no-alert
      const ok = confirm("Are you sure?");
      if (!ok) return;
    }

    setBusyKey(group.taskReference);
    try {
      await wso.adminService.resolveModeratorTasks(seedID, { resolution });
      removeGroup(group.taskReference);
    } catch (error) {
      // subject already gone — offer discard of open tasks
      if ((error as ApiError)?.errorCode === 2403) {
        // eslint-disable-next-line no-restricted-globals, no-alert
        const discard = confirm(
          "Subject is already gone. Discard these open tasks?"
        );
        if (discard) {
          try {
            await Promise.all(
              group.tasks
                .map((t) => t.id)
                .filter((id): id is number => typeof id === "number")
                .map((id) => wso.adminService.deleteModeratorTask(id))
            );
            removeGroup(group.taskReference);
          } catch (discardError) {
            navigateTo("/error", {
              replace: true,
              state: { error: discardError },
            });
          }
        }
      } else {
        navigateTo("/error", { replace: true, state: { error } });
      }
    } finally {
      setBusyKey(null);
    }
  };

  const renderFactrakGroup = (group: TaskGroup) => {
    const survey = surveyFromContext(group.sample);
    const flagCount = group.tasks.length;
    const busy = busyKey === group.taskReference;

    return (
      <div className="comment" key={group.taskReference}>
        <div>
          {survey ? (
            <span>
              <Link to={`/factrak/professors/${survey.professorID}`}>
                {survey.professor?.name || "Professor"}
              </Link>
              &nbsp;
              <Link to={`/factrak/courses/${survey.courseID}`}>
                {`${survey.course?.areaOfStudy?.abbreviation || ""} ${
                  survey.course?.number || ""
                }`.trim()}
              </Link>
              {typeof survey.totalAgree === "number" && (
                <>
                  {" "}
                  (+{survey.totalAgree}, -{survey.totalDisagree})
                </>
              )}
            </span>
          ) : (
            <span>Survey unavailable</span>
          )}
          {flagCount > 1 && (
            <span className="admin-task-meta"> · {flagCount} flags</span>
          )}
          <p>{survey?.comment || "No comment loaded."}</p>
          <button
            className="inline-button"
            type="button"
            disabled={busy}
            onClick={() => resolveGroup(group, RESOLUTION_REJECTED)}
          >
            Reject
          </button>
          &ensp;
          <button
            className="inline-button"
            type="button"
            disabled={busy}
            onClick={() => resolveGroup(group, RESOLUTION_APPROVED)}
          >
            Approve (delete review)
          </button>
        </div>
      </div>
    );
  };

  const renderTagGroup = (group: TaskGroup) => {
    const ctx = tagContext(group.sample);
    const busy = busyKey === group.taskReference;
    const requesters = group.tasks
      .map((t) => t.requestingUser?.name || t.requestingUser?.unixID)
      .filter(Boolean);

    return (
      <div className="comment" key={group.taskReference}>
        <div>
          <span>
            Add tag{" "}
            <strong>{ctx.tag?.name || ctx.tagName || "unknown tag"}</strong>
            {ctx.targetUserID != null && (
              <>
                {" "}
                for user{" "}
                <Link to={`/facebook/users/${ctx.targetUserID}`}>
                  #{ctx.targetUserID}
                </Link>
              </>
            )}
          </span>
          {requesters.length > 0 && (
            <p className="admin-task-meta">
              Requested by {requesters.join(", ")}
            </p>
          )}
          <button
            className="inline-button"
            type="button"
            disabled={busy}
            onClick={() => resolveGroup(group, RESOLUTION_REJECTED)}
          >
            Reject
          </button>
          &ensp;
          <button
            className="inline-button"
            type="button"
            disabled={busy}
            onClick={() => resolveGroup(group, RESOLUTION_APPROVED)}
          >
            Approve
          </button>
        </div>
      </div>
    );
  };

  const renderPhotoGroup = (group: TaskGroup) => {
    const ctx = photoContext(group.sample);
    const busy = busyKey === group.taskReference;
    const flagCount = group.tasks.length;

    return (
      <div className="comment" key={group.taskReference}>
        <div>
          <span>
            {ctx.targetUserID != null ? (
              <Link to={`/facebook/users/${ctx.targetUserID}`}>
                {ctx.name || `#${ctx.targetUserID}`}
              </Link>
            ) : (
              "Unknown user"
            )}
          </span>
          {flagCount > 1 && (
            <span className="admin-task-meta"> · {flagCount} reports</span>
          )}
          {ctx.unixID ? <UserPhotoPreview unixID={ctx.unixID} /> : null}
          <button
            className="inline-button"
            type="button"
            disabled={busy}
            onClick={() => resolveGroup(group, RESOLUTION_REJECTED)}
          >
            Reject
          </button>
          &ensp;
          <button
            className="inline-button"
            type="button"
            disabled={busy}
            onClick={() => resolveGroup(group, RESOLUTION_APPROVED)}
          >
            Approve (delete photo)
          </button>
        </div>
      </div>
    );
  };

  const renderBoardGroup = (group: TaskGroup) => {
    const { post, thread } = boardContext(group.sample);
    const busy = busyKey === group.taskReference;
    const flagCount = group.tasks.length;
    const wholeThread = group.taskType === TASK_BOARD_THREAD || post?.isOP;
    const subject = post ?? thread;
    const authorID = subject?.userID;
    const author = subject ? boardThreadAuthor(subject) : "Unknown user";

    return (
      <div className="comment" key={group.taskReference}>
        <div>
          <span>
            {authorID ? (
              <Link to={`/facebook/users/${authorID}`}>{author}</Link>
            ) : (
              author
            )}
            {wholeThread ? " posted " : " replied on "}
            {thread?.id ? (
              <Link to={boardThreadPath(thread)}>
                {boardThreadTitle(thread)}
              </Link>
            ) : (
              "a deleted thread"
            )}
          </span>
          {flagCount > 1 && (
            <span className="admin-task-meta"> · {flagCount} flags</span>
          )}
          <p>{post?.content || thread?.body || "No content loaded."}</p>
          <button
            className="inline-button"
            type="button"
            disabled={busy}
            onClick={() => resolveGroup(group, RESOLUTION_REJECTED)}
          >
            Reject
          </button>
          &ensp;
          <button
            className="inline-button"
            type="button"
            disabled={busy}
            onClick={() => resolveGroup(group, RESOLUTION_APPROVED)}
          >
            Approve (delete {wholeThread ? "thread" : "reply"})
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-tasks">
      {loading ? (
        <p>Loading tasks…</p>
      ) : (
        <>
          <AdminTaskSection
            title="Factrak reviews"
            count={factrakGroups.length}
            startsOpen={factrakGroups.length > 0}
          >
            {factrakGroups.length === 0 ? (
              <p className="admin-tasks__empty">No open Factrak reviews.</p>
            ) : (
              factrakGroups.map(renderFactrakGroup)
            )}
          </AdminTaskSection>

          <AdminTaskSection
            title="Tag requests"
            count={tagGroups.length}
            startsOpen={tagGroups.length > 0}
          >
            {tagGroups.length === 0 ? (
              <p className="admin-tasks__empty">No open tag requests.</p>
            ) : (
              tagGroups.map(renderTagGroup)
            )}
          </AdminTaskSection>

          <AdminTaskSection
            title="Photo reports"
            count={photoGroups.length}
            startsOpen={photoGroups.length > 0}
          >
            {photoGroups.length === 0 ? (
              <p className="admin-tasks__empty">No open photo reports.</p>
            ) : (
              photoGroups.map(renderPhotoGroup)
            )}
          </AdminTaskSection>

          <AdminTaskSection
            title="Bulletin flags"
            count={boardGroups.length}
            startsOpen={boardGroups.length > 0}
          >
            {boardGroups.length === 0 ? (
              <p className="admin-tasks__empty">No open bulletin flags.</p>
            ) : (
              boardGroups.map(renderBoardGroup)
            )}
          </AdminTaskSection>
        </>
      )}
    </div>
  );
};

export default AdminTasks;
