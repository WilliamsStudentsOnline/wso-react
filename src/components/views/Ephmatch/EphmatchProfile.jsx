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
import { putCurrUserPhoto, putCurrUserTags } from "../../../api/users";
import { autocompleteTags } from "../../../api/autocomplete";

const EphmatchProfile = ({ token, navigateTo }) => {
  const [profile, updateProfile] = useState(null);
  const [description, updateDescription] = useState("");
  const [photo, updatePhoto] = useState(null);
  const [errors, updateErrors] = useState([]);
  const [tags, updateTags] = useState([]);
  const [newTag, updateNewTag] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    let isMounted = true;
    // Check if there is an ephmatch profile for the user
    const loadEphmatchProfile = async () => {
      const ownProfile = await getSelfEphmatchProfile(token);
      if (checkAndHandleError(ownProfile) && isMounted) {
        updateProfile(ownProfile.data.data);
        updateDescription(ownProfile.data.data.description);
        updateTags(ownProfile.data.data.user.tags.map((tag) => tag.name));
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

  // Unsure if this is the best way to implement this.
  const updateUserTags = async (updatedTags) => {
    const params = {
      tags: updatedTags,
    };

    const tagResponse = await putCurrUserTags(token, params);

    if (checkAndHandleError(tagResponse)) {
      updateTags(updatedTags);
      updateNewTag("");
      updateErrors([]);
    } else {
      updateErrors([tagResponse.data.error.message]);
    }
  };

  const addTagHandler = () => {
    if (newTag) {
      if (tags.filter((tag) => tag === newTag).length) {
        updateErrors(["Unable to add the same tag twice."]);
        return;
      }

      const updatedTags = Object.assign([], tags);
      updatedTags.push(newTag);
      updateUserTags(updatedTags);
    } else {
      updateErrors([]);
    }
  };

  const removeTagHandler = (index) => {
    const updatedTags = Object.assign([], tags);
    updatedTags.splice(index, 1);
    updateUserTags(updatedTags);
  };

  const tagSuggestions = () => {
    if (suggestions && suggestions.length > 0) {
      return (
        <table className="tag-suggestions">
          <tbody>
            {suggestions.map((suggestion) => (
              <tr key={suggestion.id}>
                <td>
                  <button
                    type="button"
                    className="autocomplete-option"
                    onClick={() => {
                      setSuggestions(null);
                      updateNewTag(suggestion.value);
                    }}
                  >
                    {suggestion.value}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    return null;
  };

  const tagAutocomplete = async (event) => {
    updateNewTag(event.target.value);
    const tagResponse = await autocompleteTags(token, event.target.value);
    if (checkAndHandleError(tagResponse)) {
      let newSuggestions = tagResponse.data.data;
      if (newSuggestions.length > 5) {
        newSuggestions = newSuggestions.slice(0, 5);
      }
      setSuggestions(newSuggestions);
    }
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

  const TagRemove = ({ onClick }) => {
    return (
      <button type="button" onClick={onClick} className="tag-remove">
        X
      </button>
    );
  };

  TagRemove.propTypes = { onClick: PropTypes.func.isRequired };

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
                  ephmatcher={dummyEphmatcher}
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
            <strong>Tags</strong>
            <p>
              <i>Note:&nbsp;</i>
              Only actual student groups (student organizations, music groups,
              sports teams, etc.) can be added as tags. Don&#39;t see your
              group? Contact us at wso-dev@wso.williams.edu
            </p>
            <ul id="tag-list">
              {tags.map((tag, i) => (
                <li className="fb-tag" key={tag}>
                  {tag}
                  <TagRemove onClick={() => removeTagHandler(i)} />
                </li>
              ))}

              <li className="fb-tag">
                <input
                  className="tag-input"
                  type="text"
                  onChange={tagAutocomplete}
                  placeholder="New Tag"
                  maxLength="255"
                  size="20"
                  value={newTag}
                />
                <TagRemove onClick={() => updateNewTag("")} />
                {tagSuggestions()}
              </li>

              <button type="button" onClick={addTagHandler}>
                Add Tag
              </button>
            </ul>
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
