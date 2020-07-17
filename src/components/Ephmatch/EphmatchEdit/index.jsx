// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { InfoModal } from "../../common/Modal";
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
  EuiSuperSelect,
  EuiTextArea,
} from "@elastic/eui";
import { AiFillPhone } from "react-icons/ai";
import { FaSnapchatSquare, FaInstagramSquare } from "react-icons/fa";
import styles from "./EphmatchEdit.module.scss";
import { userToNameWithClassYear } from "../../../lib/general";
import ProfileUpdated from "../../../assets/SVG/EphMatch3.svg";
import HideProfile from "../../../assets/SVG/HideProfile.svg";

const EphmatchProfile = ({ navigateTo, wso }) => {
  // User information
  const [description, setDescription] = useState("");
  const [matchMessage, setMatchMessage] = useState("");
  const [messagingPlatform, setMessagingPlatform] = useState("NONE");
  const [messagingUsername, setMessagingUsername] = useState("");
  const [photo, setPhoto] = useState(null);
  const [profile, setProfile] = useState(null);
  const [pronouns, setPronouns] = useState("");
  const [tags, setTags] = useState([]);

  // Available options for organization tags
  const [tagOptions, setTagOptions] = useState([]);

  // Whether the user decides to opt out
  const [optOut, setOptOut] = useState(false);

  // Global toasts
  const [toasts, setToasts] = useState([]);

  // Modal for form submission/Ephmatch opt out/in.
  const [modal, setModal] = useState(null);

  useEffect(() => {
    let isMounted = true;
    // Check if there is an ephmatch profile for the user
    const loadEphmatchProfile = async () => {
      try {
        const ownProfile = await wso.ephmatchService.getSelfProfile();

        if (isMounted) {
          const ephmatchProfile = ownProfile.data;
          setProfile(ephmatchProfile);
          setDescription(ephmatchProfile.description);
          setTags(
            (ephmatchProfile.user.tags ?? []).map((tag) => ({
              label: tag.name,
            }))
          );
          setMatchMessage(ephmatchProfile.matchMessage);
          if (
            ephmatchProfile.messagingPlatform &&
            ephmatchProfile.messagingPlatform !== ""
          ) {
            setMessagingPlatform(ephmatchProfile.messagingPlatform);
          }
          setMessagingUsername(ephmatchProfile.messagingUsername);
          setPronouns(ephmatchProfile.user.pronoun ?? "");
          setOptOut(ephmatchProfile.deleted);
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
      messagingPlatform,
      messagingUsername:
        messagingUsername === "NONE" ? null : messagingUsername,
    };

    // The endpoint expects only an array of strings.
    const tagParams = tags.map((tag) => tag.label);

    try {
      // Update the profile.
      await wso.ephmatchService.updateSelfProfile(params);
      await wso.userService.updateUserTags("me", { tags: tagParams });
      await wso.userService.updateUser("me", { pronoun: pronouns });

      // Update Photos
      if (photo) await wso.userService.updateUserPhoto("me", photo);

      setModal(
        <InfoModal
          alt="Profile Updated"
          image={ProfileUpdated}
          closeModal={() => setModal(null)}
          title="Profile Updated!"
        />
      );
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

  const optOutChangeHandler = async (event) => {
    const newChecked = event.target.checked;

    setOptOut(newChecked);

    if (newChecked) {
      try {
        await wso.ephmatchService.deleteSelfProfile();

        setModal(
          <InfoModal
            alt="Profile Hidden"
            image={HideProfile}
            closeModal={() => setModal(null)}
            title="Profile Hidden!"
            message={`Your profile will not be viewable by other users \
                  of Ephmatch nor will you be able to view other \
                  profiles while your profile is hidden.`}
          />
        );
      } catch (error) {
        setOptOut(!newChecked);
        setToasts([
          {
            title: "Unable to opt out of Ephmatch right now!",
            text: error.message,
            color: "danger",
          },
        ]);
      }
    }
  };

  const handlePhotoUpload = (event) => setPhoto(event.target.files[0]);

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
      setTagOptions(newSuggestions.map((tag) => ({ label: tag.value })));
    } catch {
      // Do nothing - it's okay to not have autocomplete.
    }
  };

  const removeToast = (removedToast) => {
    setToasts(toasts.filter((toast) => toast.id !== removedToast.id));
  };

  const contactPlatformOptions = [
    { value: "NONE", inputDisplay: "None" },
    {
      value: "Phone",
      inputDisplay: (
        <span>
          <AiFillPhone className={styles.iconChoice} /> Phone
        </span>
      ),
    },
    {
      value: "Snapchat",
      inputDisplay: (
        <span>
          <FaSnapchatSquare className={styles.iconChoice} /> Snapchat
        </span>
      ),
    },
    {
      value: "Instagram",
      inputDisplay: (
        <span>
          <FaInstagramSquare className={styles.iconChoice} /> Instagram
        </span>
      ),
    },
  ];

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
              name="pronouns"
              onChange={(e) => setPronouns(e.target.value)}
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
                  onChange={(selectedOptions) => setTags(selectedOptions)}
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
              onChange={(e) => setDescription(e.target.value)}
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
              onChange={(e) => setMatchMessage(e.target.value)}
              placeholder="Add a message for your matches!"
            />
          </EuiFormRow>
          <EuiFormRow
            label={
              <span className={styles.formElementLabel}>
                Contact Information
              </span>
            }
            helpText="Only your matches can see this"
          >
            <EuiFlexGroup>
              <EuiFlexItem>
                <EuiSuperSelect
                  options={contactPlatformOptions}
                  valueOfSelected={messagingPlatform}
                  onChange={(value) => setMessagingPlatform(value)}
                />
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiFieldText
                  value={messagingUsername}
                  name="first"
                  onChange={(e) => setMessagingUsername(e.target.value)}
                />
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFormRow>

          <EuiSpacer />

          {/* Separate form for this - opt out the moment the checkbox is ticked */}
          <EuiForm>
            <EuiFormRow>
              <EuiCheckbox
                id="hide-profile"
                checked={optOut}
                onChange={optOutChangeHandler}
                label="Hide my EphMatch Profile"
              />
            </EuiFormRow>
          </EuiForm>

          <EuiSpacer />

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
        {modal}
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
