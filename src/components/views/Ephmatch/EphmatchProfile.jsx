// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Ephmatcher from "./Ephmatcher";
import Errors from "../../Errors";
import TagEdit from "../../TagEdit";
import EphmatchForm from "./EphmatchForm";

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
} from "../../../api/ephmatch";
import { putCurrUserPhoto } from "../../../api/users";

const EphmatchProfile = ({ token, navigateTo }) => {
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
      const ownProfile = await getSelfEphmatchProfile(token);
      if (checkAndHandleError(ownProfile) && isMounted) {
        const ephmatchProfile = ownProfile.data.data;

        updateProfile(ephmatchProfile);
        updateDescription(ephmatchProfile.description);
        updateTags(ephmatchProfile.user.tags.map((tag) => tag.name));
        updateMatchMessage(ephmatchProfile.matchMessage);
      }
    };

    loadEphmatchProfile();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const submitHandler = async (event) => {
    event.preventDefault();

    const newErrors = [];

    const params = { description, matchMessage };

    // Update the profile.
    const response = await updateEphmatchProfile(token, params);

    // Update Photos
    if (photo) {
      const fileResponse = await putCurrUserPhoto(token, photo);

      if (!checkAndHandleError(fileResponse)) {
        newErrors.push(fileResponse.data.error.message);
      }
    }

    // Update succeeded -> redirect them to main ephmatch page.
    if (checkAndHandleError(response)) {
      navigateTo("ephmatch");
    } else {
      newErrors.push(response.data.error.message);
    }

    updateErrors(newErrors);
  };

  const handlePhotoUpload = (event) => {
    updatePhoto(event.target.files[0]);
  };

  const dummyEphmatchProfile = {
    ...profile,
    description,
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
                  token={token}
                  photo={photo && URL.createObjectURL(photo)}
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
              token={token}
              tags={tags}
              updateTags={updateTags}
              updateErrors={updateErrors}
            />
            <br />
          </EphmatchForm>
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
