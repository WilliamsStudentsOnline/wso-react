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
  locationVisible,
  updateLocationVisible,
  locationTown,
  updateLocationTown,
  locationState,
  updateLocationState,
  locationCountry,
  updateLocationCountry,
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
        <div>
          <strong>Current Location:</strong>
          <input
            type="text"
            value={locationTown || ""}
            onChange={(event) => updateLocationTown(event.target.value)}
            placeholder="Town"
          />
          <input
            type="text"
            value={locationState || ""}
            onChange={(event) => updateLocationState(event.target.value)}
            placeholder="State"
          />
          <input
            type="text"
            value={locationCountry || ""}
            onChange={(event) => updateLocationCountry(event.target.value)}
            placeholder="Country"
          />
          <strong>Show Current Location:</strong>
          Show&nbsp;
          <input
            type="radio"
            name="locationVisible"
            value="true"
            checked={locationVisible}
            onChange={(e) => {
              updateLocationVisible(e.target.value === "true");
            }}
          />
          Hide&nbsp;
          <input
            type="radio"
            name="locationVisible"
            value="false"
            checked={!locationVisible}
            onChange={(e) => {
              updateLocationVisible(e.target.value === "true");
            }}
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
  locationVisible: PropTypes.bool,
  locationTown: PropTypes.string,
  locationState: PropTypes.string,
  locationCountry: PropTypes.string,
  updateDescription: PropTypes.func.isRequired,
  updateMatchMessage: PropTypes.func.isRequired,
  updateLocationVisible: PropTypes.func.isRequired,
  updateLocationTown: PropTypes.func.isRequired,
  updateLocationState: PropTypes.func.isRequired,
  updateLocationCountry: PropTypes.func.isRequired,
};

EphmatchForm.defaultProps = {
  children: null,
  description: "",
  matchMessage: "",
  locationVisible: true,
  locationTown: "",
  locationState: "",
  locationCountry: "",
};

export default EphmatchForm;
