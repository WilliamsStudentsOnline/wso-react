import React, { useEffect, useId, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useAppSelector } from "../../lib/store";
import { getCurrUser, getWSO } from "../../lib/authSlice";
import { createFeedback } from "../../lib/feedback";
import { Button } from "../ui";
import "./Feedback.css";

type FeedbackFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
};

const FeedbackFormModal = ({
  open,
  onClose,
  onSubmitted,
}: FeedbackFormModalProps) => {
  const wso = useAppSelector(getWSO);
  const currUser = useAppSelector(getCurrUser);
  const titleId = useId();
  const notesRef = useRef<HTMLTextAreaElement>(null);

  const [notes, setNotes] = useState("");
  const [contact, setContact] = useState(true);
  const [preferredName, setPreferredName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return undefined;

    setNotes("");
    setContact(true);
    setPreferredName("");
    setError("");
    setSubmitting(false);

    const previousOverflow = document.body.style.overflow;
    const scrollEl = document.querySelector(
      ".layout-scroll"
    ) as HTMLElement | null;
    const previousScrollOverflow = scrollEl?.style.overflow ?? "";
    document.body.style.overflow = "hidden";
    if (scrollEl) scrollEl.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => notesRef.current?.focus(), 0);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      if (scrollEl) scrollEl.style.overflow = previousScrollOverflow;
    };
  }, [open]);

  if (!open) return null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = notes.trim();
    if (!trimmed) {
      setError("Please enter some feedback.");
      return;
    }
    if (!currUser?.id || currUser.id < 0) {
      setError("You need to be logged in to submit feedback.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await createFeedback(wso, {
        notes: trimmed,
        url: window.location.href,
        preferredName: contact ? preferredName.trim() || undefined : undefined,
        userID: contact ? currUser.id : undefined,
      });
      onSubmitted?.();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not submit feedback."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="feedback-backdrop"
        aria-label="Close feedback form"
        onClick={onClose}
      />
      <div
        className="feedback-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            onClose();
          }
        }}
      >
        <div className="feedback-modal__header">
          <h2 id={titleId}>Send feedback</h2>
          <button
            type="button"
            className="feedback-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            <MdClose size={20} />
          </button>
        </div>

        <form className="feedback-modal__form" onSubmit={submit}>
          <label>
            Feedback
            <textarea
              ref={notesRef}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              required
              maxLength={20000}
            />
          </label>

          <label className="feedback-modal__check">
            <input
              type="checkbox"
              checked={contact}
              onChange={(event) => setContact(event.target.checked)}
            />
            OK to contact me about this
          </label>

          {contact && (
            <label>
              Preferred name
              <input
                type="text"
                value={preferredName}
                onChange={(event) => setPreferredName(event.target.value)}
                placeholder="How should we address you?"
                maxLength={255}
              />
            </label>
          )}

          {error && <p className="feedback-modal__error">{error}</p>}

          <div className="feedback-modal__actions">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="submit" disabled={submitting}>
              {submitting ? "Sending…" : "Send"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default FeedbackFormModal;
