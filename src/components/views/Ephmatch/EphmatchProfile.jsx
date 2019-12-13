// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux/routing imports
import { connect } from "react-redux";
import { getToken } from "../../../selectors/auth";
import { doUpdateUser } from "../../../actions/auth";
import { actions } from "redux-router5";

// Additional imports
import { checkAndHandleError } from "../../../lib/general";
import {
  getSelfEphmatchProfile,
  updateEphmatchProfile,
  deleteEphmatchProfile,
  createEphmatchProfile,
} from "../../../api/ephmatch";

const EphmatchProfile = ({ token, navigateTo }) => {
  // Note that this is different from Ephcatch
  const [optIn, updateOptIn] = useState(false);
  const [profile, updateProfile] = useState(null);
  const [description, updateDescription] = useState("");

  useEffect(() => {
    // Check if there is an ephmatch profile for the user
    const loadEphmatchProfile = async () => {
      const ownProfile = await getSelfEphmatchProfile(token);
      if (checkAndHandleError(ownProfile)) {
        updateProfile(ownProfile.data.data);
        updateDescription(ownProfile.data.data.description);
        updateOptIn(!ownProfile.data.deleted);
      }
    };

    loadEphmatchProfile();
  }, [token]);

  const submitHandler = async (event) => {
    event.preventDefault();

    const params = {
      description,
      // TODO
      gender: "string",
      otherGender: true,
    };

    let response;

    // TODO check what the delete endpoint actually does
    if (!profile || profile.deleted) {
      // No Profile exists or is deleted
      if (!optIn) {
        // If the user does not want to opt in
        // TODO: Error
        return;
      }
      response = await createEphmatchProfile(token, params);
    } else if (!optIn) {
      // Profile exists but user wants to opt out
      response = await deleteEphmatchProfile(token, params);
    } else {
      // Otherwise update the profile.
      response = await updateEphmatchProfile(token, params);
    }

    // Update succeeded -> redirect them to main ephmatch page.
    if (checkAndHandleError(response)) {
      navigateTo("ephmatch");
    }
  };

  // TODO: Discuss about gender.
  return (
    <div className="article">
      <section>
        <article>
          <p>
            Ephmatch is a limited-time feature created to spark encounters
            between yourself and other Ephs. Here, you can choose whether or not
            you wish to opt into Ephmatch or add a short description to your
            profile.
            <br />
          </p>
          <br />
          <h3>Profile</h3>

          <br />
          <b>
            This is entirely optional - we respect your wishes, and you will not
            be added into the Ephmatch system should you choose not to opt-in.
            Opting in still allows for you to opt out in the future, and even if
            you do not opt in today, the option will still be open for you in
            the future.
          </b>
          <br />
          <br />

          <form onSubmit={submitHandler}>
            <p>
              <strong>Profile Description:</strong>
              <input
                type="text"
                value={description || ""}
                onChange={(event) => updateDescription(event.target.value)}
              />
              <input
                type="checkbox"
                onChange={(event) => updateOptIn(event.target.checked)}
                checked={optIn}
              />
              I want to participate in Ephmatch.
            </p>
            <br />
            <input type="submit" value="Save" data-disable-with="Save" />
          </form>
        </article>
      </section>
    </div>
  );
};

EphmatchProfile.propTypes = {
  token: PropTypes.string.isRequired,
  navigateTo: PropTypes.func.isRequired,
};

EphmatchProfile.defaultProps = {};

const mapStateToProps = (state) => ({
  token: getToken(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location) => dispatch(actions.navigateTo(location)),
  updateUser: (updatedUser) => dispatch(doUpdateUser(updatedUser)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EphmatchProfile);
