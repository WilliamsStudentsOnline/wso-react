// React Imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

// External Imports
import { getCurrUser, getToken } from "../../../selectors/auth";
import { autocompleteTags } from "../../../api/autocomplete";
import { putCurrUserTags, getUser, patchCurrUser } from "../../../api/users";

import { actions } from "redux-router5";

import { checkAndHandleError } from "../../../lib/general";

const FacebookEdit = ({ token, currUser, navigateTo }) => {
  const [tags, updateTags] = useState([]);
  const [newTag, updateNewTag] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [pronoun, setPronoun] = useState(currUser.pronoun);
  const [visible, setVisible] = useState(currUser.visible);
  const [homeVisible, setHomeVisible] = useState(currUser.homeVisible);
  const [dormVisible, setDormVisible] = useState(currUser.dormVisible);
  const [offCycle, setOffCycle] = useState(currUser.offCycle);

  const [errors, updateErrors] = useState([]);

  // @TODO: Think of a better logic for this
  useEffect(() => {
    // We need to load tags because tag updating happens with each "Add Tag" button press.
    // Alternatively, this could be implemented as 1)
    const loadTags = async () => {
      const userResponse = await getUser(token);
      if (checkAndHandleError(userResponse)) {
        const currTags = userResponse.data.data.tags;

        const defaultTags = [];
        for (let i = 0; i < currTags.length; i += 1) {
          defaultTags.push(currTags[i].name);
        }

        updateTags(defaultTags);
      } else {
        updateErrors([userResponse.data.error.message]);
      }
    };

    loadTags();
  }, [token, currUser]);

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
    const updatedTags = Object.assign([], tags);
    if (newTag) {
      updatedTags.push(newTag);
    }

    updateUserTags(updatedTags);
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
              <tr key={suggestion}>
                <td>
                  <button
                    type="button"
                    className="autocomplete-option"
                    onClick={() => {
                      setSuggestions(null);
                      updateNewTag(suggestion);
                    }}
                  >
                    {suggestion}
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
      setSuggestions(tagResponse.data.data);
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    addTagHandler();

    const updatedUser = {
      dormVisible,
      homeVisible,
      offCycle,
      pronoun,
      visible,
    };

    const updateResponse = await patchCurrUser(token, updatedUser);

    if (!checkAndHandleError(updateResponse)) {
      updateErrors([updateResponse.data.error.message, ...errors]);
    }

    if (errors.length === 0) {
      navigateTo("facebook.users", { userID: "me" });
    }
  };

  return (
    <article className="list-creation">
      <section>
        <div id="errors">
          {errors.length > 0
            ? errors.map((msg) => {
                return <p>{`* ${msg}`}</p>;
              })
            : null}
        </div>

        <form onSubmit={submitHandler}>
          <div className="field">
            <h3>Profile Picture</h3>
            <br />
            {/* TODO: picture uploading */}
            <input type="file" />
          </div>

          <br />
          <br />

          <div className="field">
            {currUser.type === "student" || currUser.type === "alumni" ? (
              <>
                <h3>Tags</h3>
                <p>
                  <strong>Note:&nbsp;</strong>
                  Only actual student groups (student organizations, music
                  groups, sports teams, etc.) can be added as tags. Don&#39;t
                  see your group? Contact us at wso-dev@wso.williams.edu
                </p>
                <ul id="tag-list">
                  {tags.map((tag, index) => (
                    <li className="fb-tag" key={tag}>
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTagHandler(index)}
                        style={{
                          display: "inline",
                          padding: 0,
                          margin: 0,
                          background: "#fff",
                          color: "#6F4933",
                          minWidth: 0,
                        }}
                      >
                        X
                      </button>
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

                    <button
                      type="button"
                      onClick={() => updateNewTag("")}
                      style={{
                        display: "inline",
                        padding: 0,
                        margin: 0,
                        background: "#fff",
                        color: "#6F4933",
                        minWidth: 0,
                      }}
                    >
                      X
                    </button>

                    {tagSuggestions()}
                  </li>

                  <li id="add-tag">
                    <button type="button" onClick={addTagHandler}>
                      Add Tag
                    </button>
                  </li>
                </ul>
                <br />
                <br />
              </>
            ) : null}
            <h3>Preferences</h3>
            Preselected values indicate current settings
            <br />
            <br />
            <strong>Facebook profile:</strong>
            <br />
            Show&nbsp;
            <input
              type="radio"
              checked={visible}
              onChange={() => setVisible(true)}
            />
            Hide&nbsp;
            <input
              type="radio"
              checked={!visible}
              onChange={() => setVisible(false)}
            />
            <br />
            <br />
            <strong>Home Address:</strong>
            <br />
            Show&nbsp;
            <input
              type="radio"
              checked={homeVisible}
              onChange={() => setHomeVisible(true)}
            />
            Hide&nbsp;
            <input
              type="radio"
              checked={!homeVisible}
              onChange={() => setHomeVisible(false)}
            />
            <br />
            <br />
            {currUser.type === "student" ? (
              <>
                <strong>Dorm Address:</strong>
                <br />
                Show&nbsp;
                <input
                  type="radio"
                  checked={dormVisible}
                  onChange={() => setDormVisible(true)}
                />
                Hide&nbsp;
                <input
                  type="radio"
                  checked={!dormVisible}
                  onChange={() => setDormVisible(false)}
                />
                <br />
                <br />
                <strong>Off Cycle:&nbsp;</strong>
                <input
                  type="checkbox"
                  value={offCycle}
                  onChange={() => setOffCycle(!offCycle)}
                />
                (Checking this box will subtract 0.5 from your class year.)
                <br />
                <br />
              </>
            ) : null}
            <strong>Pronouns:</strong>
            <input
              type="text"
              value={pronoun || ""}
              onChange={(event) => setPronoun(event.target.value)}
            />
            <br />
            <br />
            <input
              type="submit"
              value="Save changes"
              data-disable-with="Save changes"
            />
          </div>
        </form>
      </section>
    </article>
  );
};

FacebookEdit.propTypes = {
  token: PropTypes.string.isRequired,
  currUser: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
};

FacebookEdit.defaultProps = {};

const mapStateToProps = (state) => ({
  token: getToken(state),
  currUser: getCurrUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location) => dispatch(actions.navigateTo(location)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FacebookEdit);
