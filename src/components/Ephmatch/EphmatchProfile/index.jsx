// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Ephmatcher from "../Ephmatcher";
import Errors from "../../common/Errors";
import TagEdit from "../../common/TagEdit";
import EphmatchForm from "../EphmatchForm";

// Redux/routing imports
import { connect } from "react-redux";
import { getWSO } from "../../../selectors/auth";
import { doUpdateUser } from "../../../actions/auth";
import { actions } from "redux-router5";

const EphmatchProfile = ({ wso, navigateTo }) => {
  const [profile, updateProfile] = useState(null);
  const [description, updateDescription] = useState("");
  const [matchMessage, updateMatchMessage] = useState("");
  const [locationVisible, updateLocationVisible] = useState(true);
  const [locationTown, updateLocationTown] = useState("");
  const [locationState, updateLocationState] = useState("");
  const [locationCountry, updateLocationCountry] = useState("");
  const [messagingPlatform, updateMessagingPlatform] = useState("NONE");
  const [messagingUsername, updateMessagingUsername] = useState("");
  const [unixID, updateUnixID] = useState("");
  const [photo, updatePhoto] = useState(null);
  const [errors, updateErrors] = useState([]);
  const [tags, updateTags] = useState([]);

  useEffect(() => {
    let isMounted = true;
    // Check if there is an ephmatch profile for the user
    const loadEphmatchProfile = async () => {
      try {
        const ownProfile = await wso.ephmatchService.getSelfProfile();

        if (isMounted) {
          const ephmatchProfile = ownProfile.data;
          updateProfile(ephmatchProfile);
          updateDescription(ephmatchProfile.description);
          updateTags(ephmatchProfile.user.tags.map((tag) => tag.name));
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
      } catch {
        // There shouldn't be any reason for the submission to be rejected.
        navigateTo("500");
      }
    };

    loadEphmatchProfile();

    return () => {
      isMounted = false;
    };
  }, [navigateTo, wso]);

  const submitHandler = async (event) => {
    event.preventDefault();

    const newErrors = [];

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
      // Update the profile.
      await wso.ephmatchService.updateSelfProfile(params);

      // Update Photos
      if (photo) {
        await wso.userService.updateUserPhoto("me", photo);
      }
      // Update succeeded -> redirect them to main ephmatch page.
      navigateTo("ephmatch");
    } catch (error) {
      newErrors.push(error.message);
      updateErrors(newErrors);
    }
  };

  const handlePhotoUpload = (event) => {
    updatePhoto(event.target.files[0]);
  };

  const dummyEphmatchProfile = {
    ...profile,
    description,
    matchMessage,
    locationVisible,
    locationTown,
    locationState,
    locationCountry,
    messagingPlatform,
    messagingUsername,
  };

  const dummyEphmatcher = profile && {
    ...profile.user,
    tags: tags.map((tag) => {
      return { name: tag };
    }),
  };

  return (
    <div className="article">
      <section>
        <article>
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
            <Errors errors={errors} />
            <h3>Profile</h3>
            {profile && (
              <div className="ephmatch-sample-profile">
                <Ephmatcher
                  ephmatcherProfile={dummyEphmatchProfile}
                  ephmatcher={dummyEphmatcher}
                  matched
                  photo={photo && URL.createObjectURL(photo)}
                  wso={wso}
                />
              </div>
            )}
            <strong>Profile Picture:</strong>
            <br />
            <input type="file" onChange={handlePhotoUpload} />
            <br />
            <strong>Tags</strong>
            <p>
              <i>Note:&nbsp;</i>
              Only actual student groups (student organizations, music groups,
              sports teams, etc.) can be added as tags. Don&#39;t see your
              group? Contact us at wso-dev@wso.williams.edu
            </p>
            <TagEdit
              tags={tags}
              updateTags={updateTags}
              updateErrors={updateErrors}
              wso={wso}
            />
            <br />
          </EphmatchForm>
        </article>
      </section>
    </div>
  );
};

EphmatchProfile.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  wso: PropTypes.object.isRequired,
};

EphmatchProfile.defaultProps = {};

const mapStateToProps = (state) => ({
  wso: getWSO(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
  updateUser: (updatedUser) => dispatch(doUpdateUser(updatedUser)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EphmatchProfile);
