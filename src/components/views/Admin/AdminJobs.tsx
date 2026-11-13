import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AdminJobInfo,
  ModelsJobRun,
  RegistryParam,
} from "wso-api-client/lib/services/types";
import { useAppSelector } from "../../../lib/store";
import { getWSO } from "../../../lib/authSlice";
import { Button, Select } from "../../ui";
import "./AdminJobs.css";

const ALL_RUNS = "__all__";

const formatWhen = (value?: string) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
};

const scheduleLabel = (job: AdminJobInfo) => {
  const parts: string[] = [];
  if (job.hasActiveRun) parts.push("Running now");
  const next = formatWhen(job.nextRunAt);
  if (next) parts.push(`Next ${next}`);
  return parts.length ? parts.join(" · ") : "Manual only";
};

const paramType = (p: RegistryParam): string =>
  typeof p.type === "string" ? p.type : "";

const initialParamValues = (job: AdminJobInfo): Record<string, string> => {
  const values: Record<string, string> = {};
  for (const p of job.params || []) {
    if (!p.name) continue;
    values[p.name] = p.default != null && p.default !== "" ? p.default : "";
  }
  return values;
};

const boolNeedsChoice = (p: RegistryParam) =>
  paramType(p) === "bool" && (p.default == null || p.default === "");

const missingRequired = (
  job: AdminJobInfo,
  values: Record<string, string>
): string[] =>
  (job.params || [])
    .filter((p) => p.required && p.name && !(values[p.name] || "").trim())
    .map((p) => p.name as string);

const runWho = (run: ModelsJobRun) => {
  const u = run.triggeredByUser;
  if (u?.unixID) return u.unixID;
  if (u?.name) return u.name;
  if (run.triggeredByUserID != null) return `user #${run.triggeredByUserID}`;
  return null;
};

