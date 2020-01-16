// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Ephmatcher from "./Ephmatcher";
import Errors from "../../Errors";

// Redux/routing imports
import { connect } from "react-redux";
import { getToken } from "../../../selectors/auth";
import { doUpdateUser } from "../../../actions/auth";
import { actions } from "redux-router5";
import { Link } from "react-router5";

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
  const [photo, updatePhoto] = useState(null);
  const [errors, updateErrors] = useState([]);

  useEffect(() => {
    let isMounted = true;
    // Check if there is an ephmatch profile for the user
    const loadEphmatchProfile = async () => {
      const ownProfile = await getSelfEphmatchProfile(token);
      if (checkAndHandleError(ownProfile) && isMounted) {
        updateProfile(ownProfile.data.data);
        updateDescription(ownProfile.data.data.description);
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

    const params = { description };

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
    updatePhoto(URL.createObjectURL(event.target.files[0]));
  };

  const dummyEphmatchProfile = {
    ...profile,
    description,
  };

  return (
    <div className="article">
      <section>
        <article>
          <p>
            Add a short description to your profile to help others know you
            better!
          </p>
          <br />
          <br />

          <form onSubmit={submitHandler}>
            <Errors errors={errors} />
            <h3>Profile</h3>
            <br />
            {profile && (
              <div style={{ width: "50%", margin: "auto" }}>
                <Ephmatcher
                  ephmatcherProfile={dummyEphmatchProfile}
                  ephmatcher={profile.user}
                  token={token}
                  photo={photo}
                />
              </div>
            )}
            <br />
            <br />
            <strong>Profile Picture:</strong>
            <br />
            <input type="file" onChange={handlePhotoUpload} />
            <br />
            <p>
              <strong>Profile Description:</strong>
              <input
                type="text"
                value={description || ""}
                onChange={(event) => updateDescription(event.target.value)}
              />
              <br />
              You may also edit other parts of your profile{" "}
              <Link routeName="facebook.edit">here</Link>.
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
