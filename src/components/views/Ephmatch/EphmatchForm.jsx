// React imports
import React from "react";
import PropTypes from "prop-types";

const EphmatchForm = ({
  submitHandler,
  children,
  description,
  updateDescription,
  matchMessage,
  updateMatchMessage,
  messagingPlatform,
  updateMessagingPlatform,
  messagingUsername,
  updateMessagingUsername,
  unix,
}) => {
  return (
    <form onSubmit={submitHandler} className="ephmatch-form">
      {children}
      <strong>Profile Description:</strong>
      <input
        type="text"
        value={description || ""}
        onChange={(event) => updateDescription(event.target.value)}
        placeholder="Add a short description to your profile to help others know you
      better!"
      />
      <br />
      <strong>Seen Only by Your Matches:</strong>
      <br />
      <div className="match-message">
        <strong>Messaging Info:</strong>
        <br />
        Consider adding a phone number, Snapchat or Instagram handle for your
        matches to see!
        <label
          style={{ display: "flex", flexDirection: "row" }}
          htmlFor="messagingPlatform"
        >
          Platform: &nbsp;
          <select
            id="messagingPlatform"
            value={messagingPlatform}
            onChange={(event) => updateMessagingPlatform(event.target.value)}
            style={{ marginBottom: "0" }}
          >
            <option value="NONE">Unix</option>
            <option value="Phone">Phone</option>
            <option value="Snapchat">Snapchat</option>
            <option value="Instagram">Instagram</option>
          </select>
        </label>
        <input
          type="text"
          required
          value={
            messagingPlatform === "NONE"
              ? `${unix}@williams.edu`
              : messagingUsername || ""
          }
          disabled={messagingPlatform === "NONE"}
          onChange={(event) => updateMessagingUsername(event.target.value)}
          placeholder={`Your ${
            messagingPlatform === "Phone" ? "phone number" : "username"
          } for matches to message you!`}
        />
        <br />
        <strong>Match Message:</strong>
        <br />
        Use this to tell your matches something!
        <input
          type="text"
          value={matchMessage || ""}
          onChange={(event) => updateMatchMessage(event.target.value)}
          placeholder="Say something to your matches!"
        />
      </div>
      <br /> <br />
      <input type="submit" value="Save" data-disable-with="Save" />
    </form>
  );
};

EphmatchForm.propTypes = {
  submitHandler: PropTypes.func.isRequired,
  children: PropTypes.arrayOf(PropTypes.object),
  description: PropTypes.string,
  matchMessage: PropTypes.string,
  messagingPlatform: PropTypes.string,
  messagingUsername: PropTypes.string,
  unix: PropTypes.string,
  updateDescription: PropTypes.func.isRequired,
  updateMatchMessage: PropTypes.func.isRequired,
  updateMessagingPlatform: PropTypes.func.isRequired,
  updateMessagingUsername: PropTypes.func.isRequired,
};

EphmatchForm.defaultProps = {
  children: null,
  description: "",
  matchMessage: "",
  messagingPlatform: "NONE",
  messagingUsername: "",
  unix: "",
};

export default EphmatchForm;
