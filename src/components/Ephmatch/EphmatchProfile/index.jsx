// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Photo } from "../../common/Skeleton";

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
  EuiIcon,
  EuiSpacer,
  EuiTextArea,
} from "@elastic/eui";
import styles from "./EphmatchProfile.module.scss";

const EphmatchProfile = ({ navigateTo, wso }) => {
  const [profile, updateProfile] = useState(null);
  // const [locationVisible, updateLocationVisible] = useState(true);
  // const [locationTown, updateLocationTown] = useState("");
  // const [locationState, updateLocationState] = useState("");
  // const [locationCountry, updateLocationCountry] = useState("");
  // const [messagingPlatform, updateMessagingPlatform] = useState("NONE");
  // const [messagingUsername, updateMessagingUsername] = useState("");
  // const [photo, updatePhoto] = useState(null);
  const photo = null;

  const [tags, updateTags] = useState([]);
  const [pronouns, updatePronouns] = useState("");
  const [description, updateDescription] = useState("");
  const [matchMessage, updateMatchMessage] = useState("");

  const [tagOptions, updateTagOptions] = useState([]);

  const [optOut, updateOptOut] = useState(false);

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

  /*   const submitHandler = async (event) => {
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
  }; */

  /*   const handlePhotoUpload = (event) => {
    updatePhoto(event.target.files[0]);
  }; */

  // Generates the user's class year
  const toClassYear = (year, offCycle) => {
    if (!year) return null;
    if (offCycle) return `'${(year - 1) % 100}.5`;

    return `'${year % 100}`;
  };

  const renderPhoto = () => {
    if (photo)
      return (
        <div style={{ width: "100%" }}>
          <img src={photo} className={styles.photo} alt="profile" />
        </div>
      );

    return <Photo className={styles.photo} />;
  };

  const renderNameAndClassYear = () => {
    if (!profile?.user) return null;
    const { name, classYear, offCycle } = profile.user;
    return (
      <span className={styles.userName}>{`${name} ${toClassYear(
        classYear,
        offCycle
      )}`}</span>
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
      // console.log(newSuggestions);
    } catch {
      // Do nothing - it's okay to not have autocomplete.
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageContent}>
        <EuiSpacer size="l" />
        {renderPhoto()}
        <EuiSpacer />
        {renderNameAndClassYear()}
        <EuiSpacer />
        <EuiForm component="form">
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