const AdminJobs = () => {
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();

  const [jobs, setJobs] = useState<AdminJobInfo[]>([]);
  const [selected, setSelected] = useState<string | null>(ALL_RUNS);
  const [runs, setRuns] = useState<ModelsJobRun[]>([]);
  const [logs, setLogs] = useState<Record<number, string>>({});
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingRuns, setLoadingRuns] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [runJobDraft, setRunJobDraft] = useState<AdminJobInfo | null>(null);
  const [runParams, setRunParams] = useState<Record<string, string>>({});
  const [runFormError, setRunFormError] = useState<string | null>(null);
  const [copiedLogId, setCopiedLogId] = useState<number | null>(null);
  const softRunsOnSelectRef = useRef(false);

  const fail = useCallback(
    (error: unknown) => {
      navigateTo("/error", { replace: true, state: { error } });
    },
    [navigateTo]
  );

  const loadJobs = useCallback(
    async (opts?: { soft?: boolean }) => {
      if (!opts?.soft) setLoadingJobs(true);
      try {
        const response = await wso.adminService.listAdminJobs();
        setJobs(response.data || []);
      } catch (error) {
        fail(error);
      } finally {
        if (!opts?.soft) setLoadingJobs(false);
      }
    },
    [wso, fail]
  );

  const loadRuns = useCallback(
    async (selection: string, opts?: { soft?: boolean }) => {
      if (!opts?.soft) setLoadingRuns(true);
      try {
        const response = await wso.adminService.listAdminJobRuns(
          selection === ALL_RUNS ? { limit: 50 } : { job: selection, limit: 50 }
        );
        setRuns(response.data || []);
      } catch (error) {
        fail(error);
      } finally {
        if (!opts?.soft) setLoadingRuns(false);
      }
    },
    [wso, fail]
  );

  const loadJobsRef = useRef(loadJobs);
  const loadRunsRef = useRef(loadRuns);
  loadJobsRef.current = loadJobs;
  loadRunsRef.current = loadRuns;

  useEffect(() => {
    void loadJobsRef.current();
  }, []);

  useEffect(() => {
    if (!selected) {
      setRuns([]);
      return;
    }
    const soft = softRunsOnSelectRef.current;
    softRunsOnSelectRef.current = false;
    void loadRunsRef.current(selected, soft ? { soft: true } : undefined);
  }, [selected]);

  const selectJob = (name: string) => {
    if (name === selected) return;
    setSelected(name);
    setLogs({});
  };

  const openRunForm = (job: AdminJobInfo) => {
    setRunJobDraft(job);
    setRunParams(initialParamValues(job));
    setRunFormError(null);
  };

  const closeRunForm = () => {
    setRunJobDraft(null);
    setRunParams({});
    setRunFormError(null);
  };

  const setParam = (name: string, value: string) => {
    setRunParams((prev) => ({ ...prev, [name]: value }));
  };

  const submitRun = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!runJobDraft?.name) return;

    const missing = missingRequired(runJobDraft, runParams);
    if (missing.length) {
      setRunFormError(`Required: ${missing.join(", ")}`);
      return;
    }

    const params: Record<string, string> = {};
    for (const [key, value] of Object.entries(runParams)) {
      if (value.trim() !== "") params[key] = value.trim();
    }

    const jobName = runJobDraft.name;
    setRunJobDraft(null);
    setRunParams({});
    setRunFormError(null);
    setBusy(`run:${jobName}`);
    setMessage(`Enqueueing ${jobName}…`);

    try {
      const response = await wso.adminService.createAdminJobRun(jobName, {
        params,
      });
      const run = response.data;
      setMessage(
        run?.id
          ? `Enqueued run #${run.id} (${run.status || "pending"})`
          : "Enqueued run"
      );
      if (run?.id != null) {
        const showHere = selected === ALL_RUNS || selected === jobName;
        if (showHere) {
          setRuns((prev) =>
            [run, ...prev.filter((r) => r.id !== run.id)].slice(0, 50)
          );
        }
      }
      if (selected === jobName || selected === ALL_RUNS) {
        void loadRunsRef.current(selected, { soft: true });
      } else {
        softRunsOnSelectRef.current = true;
        setSelected(jobName);
      }
      void loadJobsRef.current({ soft: true });
    } catch (error) {
      setMessage(null);
      fail(error);
    } finally {
      setBusy(null);
    }
  };

  const cancelRun = async (id?: number) => {
    if (!id) return;
    setBusy(`cancel:${id}`);
    try {
      const response = await wso.adminService.cancelAdminJobRun(id);
      setMessage(`Run #${id} → ${response.data?.status || "canceled"}`);
      if (selected) void loadRuns(selected, { soft: true });
      void loadJobs({ soft: true });
    } catch (error) {
      fail(error);
    } finally {
      setBusy(null);
    }
  };

  const closeLog = (id: number) => {
    setLogs((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setCopiedLogId((cur) => (cur === id ? null : cur));
  };

  const copyLog = async (id: number) => {
    const text = logs[id];
    if (text == null) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLogId(id);
      window.setTimeout(() => {
        setCopiedLogId((cur) => (cur === id ? null : cur));
      }, 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const loadLog = async (id?: number) => {
    if (!id) return;
    setBusy(`log:${id}`);
    try {
      const response = await wso.adminService.getAdminJobRunLogs(id);
      const text =
        typeof response.data === "string" ? response.data.trim() : "";
      setLogs((prev) => ({
        ...prev,
        [id]: text || "(empty log)",
      }));
    } catch {
      setLogs((prev) => ({
        ...prev,
        [id]: "(no log for this run)",
      }));
    } finally {
      setBusy(null);
    }
  };

  const selectedJob =
    selected && selected !== ALL_RUNS
      ? jobs.find((j) => j.name === selected) || null
      : null;
  const runsTitleRight =
    selected === ALL_RUNS ? "All jobs" : selectedJob?.name || selected || "";
  const allJobsView = selected === ALL_RUNS;
  return (
    <div className="admin-jobs">
      {loadingJobs ? (
        <p className="admin-jobs__muted">Loading jobs…</p>
      ) : jobs.length === 0 ? (
        <p className="admin-jobs__muted">No jobs registered.</p>
      ) : (
        <div className="admin-jobs__layout">
          <section className="admin-jobs__list" aria-label="Registered jobs">
            <div className="admin-jobs__panel-head">
              <span>Job</span>
              <span className="admin-jobs__panel-head-trail">
                Schedule
                <button
                  type="button"
                  className="admin-jobs__icon-btn"
                  aria-label="Refresh"
                  title="Refresh"
                  disabled={loadingJobs || !!busy}
                  onClick={() => {
                    void loadJobs({ soft: true });
                    if (selected) void loadRuns(selected, { soft: true });
                  }}
                >
                  <span className="material-icons" aria-hidden>
                    refresh
                  </span>
                </button>
              </span>
            </div>
            <div className="admin-jobs__list-scroll">
              <table>
                <tbody>
                  <tr
                    className={
                      selected === ALL_RUNS
                        ? "admin-jobs__row--selected admin-jobs__row--pinned"
                        : "admin-jobs__row--pinned"
                    }
                    onClick={() => selectJob(ALL_RUNS)}
                  >
                    <td>
                      <div className="admin-jobs__job-row">
                        <div className="admin-jobs__job-link">
                          <strong>All jobs</strong>
                        </div>
                      </div>
                    </td>
                    <td className="admin-jobs__meta" />
                  </tr>
                  {jobs.map((job) => {
                    const name = job.name || "";
                    return (
                      <tr
                        key={name}
                        className={
                          selected === name
                            ? "admin-jobs__row--selected"
                            : undefined
                        }
                        onClick={() => selectJob(name)}
                      >
                        <td>
                          <div className="admin-jobs__job-row">
                            <div className="admin-jobs__job-link">
                              <strong>{name}</strong>
                              {job.description && (
                                <span className="admin-jobs__desc">
                                  {job.description}
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              className="admin-jobs__icon-btn admin-jobs__icon-btn--run"
                              aria-label={`Run ${name}`}
                              title="Review params, then enqueue"
                              disabled={busy === `run:${name}`}
                              onClick={(event) => {
                                event.stopPropagation();
                                openRunForm(job);
                              }}
                            >
                              <span className="material-icons" aria-hidden>
                                play_arrow
                              </span>
                            </button>
                          </div>
                        </td>
                        <td className="admin-jobs__meta">
                          {scheduleLabel(job)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="admin-jobs__runs" aria-label="Recent runs">
            <div className="admin-jobs__panel-head">
              <span>Runs</span>
              <span className="admin-jobs__panel-head-trail admin-jobs__panel-head-trail--end">
                {message ? (
                  <span className="admin-jobs__message">
                    <span>{message}</span>
                    <button
                      type="button"
                      className="admin-jobs__message-dismiss"
                      aria-label="Dismiss"
                      onClick={() => setMessage(null)}
                    >
                      ×
                    </button>
                  </span>
                ) : runsTitleRight ? (
                  <code>{runsTitleRight}</code>
                ) : null}
              </span>
            </div>
            <div className="admin-jobs__runs-scroll">
              {loadingRuns && runs.length === 0 ? (
                <p className="admin-jobs__muted admin-jobs__pane-empty">
                  Loading runs…
                </p>
              ) : runs.length === 0 ? (
                <p className="admin-jobs__muted admin-jobs__pane-empty">
                  No runs yet.
                </p>
              ) : (
                <ul className="admin-jobs__run-list">
                  {runs.map((run) => {
                    const id = run.id;
                    const who = runWho(run);
                    const logOpen = id != null && logs[id] != null;
                    const cancellable =
                      run.status === "pending" || run.status === "running";
                    const status = run.status || "unknown";
                    const statusIcon =
                      status === "succeeded"
                        ? "check_circle"
                        : status === "failed"
                        ? "error"
                        : status === "canceled"
                        ? "cancel"
                        : status === "running"
                        ? "autorenew"
                        : status === "pending"
                        ? "schedule"
                        : "help";
                    return (
                      <li key={id} className="admin-jobs__run">
                        <div className="admin-jobs__run-head">
                          <div className="admin-jobs__run-meta">
                            <strong>#{id}</strong>{" "}
                            {allJobsView && run.jobName ? (
                              <>
                                <code className="admin-jobs__run-job">
                                  {run.jobName}
                                </code>{" "}
                              </>
                            ) : null}
                            <span className="admin-jobs__muted">
                              · {run.trigger || "?"}
                              {who ? ` · ${who}` : ""} ·{" "}
                              {formatWhen(
                                run.startedAt || run.finishedAt || run.runAt
                              ) || "—"}
                            </span>
                          </div>
                          <div className="admin-jobs__run-actions">
                            <button
                              type="button"
                              className={
                                logOpen
                                  ? "admin-jobs__icon-btn admin-jobs__icon-btn--ghost admin-jobs__icon-btn--active"
                                  : "admin-jobs__icon-btn admin-jobs__icon-btn--ghost"
                              }
                              aria-label={logOpen ? "Hide log" : "Show log"}
                              aria-pressed={logOpen}
                              title={logOpen ? "Hide log" : "Show log"}
                              disabled={busy === `log:${id}`}
                              onClick={() =>
                                logOpen && id != null
                                  ? closeLog(id)
                                  : loadLog(id)
                              }
                            >
                              <span className="material-icons" aria-hidden>
                                {logOpen ? "close" : "description"}
                              </span>
                            </button>
                            <button
                              type="button"
                              className="admin-jobs__icon-btn admin-jobs__icon-btn--ghost"
                              aria-label="Copy log"
                              title={copiedLogId === id ? "Copied" : "Copy log"}
                              disabled={!logOpen || id == null}
                              onClick={() => id != null && copyLog(id)}
                            >
                              <span className="material-icons" aria-hidden>
                                {copiedLogId === id ? "check" : "content_copy"}
                              </span>
                            </button>
                            <span
                              className={`admin-jobs__status-icon admin-jobs__status-icon--${status}`}
                              title={status}
                              aria-label={status}
                            >
                              <span className="material-icons" aria-hidden>
                                {statusIcon}
                              </span>
                            </span>
                            {cancellable && (
                              <button
                                type="button"
                                className="admin-jobs__icon-btn admin-jobs__icon-btn--ghost"
                                aria-label="Cancel run"
                                title="Cancel run"
                                disabled={busy === `cancel:${id}`}
                                onClick={() => cancelRun(id)}
                              >
                                <span className="material-icons" aria-hidden>
                                  stop
                                </span>
                              </button>
                            )}
                          </div>
                        </div>
                        {logOpen && id != null && (
                          <pre className="admin-jobs__log">{logs[id]}</pre>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>
        </div>
      )}

      {runJobDraft && (
        <>
          <button
            type="button"
            className="admin-jobs__backdrop"
            aria-label="Close run dialog"
            onMouseDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
              closeRunForm();
            }}
          />
          <div
            className="admin-jobs__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-jobs-run-title"
          >
            <div className="admin-jobs__dialog-header">
              <h3 id="admin-jobs-run-title">
                Run <code>{runJobDraft.name}</code>
              </h3>
              <button
                type="button"
                className="admin-jobs__dialog-close"
                onClick={closeRunForm}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            {runJobDraft.description && (
              <p className="admin-jobs__muted">{runJobDraft.description}</p>
            )}
            {!runJobDraft.schedule && (
              <p className="admin-jobs__warn">
                Manual-only job — check params before enqueueing.
              </p>
            )}
            <form className="admin-jobs__run-form" onSubmit={submitRun}>
              {(runJobDraft.params || []).length === 0 ? (
                <p className="admin-jobs__muted">No params for this job.</p>
              ) : (
                (runJobDraft.params || []).map((p) => {
                  if (!p.name) return null;
                  const type = paramType(p);
                  const id = `job-param-${p.name}`;
                  return (
                    <label key={p.name} htmlFor={id}>
                      <span>
                        {p.name}
                        {p.required ? " *" : ""}
                        {p.description ? (
                          <span className="admin-jobs__param-hint">
                            {" "}
                            — {p.description}
                          </span>
                        ) : null}
                      </span>
                      {type === "bool" && boolNeedsChoice(p) ? (
                        <Select
                          value={runParams[p.name] || ""}
                          options={["true", "false"]}
                          valueList={["true", "false"]}
                          fillerOption="(choose)"
                          fillerValue=""
                          onChange={(event) =>
                            setParam(p.name as string, event.target.value)
                          }
                        />
                      ) : type === "bool" ? (
                        <input
                          id={id}
                          type="checkbox"
                          checked={runParams[p.name] === "true"}
                          onChange={(event) =>
                            setParam(
                              p.name as string,
                              event.target.checked ? "true" : "false"
                            )
                          }
                        />
                      ) : type === "enum" ? (
                        <Select
                          value={runParams[p.name] || ""}
                          options={p.enumValues || []}
                          valueList={p.enumValues || []}
                          fillerOption="(choose)"
                          fillerValue=""
                          onChange={(event) =>
                            setParam(p.name as string, event.target.value)
                          }
                        />
                      ) : (
                        <input
                          id={id}
                          type="text"
                          value={runParams[p.name] || ""}
                          placeholder={p.default || undefined}
                          onChange={(event) =>
                            setParam(p.name as string, event.target.value)
                          }
                        />
                      )}
                    </label>
                  );
                })
              )}
              {runFormError && (
                <p className="admin-jobs__form-error">{runFormError}</p>
              )}
              <div className="admin-jobs__dialog-actions">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeRunForm}
                >
                  Cancel
                </Button>
                <Button type="submit">Confirm run</Button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminJobs;
