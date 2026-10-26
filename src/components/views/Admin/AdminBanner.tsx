import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../lib/store";
import { getWSO } from "../../../lib/authSlice";
import { BannerBanner } from "wso-api-client/lib/services/types";
import { Button, Select } from "../../ui";

const BANNER_TYPES = ["pinned", "emergency", "dismissible"] as const;

type BannerType = typeof BANNER_TYPES[number];

const emptyBanner = (): BannerBanner => ({
  visible: false,
  type: "pinned",
  text: "",
  link: "",
  sub: "",
});

const badgeLabel = (type?: string) => (type === "emergency" ? "Alert" : "New");

const AdminBanner = () => {
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();

  const [draft, setDraft] = useState<BannerBanner>(emptyBanner());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const response = await wso.bannerService.getBanner();
        if (!isMounted) return;
        setDraft({ ...emptyBanner(), ...(response.data ?? {}) });
      } catch (err) {
        navigateTo("/error", { replace: true, state: { error: err } });
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [wso, navigateTo]);

  const updateField = <K extends keyof BannerBanner>(
    key: K,
    value: BannerBanner[K]
  ) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setStatus(null);
    setError(null);
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setStatus(null);
    setError(null);

    const payload: BannerBanner = {
      ...draft,
      type: draft.visible ? draft.type || "pinned" : draft.type,
    };

    try {
      const response = await wso.bannerService.setBanner(payload);
      setDraft({ ...emptyBanner(), ...(response.data ?? payload) });
      setStatus("Saved");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save banner";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const hideBanner = async () => {
    setSaving(true);
    setStatus(null);
    setError(null);
    const payload: BannerBanner = { ...draft, visible: false };
    try {
      const response = await wso.bannerService.setBanner(payload);
      setDraft({ ...emptyBanner(), ...(response.data ?? payload) });
      setStatus("Banner hidden");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to hide banner";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Loading banner…</p>;
  }

  const previewType = (draft.type as BannerType) || "pinned";
  const noticeClass =
    previewType === "emergency"
      ? "home-notice home-notice--emergency"
      : "home-notice";

  return (
    <div className="admin-banner">
      <h2>Homepage banner</h2>
      <p className="admin-banner__help">
        Controls the notice strip on the homepage. Changes take effect
        immediately for everyone.
      </p>

      <form className="admin-banner__form" onSubmit={save}>
        <label className="admin-banner__field admin-banner__field--check">
          <input
            type="checkbox"
            checked={Boolean(draft.visible)}
            onChange={(e) => updateField("visible", e.target.checked)}
          />
          Visible
        </label>

        <label className="admin-banner__field">
          Type
          <Select
            value={previewType}
            options={[...BANNER_TYPES]}
            onChange={(e) => updateField("type", e.target.value as BannerType)}
          />
        </label>

        <label className="admin-banner__field">
          Title
          <input
            type="text"
            value={draft.text ?? ""}
            onChange={(e) => updateField("text", e.target.value)}
            required={Boolean(draft.visible)}
          />
        </label>

        <label className="admin-banner__field">
          Subtitle
          <input
            type="text"
            value={draft.sub ?? ""}
            onChange={(e) => updateField("sub", e.target.value)}
          />
        </label>

        <label className="admin-banner__field">
          Link URL
          <input
            type="url"
            value={draft.link ?? ""}
            onChange={(e) => updateField("link", e.target.value)}
            placeholder="https://"
          />
        </label>

        <div className="admin-banner__actions">
          <Button type="submit" variant="submit" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={saving || !draft.visible}
            onClick={hideBanner}
          >
            Hide now
          </Button>
        </div>

        {status && <p className="admin-banner__status">{status}</p>}
        {error && <p className="admin-banner__error">{error}</p>}
      </form>

      <div className="admin-banner__preview">
        <h3>Preview</h3>
        {draft.visible && draft.text ? (
          <div className={noticeClass} id="admin-banner-preview">
            <span className="home-notice-badge">{badgeLabel(previewType)}</span>
            <span className="home-notice-copy">
              <span className="home-notice-title">{draft.text}</span>
              {draft.sub &&
                (draft.link ? (
                  <a
                    className="home-notice-sub"
                    href={draft.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {draft.sub}
                  </a>
                ) : (
                  <span className="home-notice-sub">{draft.sub}</span>
                ))}
            </span>
            {previewType === "dismissible" && (
              <button
                type="button"
                className="home-notice-dismiss"
                aria-label="Dismiss banner"
                disabled
              >
                ×
              </button>
            )}
          </div>
        ) : (
          <p className="admin-banner__preview-empty">Banner hidden</p>
        )}
      </div>
    </div>
  );
};

export default AdminBanner;
