// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Ephmatcher from "./Ephmatcher";
import EphmatchForm from "./EphmatchForm";

// Redux/routing imports
import { connect } from "react-redux";
import { getWSO } from "../../../selectors/auth";
import { actions } from "redux-router5";

// Page created to handle both opting in and out.
const EphmatchOptIn = ({ wso, navigateTo }) => {
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
      try {
        const ownProfile = await wso.userService.getUser("me");
        if (isMounted) {
          updateUserInfo(ownProfile.data);
          updateUnixID(ownProfile.data.unixID);
          updateLocationTown(ownProfile.data.homeTown);
          updateLocationState(ownProfile.data.homeState);
          updateLocationCountry(ownProfile.data.homeCountry);
        }

        const ownEphmatchProfile = await wso.ephmatchService.getSelfProfile();

        updateDescription(ownEphmatchProfile.description);
        updateMatchMessage(ownEphmatchProfile.matchMessage);
        updateLocationVisible(ownEphmatchProfile.locationVisible);
        updateLocationTown(ownEphmatchProfile.locationTown);
        updateLocationState(ownEphmatchProfile.locationState);
        updateLocationCountry(ownEphmatchProfile.locationCountry);
        updateMessagingPlatform(
          ownEphmatchProfile.messagingPlatform
            ? ownEphmatchProfile.messagingPlatform
            : "NONE"
        );
        updateMessagingUsername(ownEphmatchProfile.messagingUsername);
        updateUnixID(ownEphmatchProfile.user.unixID);
      } catch {
        // eslint-disable-next-line no-empty
      }
    };

    loadUserInfo();

    return () => {
      isMounted = false;
    };
  }, [wso]);

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

    try {
      await wso.ephmatchService.createEphmatchProfile(params);

      // Update succeeded -> redirect them to main ephmatch page.
      navigateTo("ephmatch", null, { reload: true });
    } catch {
      // eslint-disable-next-line no-empty
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
                wso={wso}
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
  wso: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
};

EphmatchOptIn.defaultProps = {};

const mapStateToProps = (state) => ({
  wso: getWSO(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EphmatchOptIn);
