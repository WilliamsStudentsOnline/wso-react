import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../lib/store";
import { getCurrUser } from "../../lib/authSlice";
import FeedbackFormModal from "./FeedbackFormModal";
import "./Feedback.css";

const FeedbackFab = () => {
  const currUser = useAppSelector(getCurrUser);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(false), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  if (!currUser) return null;

  return (
    <>
      <button
        type="button"
        className="floating-button-link feedback-fab"
        title="Provide Feedback!"
        aria-label="Provide feedback"
        onClick={() => setOpen(true)}
      >
        <i
          className="material-icons"
          style={{ position: "relative", left: "-8px" }}
        >
          feedback
        </i>
      </button>

      <FeedbackFormModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmitted={() => setToast(true)}
      />

      {toast && <div className="feedback-toast">Thanks for the feedback!</div>}
    </>
  );
};

export default FeedbackFab;
