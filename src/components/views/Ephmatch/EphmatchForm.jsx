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
}) => {
  return (
    <form onSubmit={submitHandler} className="ephmatch-form">
      {children}
      <p>
        <strong>Profile Description:</strong>
        <input
          type="text"
          value={description || ""}
          onChange={(event) => updateDescription(event.target.value)}
          placeholder="Add a short description to your profile to help others know you
      better!"
        />
        <div className="match-message">
          <strong>Match Message:</strong>
          <br />
          Only shown to your matches - consider adding a Snapchat or Instagram
          handle for your matches to see!
          <input
            type="text"
            value={matchMessage || ""}
            onChange={(event) => updateMatchMessage(event.target.value)}
            placeholder="Say something to your matches!"
          />
        </div>
      </p>
      <br />
      <input type="submit" value="Save" data-disable-with="Save" />
    </form>
  );
};

EphmatchForm.propTypes = {
  submitHandler: PropTypes.func.isRequired,
  children: PropTypes.object,
  description: PropTypes.string,
  matchMessage: PropTypes.string,
  updateDescription: PropTypes.func.isRequired,
  updateMatchMessage: PropTypes.func.isRequired,
};

EphmatchForm.defaultProps = {
  children: null,
  description: "",
  matchMessage: "",
};

export default EphmatchForm;
