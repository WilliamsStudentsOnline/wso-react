import React, { useCallback, useEffect, useRef, useState } from "react";
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
  mergeFeedback,
  updateFeedback,
} from "../../../lib/feedback";
import { Button, Pagination, Select } from "../../ui";
import "./AdminFeedback.css";

const PAGE_SIZE = 25;

const submitterLabel = (item: Feedback) => {
  const unix = item.user?.unixID?.trim() || "";
  const preferred = item.preferredName?.trim() || "";
  const name = item.user?.name?.trim() || "";
  const primary =
    preferred ||
    name ||
    unix ||
    (item.userID ? `#${item.userID}` : "Anonymous");
  if (unix && primary !== unix) return `${primary} (${unix})`;
  return primary;
};

const pageLabel = (url: string) => {
  try {
    const parsed = new URL(url);
    const path = `${parsed.pathname}${parsed.search}${parsed.hash}`;
    return path === "/" ? parsed.host : path || url;
  } catch {
    return url;
  }
};

type StatusPickerProps = {
  value: FeedbackPriority;
  ariaLabel: string;
  onChange: (priority: FeedbackPriority) => void;
};

const StatusPicker = ({ value, ariaLabel, onChange }: StatusPickerProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<FeedbackPriority | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(
    null
  );
  const shown = hovered ?? value;

  useEffect(() => {
    if (!open) return undefined;
    const place = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMenuPos({ top: rect.bottom + 4, left: rect.left });
    };
    place();
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setHovered(null);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setHovered(null);
      }
    };
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="admin-feedback__status-picker" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className={`admin-feedback__status-select admin-feedback__status--${shown}`}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={(event) => {
          event.stopPropagation();
          setOpen((prev) => !prev);
          setHovered(null);
        }}
      >
        {FEEDBACK_PRIORITY_LABELS[shown]}
      </button>
      {open && menuPos && (
        <ul
          className="admin-feedback__status-menu"
          role="listbox"
          aria-label={ariaLabel}
          style={{ top: menuPos.top, left: menuPos.left }}
        >
          {FEEDBACK_PRIORITIES.map((priority) => (
            <li key={priority} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={priority === value}
                className={`admin-feedback__status-option admin-feedback__status--${priority}${
                  priority === value ? " is-current" : ""
                }`}
                onMouseEnter={() => setHovered(priority)}
                onMouseLeave={() => setHovered(null)}
                onClick={(event) => {
                  event.stopPropagation();
                  onChange(priority);
                  setOpen(false);
                  setHovered(null);
                }}
              >
                {FEEDBACK_PRIORITY_LABELS[priority]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
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

  useEffect(() => {
    if (!selected) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDetail();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  const patchPriority = async (item: Feedback, priority: FeedbackPriority) => {
    try {
      const response = await updateFeedback(wso, item.id, { priority });
      const updated = mergeFeedback(
        item,
        response.data ?? { ...item, priority }
      );
      setItems((prev) =>
        prev.map((row) =>
          row.id === item.id ? mergeFeedback(row, updated) : row
        )
      );
      if (selected?.id === item.id) {
        setSelected((prev) => (prev ? mergeFeedback(prev, updated) : prev));
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
      const updated = mergeFeedback(
        selected,
        response.data ?? {
          ...selected,
          adminNotes,
          issue,
          priority: detailPriority,
        }
      );
      setItems((prev) =>
        prev.map((row) =>
          row.id === selected.id ? mergeFeedback(row, updated) : row
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

  const filterChips = (
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
  );

  return (
    <div className="admin-feedback">
      <p className="admin-feedback__sheet">
        <a
          href="https://docs.google.com/spreadsheets/d/1QFSe96rXTr7IUhh9Vnw4r9l_PDWVpRom0JLJx2YKKO0/edit?usp=drive_link"
          target="_blank"
          rel="noreferrer"
        >
          Feedback spreadsheet
        </a>
      </p>

      {error && <p className="admin-feedback__error">{error}</p>}

      <div className="admin-feedback__table">
        <div className="admin-feedback__table-header">{filterChips}</div>
        <div className="admin-feedback__table-wrap">
          <table>
            <thead>
              <tr>
                <th>From</th>
                <th>Notes</th>
                <th>Page</th>
                <th>Status</th>
                <th>Issue</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr className="admin-feedback__message-row">
                  <td colSpan={5}>Loading…</td>
                </tr>
              )}
              {!loading && items.length === 0 && (
                <tr className="admin-feedback__message-row">
                  <td colSpan={5}>No feedback yet.</td>
                </tr>
              )}
              {!loading &&
                items.map((item) => (
                  <tr
                    key={item.id}
                    className={selected?.id === item.id ? "is-selected" : ""}
                    onClick={() => openDetail(item)}
                  >
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
                          className="admin-feedback__page-link"
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          title={item.url}
                          onClick={(event) => event.stopPropagation()}
                        >
                          {pageLabel(item.url)}
                        </a>
                      ) : (
                        <span className="admin-feedback__muted">—</span>
                      )}
                    </td>
                    <td onClick={(event) => event.stopPropagation()}>
                      <StatusPicker
                        value={item.priority}
                        ariaLabel={`Status for feedback ${item.id}`}
                        onChange={(priority) => patchPriority(item, priority)}
                      />
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
      </div>

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
            onMouseDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
              closeDetail();
            }}
          />
          <div
            className="admin-feedback-detail"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-feedback-detail-title"
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
