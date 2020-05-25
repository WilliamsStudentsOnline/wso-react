// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Ephmatcher from "./Ephmatcher";
import EphmatchForm from "./EphmatchForm";

// Redux/routing imports
import { connect } from "react-redux";
import { getToken } from "../../../selectors/auth";
import { actions } from "redux-router5";

// Additional imports
import { checkAndHandleError } from "../../../lib/general";
import {
  createEphmatchProfile,
  getSelfEphmatchProfile,
} from "../../../api/ephmatch";
import { getUser } from "../../../api/users";

// Page created to handle both opting in and out.
const EphmatchOptIn = ({ token, navigateTo }) => {
  // Note that this is different from Ephcatch
  const [optIn, updateOptIn] = useState(null);
  const [description, updateDescription] = useState("");
  const [userInfo, updateUserInfo] = useState(null);
  const [matchMessage, updateMatchMessage] = useState("");
  const [locationVisible, updateLocationVisible] = useState(true);
  const [locationTown, updateLocationTown] = useState("");
  const [locationState, updateLocationState] = useState("");
  const [locationCountry, updateLocationCountry] = useState("");
  const [messagingPlatform, updateMessagingPlatform] = useState("NONE");
  const [messagingUsername, updateMessagingUsername] = useState("");
  const [unixID, updateUnixID] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadUserInfo = async () => {
      const ownProfile = await getUser(token);
      if (checkAndHandleError(ownProfile) && isMounted) {
        updateUserInfo(ownProfile.data.data);
        updateUnixID(ownProfile.data.data.unixID);
        updateLocationTown(ownProfile.data.data.homeTown);
        updateLocationState(ownProfile.data.data.homeState);
        updateLocationCountry(ownProfile.data.data.homeCountry);
      }

      // Load ephmatch profile to see if one exists
      const ownEphmatchProfile = await getSelfEphmatchProfile(token);
      if (checkAndHandleError(ownEphmatchProfile) && isMounted) {
        const ephmatchProfile = ownEphmatchProfile.data.data;

        updateDescription(ephmatchProfile.description);
        updateMatchMessage(ephmatchProfile.matchMessage);
        updateLocationVisible(ephmatchProfile.locationVisible);
        updateLocationTown(ephmatchProfile.locationTown);
        updateLocationState(ephmatchProfile.locationState);
        updateLocationCountry(ephmatchProfile.locationCountry);
        updateMessagingPlatform(
          ephmatchProfile.messagingPlatform
            ? ephmatchProfile.messagingPlatform
            : "NONE"
        );
        updateMessagingUsername(ephmatchProfile.messagingUsername);
        updateUnixID(ephmatchProfile.user.unixID);
      }
    };

    loadUserInfo();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const submitHandler = async (event) => {
    event.preventDefault();

    const params = {
      description,
      matchMessage,
      locationVisible,
      locationTown,
      locationState,
      locationCountry,
      messagingPlatform,
      messagingUsername:
        messagingUsername === "NONE" ? null : messagingUsername,
    };
    const response = await createEphmatchProfile(token, params);

    // Update succeeded -> redirect them to main ephmatch page.
    if (checkAndHandleError(response)) {
      navigateTo("ephmatch", null, { reload: true });
    }
  };

  const dummyEphmatchProfile = {
    id: 0,
    description,
    matchMessage,
    locationVisible,
    locationTown,
    locationState,
    locationCountry,
    messagingPlatform,
    messagingUsername,
  };

  return (
    <div className="article">
      <section>
        <article>
          <p>
            Ephmatch is an exclusive feature for a limited time created to spark
            encounters between yourself and other Ephs. If you opt in, you will
            be able to see the profiles of other Ephs who have chosen to opt
            into the system. After opting in, you may choose to opt out at any
            time as well.
          </p>
          <br />
          <br />
          <EphmatchForm
            submitHandler={submitHandler}
            description={description}
            matchMessage={matchMessage}
            locationVisible={locationVisible}
            locationTown={locationTown}
            locationState={locationState}
            locationCountry={locationCountry}
            messagingPlatform={messagingPlatform}
            messagingUsername={messagingUsername}
            updateDescription={updateDescription}
            updateMatchMessage={updateMatchMessage}
            updateLocationVisible={updateLocationVisible}
            updateLocationTown={updateLocationTown}
            updateLocationState={updateLocationState}
            updateLocationCountry={updateLocationCountry}
            updateMessagingPlatform={updateMessagingPlatform}
            updateMessagingUsername={updateMessagingUsername}
            unix={unixID}
          >
            <h3>Create your Ephmatch Profile</h3>
            <div className="ephmatch-sample-profile">
              <Ephmatcher
                ephmatcherProfile={dummyEphmatchProfile}
                ephmatcher={userInfo}
                matched
                token={token}
              />
            </div>
            <p>
              <input
                type="checkbox"
                onChange={(event) => updateOptIn(event.target.checked)}
                defaultChecked={optIn}
                required
              />
              <strong>I want to opt into Ephmatch.</strong>
            </p>
          </EphmatchForm>
        </article>
      </section>
    </div>
  );
};

EphmatchOptIn.propTypes = {
  token: PropTypes.string.isRequired,
  navigateTo: PropTypes.func.isRequired,
};

EphmatchOptIn.defaultProps = {};

const mapStateToProps = (state) => ({
  token: getToken(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EphmatchOptIn);
