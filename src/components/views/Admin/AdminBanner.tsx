import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

const errorMessage = (err: unknown): string => {
  if (err && typeof err === "object" && "message" in err) {
    const msg = (err as { message?: string }).message;
    if (msg) return msg;
  }
  if (err instanceof Error) return err.message;
  return "Failed to load or save banner";
};

const AdminBanner = () => {
  const wso = useAppSelector(getWSO);

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
        setError(null);
      } catch (err) {
        if (isMounted) setError(errorMessage(err));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [wso]);

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

    try {
      const response = await wso.bannerService.setBanner(draft);
      setDraft({ ...emptyBanner(), ...(response.data ?? draft) });
      setStatus("Saved");
    } catch (err) {
      setError(errorMessage(err));
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
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="facebook-profile">
      <section className="margin-vertical-small">
        <p>
          <Link to="/admin">← Admin</Link>
        </p>
        <h3>Homepage banner</h3>

        {loading ? (
          <p>Loading…</p>
        ) : (
          <form onSubmit={save}>
            <p>
              <label>
                <input
                  type="checkbox"
                  checked={Boolean(draft.visible)}
                  onChange={(e) => updateField("visible", e.target.checked)}
                />{" "}
                Visible
              </label>
            </p>

            <p>
              Type
              <br />
              <Select
                value={draft.type || "pinned"}
                options={BANNER_TYPES}
                onChange={(e) => updateField("type", e.target.value)}
              />
            </p>

            <p>
              Title
              <br />
              <input
                type="text"
                value={draft.text ?? ""}
                onChange={(e) => updateField("text", e.target.value)}
                required={Boolean(draft.visible)}
              />
            </p>

            <p>
              Subtitle
              <br />
              <input
                type="text"
                value={draft.sub ?? ""}
                onChange={(e) => updateField("sub", e.target.value)}
              />
            </p>

            <p>
              Link URL
              <br />
              <input
                type="url"
                value={draft.link ?? ""}
                onChange={(e) => updateField("link", e.target.value)}
              />
            </p>

            <p>
              <input
                type="submit"
                value={saving ? "Saving…" : "Save"}
                className="submit"
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
            </p>

            {status && <p>{status}</p>}
            {error && <p>{error}</p>}
          </form>
        )}
      </section>
    </article>
  );
};

export default AdminBanner;
