import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../lib/store";
import { getWSO } from "../../../lib/authSlice";
import { BannerBanner } from "wso-api-client/lib/services/types";
import { Select } from "../../ui";
import "./Admin.css";

const BANNER_TYPES = ["pinned", "emergency", "dismissible"];

const emptyBanner = (): BannerBanner => ({
  visible: false,
  type: "pinned",
  text: "",
  link: "",
  sub: "",
});

const badgeLabel = (type?: string) => (type === "emergency" ? "Notice" : "New");

const AdminBanner = () => {
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();

  const [draft, setDraft] = useState<BannerBanner | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const response = await wso.bannerService.getBanner();
        if (!isMounted) return;
        const data = response.data ?? {};
        setDraft({
          ...emptyBanner(),
          ...data,
          // API may return type:"" when hidden; keep a valid select value
          type: data.type || "pinned",
        });
      } catch (error) {
        navigateTo("/error", { replace: true, state: { error } });
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
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft) return;
    setSaving(true);

    try {
      const payload: BannerBanner = {
        ...draft,
        type: draft.type || "pinned",
      };
      const response = await wso.bannerService.setBanner(payload);
      const saved = response.data ?? payload;
      setDraft({
        ...emptyBanner(),
        ...saved,
        type: saved.type || "pinned",
      });
    } catch (error) {
      navigateTo("/error", { replace: true, state: { error } });
    } finally {
      setSaving(false);
    }
  };

  if (!draft) return null;

  const previewType = draft.type || "pinned";
  const noticeClass =
    previewType === "emergency"
      ? "home-notice home-notice--emergency"
      : "home-notice";
  const showPreview = Boolean(draft.visible && draft.text);

  return (
    <div className="admin-banner">
      <div className="admin-banner__heading">
        <h3>Homepage banner</h3>
        <label className="admin-banner__check">
          <input
            type="checkbox"
            checked={Boolean(draft.visible)}
            onChange={(e) => updateField("visible", e.target.checked)}
          />
          Visible?
        </label>
      </div>

      <form className="admin-banner__form" onSubmit={save}>
        <div className="admin-banner__row">
          <label htmlFor="admin-banner-type">Type</label>
          <Select
            value={previewType}
            options={BANNER_TYPES}
            onChange={(e) => updateField("type", e.target.value)}
          />
        </div>

        <div className="admin-banner__row">
          <label htmlFor="admin-banner-title">Title</label>
          <input
            id="admin-banner-title"
            type="text"
            value={draft.text ?? ""}
            onChange={(e) => updateField("text", e.target.value)}
            required={Boolean(draft.visible)}
          />
        </div>

        <div className="admin-banner__row">
          <label htmlFor="admin-banner-sub">Subtitle</label>
          <input
            id="admin-banner-sub"
            type="text"
            value={draft.sub ?? ""}
            onChange={(e) => updateField("sub", e.target.value)}
          />
        </div>

        <div className="admin-banner__row">
          <label htmlFor="admin-banner-link">Link URL</label>
          <input
            id="admin-banner-link"
            type="text"
            value={draft.link ?? ""}
            onChange={(e) => updateField("link", e.target.value)}
          />
        </div>

        <div className="admin-banner__preview-frame">
          {showPreview ? (
            <div className={noticeClass}>
              <span className="home-notice-badge">
                {badgeLabel(previewType)}
              </span>
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

        <div className="admin-banner__actions">
          <input
            type="submit"
            value={saving ? "Saving…" : "Save"}
            data-disable-with="Save"
            disabled={saving}
          />
        </div>
      </form>
    </div>
  );
};

export default AdminBanner;
