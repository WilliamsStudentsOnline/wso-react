import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../lib/store";
import { getCurrUser } from "../../lib/authSlice";
import FeedbackFormModal from "./FeedbackFormModal";
import "./Feedback.css";

// TODO: replace with the real Google Form URL for logged-out users
const LOGGED_OUT_FEEDBACK_URL = "https://forms.gle/NqYdAAbZKPQmPq866";

const FabIcon = () => (
  <i className="material-icons" style={{ position: "relative", left: "-8px" }}>
    feedback
  </i>
);

const FeedbackFab = () => {
  const currUser = useAppSelector(getCurrUser);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(false), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <>
      {currUser ? (
        <button
          type="button"
          className="floating-button-link feedback-fab"
          title="Provide Feedback!"
          aria-label="Provide feedback"
          onClick={() => setOpen(true)}
        >
          <FabIcon />
        </button>
      ) : (
        <a
          href={LOGGED_OUT_FEEDBACK_URL}
          className="floating-button-link"
          title="Provide Feedback!"
          target="_blank"
          rel="noreferrer"
        >
          <FabIcon />
        </a>
      )}

      {currUser && (
        <FeedbackFormModal
          open={open}
          onClose={() => setOpen(false)}
          onSubmitted={() => setToast(true)}
        />
      )}

      {toast && <div className="feedback-toast">Thanks for the feedback!</div>}
    </>
  );
};

export default FeedbackFab;
