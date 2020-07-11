// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { MaybePhoto } from "../../common/Skeleton";

// Redux/routing imports
import { connect } from "react-redux";
import { getWSO } from "../../../selectors/auth";
import { doUpdateUser } from "../../../actions/auth";
import { actions } from "redux-router5";

// External imports
import {
  EuiButton,
  EuiCheckbox,
  EuiComboBox,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
  EuiGlobalToastList,
  EuiIcon,
  EuiSpacer,
  EuiTextArea,
} from "@elastic/eui";
import styles from "./EphmatchEdit.module.scss";
import { userToNameWithClassYear } from "../../../lib/general";

const EphmatchProfile = ({ navigateTo, wso }) => {
  const [profile, updateProfile] = useState(null);
  // const [locationVisible, updateLocationVisible] = useState(true);
  // const [locationTown, updateLocationTown] = useState("");
  // const [locationState, updateLocationState] = useState("");
  // const [locationCountry, updateLocationCountry] = useState("");
  // const [messagingPlatform, updateMessagingPlatform] = useState("NONE");
  // const [messagingUsername, updateMessagingUsername] = useState("");
  const [photo, updatePhoto] = useState(null);

  const [tags, updateTags] = useState([]);
  const [pronouns, updatePronouns] = useState("");
  const [description, updateDescription] = useState("");
  const [matchMessage, updateMatchMessage] = useState("");

  const [tagOptions, updateTagOptions] = useState([]);

  const [optOut, updateOptOut] = useState(false);

  const [toasts, setToasts] = useState([]);

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
          updateTags(
            ephmatchProfile.user.tags
              ? ephmatchProfile.user.tags.map((tag) => ({ label: tag.name }))
              : []
          );
          updateMatchMessage(ephmatchProfile.matchMessage);
          // updateLocationVisible(ephmatchProfile.locationVisible);
          // updateLocationTown(ephmatchProfile.locationTown);
          // updateLocationState(ephmatchProfile.locationState);
          // updateLocationCountry(ephmatchProfile.locationCountry);
          // updateMessagingPlatform(
          //   ephmatchProfile.messagingPlatform
          //     ? ephmatchProfile.messagingPlatform
          //     : "NONE"
          // );
          // updateMessagingUsername(ephmatchProfile.messagingUsername);
          // updateUnixID(ephmatchProfile.user.unixID);
          updatePronouns(ephmatchProfile.user.pronoun ?? "");
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

    const params = {
      description,
      matchMessage,
      // locationVisible,
      // locationTown,
      // locationState,
      // locationCountry,
      // messagingPlatform,
      // messagingUsername:
      //   messagingUsername === "NONE" ? null : messagingUsername,
    };

    const tagParams = tags.map((tag) => tag.label);

    try {
      // Update the profile.
      await wso.ephmatchService.updateSelfProfile(params);
      await wso.userService.updateUserTags("me", { tags: tagParams });
      await wso.userService.updateUser("me", { pronoun: pronouns });

      // Update Photos
      if (photo) {
        await wso.userService.updateUserPhoto("me", photo);
      }
    } catch (error) {
      setToasts([
        {
          title: "Unable to Update Profile",
          text: error.message,
          color: "danger",
        },
      ]);
    }
  };

  const handlePhotoUpload = (event) => updatePhoto(event.target.files[0]);

  const renderPhotoWithPicker = () => {
    return (
      <div className={styles.photo}>
        <MaybePhoto
          photo={photo && URL.createObjectURL(photo)}
          className={styles.photo}
        />

        <input
          className={styles.photoInput}
          type="file"
          onChange={handlePhotoUpload}
        />
        <div className={styles.overlay} />
        <div className={styles.circlePlus}>
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" strokeWidth="10" />
            <line x1="30" y1="50" x2="70" y2="50" strokeWidth="10" />
            <line x1="50" y1="30" x2="50" y2="70" strokeWidth="10" />
          </svg>
        </div>
      </div>
    );
  };

  const renderNameAndClassYear = () => {
    if (!profile?.user) return null;
    return (
      <span className={styles.userName}>
        {userToNameWithClassYear(profile.user)}
      </span>
    );
  };

  const tagAutocomplete = async (query) => {
    try {
      const tagResponse = await wso.autocompleteService.autocompleteTag(
        query,
        5
      );
      const newSuggestions = tagResponse.data;
      updateTagOptions(newSuggestions.map((tag) => ({ label: tag.value })));
    } catch {
      // Do nothing - it's okay to not have autocomplete.
    }
  };

  const removeToast = (removedToast) => {
    setToasts(toasts.filter((toast) => toast.id !== removedToast.id));
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageContent}>
        <EuiSpacer size="l" />
        {renderPhotoWithPicker()}
        <EuiSpacer />
        {renderNameAndClassYear()}
        <EuiSpacer />
        <EuiForm component="form" onSubmit={submitHandler}>
          <EuiFormRow
            label={<span className={styles.formElementLabel}>My Pronouns</span>}
          >
            <EuiFieldText
              value={pronouns}
              name="first"
              onChange={(e) => updatePronouns(e.target.value)}
            />
          </EuiFormRow>
          <EuiFormRow fullWidth>
            <EuiFlexGroup>
              <EuiFlexItem grow={false} className={styles.inlineIcon}>
                <EuiIcon size="xl" type="tag" />
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiComboBox
                  async
                  fullWidth
                  placeholder="Add tags"
                  selectedOptions={tags}
                  isClearable={false}
                  onChange={(selectedOptions) => updateTags(selectedOptions)}
                  onSearchChange={tagAutocomplete}
                  options={tagOptions}
                />
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFormRow>

          <EuiFormRow
            label={<span className={styles.formElementLabel}>About Me</span>}
            fullWidth
          >
            <EuiTextArea
              fullWidth
              resize="none"
              value={description}
              onChange={(e) => updateDescription(e.target.value)}
            />
          </EuiFormRow>
          <EuiFormRow
            label={
              <span className={styles.formElementLabel}>Match Message</span>
            }
            helpText="Only your matches can see this"
            fullWidth
          >
            <EuiTextArea
              fullWidth
              resize="none"
              value={matchMessage}
              onChange={(e) => updateMatchMessage(e.target.value)}
              placeholder="Add a message for your matches!"
            />
          </EuiFormRow>
          <EuiFormRow>
            <EuiCheckbox
              id="hide-profile"
              checked={optOut}
              onChange={(event) => updateOptOut(event.target.checked)}
              label="Hide my EphMatch Profile"
            />
          </EuiFormRow>

          <EuiButton type="submit" fill>
            Save Edits
          </EuiButton>
        </EuiForm>
        <EuiSpacer size="xxl" />
        <EuiGlobalToastList
          toasts={toasts}
          dismissToast={removeToast}
          toastLifeTimeMs={6000}
        />
      </div>
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
