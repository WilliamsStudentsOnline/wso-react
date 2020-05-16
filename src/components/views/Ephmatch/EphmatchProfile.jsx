// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Ephmatcher from "./Ephmatcher";
import Errors from "../../Errors";
import TagEdit from "../../TagEdit";
import EphmatchForm from "./EphmatchForm";

// Redux/routing imports
import { connect } from "react-redux";
import { getWSO } from "../../../selectors/auth";
import { doUpdateUser } from "../../../actions/auth";
import { actions } from "redux-router5";

const EphmatchProfile = ({ wso, navigateTo }) => {
  const [profile, updateProfile] = useState(null);
  const [description, updateDescription] = useState("");
  const [matchMessage, updateMatchMessage] = useState("");
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
        }
      } catch {
        // eslint-disable-next-line no-empty
      }
    };

    loadEphmatchProfile();

    return () => {
      isMounted = false;
    };
  }, [wso]);

  const submitHandler = async (event) => {
    event.preventDefault();

    const newErrors = [];
    const params = { description, matchMessage };

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
            updateDescription={updateDescription}
            updateMatchMessage={updateMatchMessage}
          >
            <Errors errors={errors} />
            <h3>Profile</h3>
            {profile && (
              <div className="ephmatch-sample-profile">
                <Ephmatcher
                  ephmatcherProfile={dummyEphmatchProfile}
                  ephmatcher={dummyEphmatcher}
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
  wso: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
};

EphmatchProfile.defaultProps = {};

const mapStateToProps = (state) => ({
  wso: getWSO(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location) => dispatch(actions.navigateTo(location)),
  updateUser: (updatedUser) => dispatch(doUpdateUser(updatedUser)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EphmatchProfile);
