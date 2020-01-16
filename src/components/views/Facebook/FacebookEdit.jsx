// React Imports
import React, { useState, useEffect, createRef } from "react";
import PropTypes from "prop-types";
import Errors from "../../Errors";

// Redux/Routing imports
import { connect } from "react-redux";
import { getCurrUser, getToken } from "../../../selectors/auth";
import { actions } from "redux-router5";
import { doUpdateUser } from "../../../actions/auth";

// Additional Imports
import { getUser, patchCurrUser, putCurrUserPhoto } from "../../../api/users";
import { checkAndHandleError } from "../../../lib/general";
import { userTypeStudent, userTypeAlumni } from "../../../constants/general";
import TagEdit from "../../TagEdit";

const FacebookEdit = ({ token, currUser, navigateTo, updateUser }) => {
  const [tags, updateTags] = useState([]);
  const [pronoun, setPronoun] = useState(currUser.pronoun);
  const [visible, setVisible] = useState(currUser.visible);
  const [homeVisible, setHomeVisible] = useState(currUser.homeVisible);
  const [dormVisible, setDormVisible] = useState(currUser.dormVisible);
  const [offCycle, setOffCycle] = useState(currUser.offCycle);

  const [errors, updateErrors] = useState([]);

  const fileRef = createRef();

  useEffect(() => {
    // We need to load tags because tag updating happens with each "Add Tag" button press.
    const loadTags = async () => {
      const userResponse = await getUser(token);
      if (checkAndHandleError(userResponse)) {
        const currTags = userResponse.data.data.tags;
        updateTags(currTags.map((tag) => tag.name));
      } else {
        updateErrors([userResponse.data.error.message]);
      }
    };

    loadTags();
  }, [token, currUser]);

  const submitHandler = async (event) => {
    event.preventDefault();

    const newErrors = [];

    // Update Photos
    if (fileRef.current && fileRef.current.files[0]) {
      const fileResponse = await putCurrUserPhoto(
        token,
        fileRef.current.files[0]
      );

      if (!checkAndHandleError(fileResponse)) {
        newErrors.push(fileResponse.data.error.message);
      }
    }

    // Update User
    const updatedUser = {
      dormVisible,
      homeVisible,
      offCycle,
      pronoun,
      visible,
    };

    const updateResponse = await patchCurrUser(token, updatedUser);

    if (!checkAndHandleError(updateResponse)) {
      newErrors.push(updateResponse.data.error.message);
    }

    if (newErrors.length > 0) {
      updateErrors(newErrors);
    } else {
      // If there are no errors, it means that patchCurrUser must have gone smoothly
      updateUser(updateResponse.data.data);
      navigateTo("facebook.users", { userID: currUser.id }, { reload: true });
    }
  };
  return (
    <article className="list-creation">
      <section>
        <Errors errors={errors} />

        <form onSubmit={submitHandler}>
          <div className="field">
            <h3>Profile Picture</h3>
            <br />
            <input type="file" ref={fileRef} />
          </div>

          <br />
          <br />

          <div className="field">
            {(currUser.type === userTypeAlumni ||
              currUser.type === userTypeStudent) && (
              <>
                <h3>Tags</h3>
                <p>
                  <strong>Note:&nbsp;</strong>
                  Only actual student groups (student organizations, music
                  groups, sports teams, etc.) can be added as tags. Don&#39;t
                  see your group? Contact us at wso-dev@wso.williams.edu
                </p>
                <TagEdit
                  token={token}
                  tags={tags}
                  updateTags={updateTags}
                  updateErrors={updateErrors}
                />
                <br />
                <br />
              </>
            )}
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
            {currUser.type === userTypeStudent ? (
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
  updateUser: PropTypes.func.isRequired,
};

FacebookEdit.defaultProps = {};

const mapStateToProps = (state) => ({
  token: getToken(state),
  currUser: getCurrUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
  updateUser: (updatedUser) => dispatch(doUpdateUser(updatedUser)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FacebookEdit);
