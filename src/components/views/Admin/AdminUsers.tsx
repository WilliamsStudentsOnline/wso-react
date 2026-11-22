import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  AdminUserAccess,
  AdminUserBans,
} from "wso-api-client/lib/services/types";
import { useAppSelector } from "../../../lib/store";
import { getWSO } from "../../../lib/authSlice";
import AdminTaskSection from "./AdminTaskSection";
import "./Admin.css";

type BanFlag = keyof Omit<AdminUserBans, "reason">;

const BAN_FLAGS: { key: BanFlag; label: string }[] = [
  { key: "bulletinRead", label: "Bulletin read" },
  { key: "bulletinWrite", label: "Bulletin write" },
  { key: "factrak", label: "Factrak" },
  { key: "dormtrak", label: "Dormtrak" },
];

const SEARCH_DEBOUNCE_MS = 250;

const bannedFrom = (user: AdminUserAccess) =>
  BAN_FLAGS.filter((f) => user.bans?.[f.key])
    .map((f) => f.label)
    .join(", ");

type UserEditorProps = {
  user: AdminUserAccess;
  onSaved: (user: AdminUserAccess) => void;
  onCancel: () => void;
};

const UserEditor = ({ user, onSaved, onCancel }: UserEditorProps) => {
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();

  const [factrakAdmin, setFactrakAdmin] = useState(Boolean(user.factrakAdmin));
  const [bans, setBans] = useState<AdminUserBans>({ ...user.bans });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!user.userID) return;
    setSaving(true);
    try {
      const response = await wso.adminService.updateAdminUserAccess(
        user.userID,
        { factrakAdmin, bans }
      );
      if (response.data) onSaved(response.data);
    } catch (error) {
      navigateTo("/error", { replace: true, state: { error } });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-users__editor">
      <div className="admin-users__checks">
        <label>
          <input
            type="checkbox"
            checked={factrakAdmin}
            onChange={(e) => setFactrakAdmin(e.target.checked)}
          />
          Factrak moderator
        </label>
      </div>
      <div className="admin-users__checks">
        <span className="admin-task-meta">Banned from</span>
        {BAN_FLAGS.map((flag) => (
          <label key={flag.key}>
            <input
              type="checkbox"
              checked={Boolean(bans[flag.key])}
              onChange={(e) =>
                setBans((prev) => ({ ...prev, [flag.key]: e.target.checked }))
              }
            />
            {flag.label}
          </label>
        ))}
      </div>
      <input
        type="text"
        className="admin-users__notes"
        placeholder="Notes"
        value={bans.reason ?? ""}
        onChange={(e) =>
          setBans((prev) => ({ ...prev, reason: e.target.value }))
        }
      />
      <div className="admin-users__actions">
        <button
          type="button"
          className="admin-users__link"
          disabled={saving}
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="admin-users__link admin-users__link--primary"
          disabled={saving}
          onClick={save}
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
};

const AdminUsers = () => {
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();

  const [query, setQuery] = useState("");
  const [restricted, setRestricted] = useState<AdminUserAccess[] | null>(null);
  const [results, setResults] = useState<AdminUserAccess[] | null>(null);
  const [editing, setEditing] = useState<string | null>(null);

  const loadRestricted = useCallback(async () => {
    try {
      const response = await wso.adminService.listAdminUsers();
      setRestricted(response.data?.users ?? []);
    } catch (error) {
      navigateTo("/error", { replace: true, state: { error } });
    }
  }, [wso, navigateTo]);

  useEffect(() => {
    loadRestricted();
  }, [loadRestricted]);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults(null);
      return undefined;
    }
    let isMounted = true;
    const timer = setTimeout(async () => {
      try {
        const response = await wso.adminService.listAdminUsers({ q });
        if (isMounted) setResults(response.data?.users ?? []);
      } catch (error) {
        navigateTo("/error", { replace: true, state: { error } });
      }
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [wso, query, navigateTo]);

  const onSaved = (saved: AdminUserAccess) => {
    setEditing(null);
    setResults((prev) =>
      prev ? prev.map((u) => (u.userID === saved.userID ? saved : u)) : prev
    );
    loadRestricted();
  };

  const renderUser = (section: string, user: AdminUserAccess) => {
    const key = `${section}:${user.userID}`;
    const details = [bannedFrom(user), user.bans?.reason]
      .filter(Boolean)
      .join(" · ");
    return (
      <li className="admin-users__row" key={key}>
        <div className="admin-users__row-head">
          <span>
            <Link to={`/facebook/users/${user.userID}`}>{user.name}</Link>{" "}
            <span className="admin-task-meta">{user.unixID}</span>
          </span>
          {user.admin ? (
            <span className="admin-task-meta">Admin</span>
          ) : (
            editing !== key && (
              <button
                type="button"
                className="admin-users__link"
                onClick={() => setEditing(key)}
              >
                Edit
              </button>
            )
          )}
        </div>
        {details ? <div className="admin-task-meta">{details}</div> : null}
        {editing === key ? (
          <UserEditor
            user={user}
            onSaved={onSaved}
            onCancel={() => setEditing(null)}
          />
        ) : null}
      </li>
    );
  };

  const section = (
    title: string,
    key: string,
    users: AdminUserAccess[],
    empty: string
  ) => (
    <AdminTaskSection
      key={key}
      title={title}
      count={users.length}
      startsOpen={users.length > 0}
    >
      {users.length === 0 ? (
        <p className="admin-tasks__empty">{empty}</p>
      ) : (
        <ul className="admin-users__list">
          {users.map((user) => renderUser(key, user))}
        </ul>
      )}
    </AdminTaskSection>
  );

  const list = restricted ?? [];

  return (
    <div className="admin-tasks">
      <input
        type="search"
        className="admin-users__search"
        placeholder="Search by name or unix"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {results ? (
        section("Search results", "search", results, "No users found.")
      ) : restricted === null ? (
        <p>Loading users…</p>
      ) : (
        <>
          {section(
            "Factrak moderators",
            "factrakAdmin",
            list.filter((u) => u.factrakAdmin || u.admin),
            "No Factrak moderators."
          )}
          {section(
            "Bans",
            "bans",
            list.filter((u) => bannedFrom(u)),
            "No bans."
          )}
        </>
      )}
    </div>
  );
};

export default AdminUsers;
