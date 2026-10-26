import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../lib/store";
import { getWSO } from "../../../lib/authSlice";
import { BannerBanner } from "wso-api-client/lib/services/types";
import { Select } from "../../ui";

const BANNER_TYPES = ["pinned", "emergency", "dismissible"];

const emptyBanner = (): BannerBanner => ({
  visible: false,
  type: "pinned",
  text: "",
  link: "",
  sub: "",
});

const AdminBanner = () => {
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();

  const [draft, setDraft] = useState<BannerBanner | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const response = await wso.bannerService.getBanner();
        if (!isMounted) return;
        setDraft({ ...emptyBanner(), ...(response.data ?? {}) });
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
    setStatus(null);
    setErrors([]);
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft) return;
    setSaving(true);
    setStatus(null);
    setErrors([]);

    try {
      const response = await wso.bannerService.setBanner(draft);
      setDraft({ ...emptyBanner(), ...(response.data ?? draft) });
      setStatus("Saved");
    } catch (error) {
      navigateTo("/error", { replace: true, state: { error } });
    } finally {
      setSaving(false);
    }
  };

  const hideBanner = async () => {
    if (!draft) return;
    setSaving(true);
    setStatus(null);
    setErrors([]);
    const payload: BannerBanner = { ...draft, visible: false };
    try {
      const response = await wso.bannerService.setBanner(payload);
      setDraft({ ...emptyBanner(), ...(response.data ?? payload) });
      setStatus("Banner hidden");
    } catch (error) {
      navigateTo("/error", { replace: true, state: { error } });
    } finally {
      setSaving(false);
    }
  };

  if (!draft) return null;

  return (
    <div className="article">
      <section>
        <article>
          <div id="errors">
            {errors.map((msg) => (
              <p key={msg}>{msg}</p>
            ))}
          </div>

          <form onSubmit={save}>
            <h3>Homepage banner</h3>
            <table id="factrak-survey-table">
              <tbody>
                <tr>
                  <td align="left">
                    <strong>Visible</strong>
                  </td>
                  <td align="left">
                    <input
                      type="checkbox"
                      checked={Boolean(draft.visible)}
                      onChange={(e) => updateField("visible", e.target.checked)}
                    />
                  </td>
                </tr>
                <tr>
                  <td align="left">
                    <strong>Type</strong>
                  </td>
                  <td align="left">
                    <Select
                      value={draft.type || "pinned"}
                      options={BANNER_TYPES}
                      onChange={(e) => updateField("type", e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td align="left">
                    <strong>Title</strong>
                  </td>
                  <td align="left">
                    <input
                      type="text"
                      value={draft.text ?? ""}
                      onChange={(e) => updateField("text", e.target.value)}
                      required={Boolean(draft.visible)}
                    />
                  </td>
                </tr>
                <tr>
                  <td align="left">
                    <strong>Subtitle</strong>
                  </td>
                  <td align="left">
                    <input
                      type="text"
                      value={draft.sub ?? ""}
                      onChange={(e) => updateField("sub", e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td align="left">
                    <strong>Link URL</strong>
                  </td>
                  <td align="left">
                    <input
                      type="url"
                      value={draft.link ?? ""}
                      onChange={(e) => updateField("link", e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <br />
                    <input
                      type="submit"
                      value={saving ? "Saving…" : "Save"}
                      data-disable-with="Save"
                      disabled={saving}
                    />{" "}
                    <button
                      type="button"
                      className="inline-button"
                      disabled={saving || !draft.visible}
                      onClick={hideBanner}
                    >
                      Hide
                    </button>
                    {status && <p>{status}</p>}
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </article>
      </section>
    </div>
  );
};

export default AdminBanner;
