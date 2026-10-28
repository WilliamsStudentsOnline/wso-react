import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { useAppSelector } from "../../../lib/store";
import { getWSO } from "../../../lib/authSlice";
import {
  FEEDBACK_PRIORITIES,
  FEEDBACK_PRIORITY_LABELS,
  Feedback,
  FeedbackPriority,
  deleteFeedback,
  listFeedback,
  updateFeedback,
} from "../../../lib/feedback";
import { Button, Pagination, Select } from "../../ui";
import "./AdminFeedback.css";

const PAGE_SIZE = 25;

const formatWhen = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const submitterLabel = (item: Feedback) => {
  if (item.preferredName?.trim()) return item.preferredName.trim();
  if (item.user?.name) return item.user.name;
  if (item.user?.unixID) return item.user.unixID;
  if (item.userID) return `#${item.userID}`;
  return "Anonymous";
};

const AdminFeedback = () => {
  const wso = useAppSelector(getWSO);

  const [priorityFilter, setPriorityFilter] = useState<FeedbackPriority | "">(
    ""
  );
  const [items, setItems] = useState<Feedback[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Feedback | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [issue, setIssue] = useState("");
  const [detailPriority, setDetailPriority] =
    useState<FeedbackPriority>("none");
  const [saving, setSaving] = useState(false);
  const [detailError, setDetailError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await listFeedback(wso, {
        priority: priorityFilter || undefined,
        offset: page * PAGE_SIZE,
        limit: PAGE_SIZE,
        preload: ["user"],
      });
      setItems(response.data ?? []);
      setTotal(response.paginationTotal ?? response.data?.length ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load feedback.");
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [wso, priorityFilter, page]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(0);
  }, [priorityFilter]);

  const openDetail = (item: Feedback) => {
    setSelected(item);
    setAdminNotes(item.adminNotes ?? "");
    setIssue(item.issue ?? "");
    setDetailPriority(item.priority);
    setDetailError("");
  };

  const closeDetail = () => {
    setSelected(null);
    setDetailError("");
  };

  const patchPriority = async (item: Feedback, priority: FeedbackPriority) => {
    try {
      const response = await updateFeedback(wso, item.id, { priority });
      const updated = response.data ?? { ...item, priority };
      setItems((prev) =>
        prev.map((row) => (row.id === item.id ? { ...row, ...updated } : row))
      );
      if (selected?.id === item.id) {
        setSelected((prev) => (prev ? { ...prev, ...updated } : prev));
        setDetailPriority(updated.priority);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not update priority."
      );
    }
  };

  const saveDetail = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selected) return;
    setSaving(true);
    setDetailError("");
    try {
      const response = await updateFeedback(wso, selected.id, {
        adminNotes,
        issue,
        priority: detailPriority,
      });
      const updated = response.data ?? {
        ...selected,
        adminNotes,
        issue,
        priority: detailPriority,
      };
      setItems((prev) =>
        prev.map((row) =>
          row.id === selected.id ? { ...row, ...updated } : row
        )
      );
      closeDetail();
      if (priorityFilter && updated.priority !== priorityFilter) {
        load();
      }
    } catch (err) {
      setDetailError(
        err instanceof Error ? err.message : "Could not save feedback."
      );
    } finally {
      setSaving(false);
    }
  };

  const removeSelected = async () => {
    if (!selected) return;
    if (!window.confirm("Delete this feedback?")) return;
    setSaving(true);
    setDetailError("");
    try {
      await deleteFeedback(wso, selected.id);
      closeDetail();
      load();
    } catch (err) {
      setDetailError(
        err instanceof Error ? err.message : "Could not delete feedback."
      );
      setSaving(false);
    }
  };

  const filterChips = useMemo(
    () => (
      <div
        className="admin-feedback__filters"
        role="group"
        aria-label="Filter by status"
      >
        <button
          type="button"
          className={`admin-feedback__chip${
            priorityFilter === "" ? " is-active" : ""
          }`}
          onClick={() => setPriorityFilter("")}
        >
          All
        </button>
        {FEEDBACK_PRIORITIES.map((priority) => (
          <button
            key={priority}
            type="button"
            className={`admin-feedback__chip${
              priorityFilter === priority ? " is-active" : ""
            }`}
            aria-pressed={priorityFilter === priority}
            onClick={() => setPriorityFilter(priority)}
          >
            {FEEDBACK_PRIORITY_LABELS[priority]}
          </button>
        ))}
      </div>
    ),
    [priorityFilter]
  );

  return (
    <div className="admin-feedback">
      {filterChips}

      {error && <p className="admin-feedback__error">{error}</p>}
      {loading && <p className="admin-feedback__muted">Loading…</p>}
      {!loading && items.length === 0 && (
        <p className="admin-feedback__empty">No feedback yet.</p>
      )}

      {!loading && items.length > 0 && (
        <div className="admin-feedback__table-wrap">
          <table className="admin-feedback__table">
            <thead>
              <tr>
                <th>When</th>
                <th>From</th>
                <th>Notes</th>
                <th>Page</th>
                <th>Status</th>
                <th>Issue</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className={selected?.id === item.id ? "is-selected" : ""}
                  onClick={() => openDetail(item)}
                >
                  <td>{formatWhen(item.createdAt)}</td>
                  <td>
                    {item.userID ? (
                      <Link
                        to={`/facebook/users/${item.userID}`}
                        onClick={(event) => event.stopPropagation()}
                      >
                        {submitterLabel(item)}
                      </Link>
                    ) : (
                      submitterLabel(item)
                    )}
                  </td>
                  <td>
                    <div className="admin-feedback__notes">{item.notes}</div>
                  </td>
                  <td>
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                      >
                        link
                      </a>
                    ) : (
                      <span className="admin-feedback__muted">—</span>
                    )}
                  </td>
                  <td onClick={(event) => event.stopPropagation()}>
                    <select
                      className={`admin-feedback__status-select admin-feedback__status--${item.priority}`}
                      value={item.priority}
                      aria-label={`Status for feedback ${item.id}`}
                      onChange={(event) =>
                        patchPriority(
                          item,
                          event.target.value as FeedbackPriority
                        )
                      }
                    >
                      {FEEDBACK_PRIORITIES.map((priority) => (
                        <option key={priority} value={priority}>
                          {FEEDBACK_PRIORITY_LABELS[priority]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    {item.issue ? (
                      <a
                        href={item.issue}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                      >
                        issue
                      </a>
                    ) : (
                      <span className="admin-feedback__muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        total={total}
        page={page}
        perPage={PAGE_SIZE}
        clickHandler={(direction) => setPage((prev) => prev + direction)}
        selectionHandler={setPage}
      />

      {selected && (
        <>
          <button
            type="button"
            className="admin-feedback-detail__backdrop"
            aria-label="Close feedback detail"
            onClick={closeDetail}
          />
          <div
            className="admin-feedback-detail"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-feedback-detail-title"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                closeDetail();
              }
            }}
          >
            <div className="admin-feedback-detail__header">
              <h2 id="admin-feedback-detail-title">Feedback #{selected.id}</h2>
              <button
                type="button"
                className="admin-feedback-detail__close"
                onClick={closeDetail}
                aria-label="Close"
              >
                <MdClose size={20} />
              </button>
            </div>

            <dl className="admin-feedback-detail__meta">
              <dt>From</dt>
              <dd>
                {selected.userID ? (
                  <Link to={`/facebook/users/${selected.userID}`}>
                    {submitterLabel(selected)}
                  </Link>
                ) : (
                  submitterLabel(selected)
                )}
              </dd>
              <dt>When</dt>
              <dd>{formatWhen(selected.createdAt)}</dd>
              <dt>Page</dt>
              <dd>
                {selected.url ? (
                  <a href={selected.url} target="_blank" rel="noreferrer">
                    {selected.url}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
              <dt>Notes</dt>
              <dd>{selected.notes}</dd>
            </dl>

            <form className="admin-feedback-detail__form" onSubmit={saveDetail}>
              <label>
                Status
                <Select
                  value={detailPriority}
                  options={FEEDBACK_PRIORITIES.map(
                    (priority) => FEEDBACK_PRIORITY_LABELS[priority]
                  )}
                  valueList={FEEDBACK_PRIORITIES}
                  onChange={(event) =>
                    setDetailPriority(event.target.value as FeedbackPriority)
                  }
                />
              </label>
              <label>
                Admin notes
                <textarea
                  value={adminNotes}
                  onChange={(event) => setAdminNotes(event.target.value)}
                />
              </label>
              <label>
                Issue URL
                <input
                  type="text"
                  value={issue}
                  onChange={(event) => setIssue(event.target.value)}
                  placeholder="https://github.com/..."
                />
              </label>

              {detailError && (
                <p className="admin-feedback__error">{detailError}</p>
              )}

              <div className="admin-feedback-detail__actions">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={removeSelected}
                  disabled={saving}
                >
                  Delete
                </Button>
                <div className="admin-feedback-detail__actions-right">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={closeDetail}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="submit" disabled={saving}>
                    {saving ? "Saving…" : "Save"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminFeedback;
