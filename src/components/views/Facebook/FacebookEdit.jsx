// React Imports
import React, { useState, useEffect, createRef } from "react";
import PropTypes from "prop-types";
import Errors from "../../Errors";
import { CircularLoader } from "../../Skeleton";

// Redux/Routing imports
import { connect } from "react-redux";
import { getWSO, getCurrUser } from "../../../selectors/auth";
import { actions } from "redux-router5";
import { doUpdateUser } from "../../../actions/auth";

// Additional Imports
import { userTypeStudent, userTypeAlumni } from "../../../constants/general";
import TagEdit from "../../TagEdit";

const FacebookEdit = ({ currUser, navigateTo, updateUser, wso }) => {
  const [tags, updateTags] = useState([]);
  const [pronoun] = useState(currUser?.pronoun);
  const [visible, setVisible] = useState(currUser?.visible);
  const [homeVisible, setHomeVisible] = useState(currUser?.homeVisible);
  const [dormVisible, setDormVisible] = useState(currUser?.dormVisible);
  const [offCycle, setOffCycle] = useState(currUser?.offCycle);

  const [errors, updateErrors] = useState([]);
  const [submitting, updateSubmitting] = useState(false);

  const fileRef = createRef();

  useEffect(() => {
    // We need to load tags because tag updating happens with each "Add Tag" button press.
    const loadTags = async () => {
      try {
        const userResponse = await wso.userService.getUser("me");
        const currTags = userResponse.data.tags;
        if (currTags) updateTags(currTags.map((tag) => tag.name));
      } catch (error) {
        updateErrors([error.message]);
      }
    };

    // Necessary because the user might refresh into this page, and currUser might not have
    // been initialized.
    const loadUserInfo = async () => {};

    loadTags();
    loadUserInfo();
  }, [currUser, wso]);

  const submitHandler = async (event) => {
    event.preventDefault();

    const newErrors = [];
    updateSubmitting(true);

    try {
      // Update Photos
      if (fileRef.current?.files[0]) {
        await wso.userService.updateUserPhoto("me", fileRef.current.files[0]);
      }

      // Update User
      const updatedUser = {
        dormVisible,
        homeVisible,
        offCycle,
        visible,
      };

      const updateResponse = await wso.userService.updateUser(
        "me",
        updatedUser
      );

      updateUser(updateResponse.data);
      navigateTo("facebook.users", { userID: currUser.id }, { reload: true });
    } catch (error) {
      newErrors.push(error.message);
      updateErrors(newErrors);
    } finally {
      updateSubmitting(false);
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
            {(currUser?.type === userTypeAlumni ||
              currUser?.type === userTypeStudent) && (
              <>
                <h3>Tags</h3>
                <p>
                  <strong>Note:&nbsp;</strong>
                  Only actual student groups (student organizations, music
                  groups, sports teams, etc.) can be added as tags. Don&#39;t
                  see your group? Contact us at wso-dev@wso.williams.edu
                </p>
                <TagEdit
                  tags={tags}
                  updateTags={updateTags}
                  updateErrors={updateErrors}
                  wso={wso}
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
            <strong>Hometown:</strong>
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
            {currUser?.type === userTypeStudent ? (
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
                  checked={offCycle}
                  onChange={() => setOffCycle(!offCycle)}
                />
                (Checking this box will subtract 0.5 from your class year.)
                <br />
                <br />
              </>
            ) : null}
            <strong>Pronouns:</strong>
            <br />
            Change this by changing your pronouns in{" "}
            <a href="https://sarah.williams.edu">Peoplesoft</a>.
            <input type="text" value={pronoun || ""} disabled />
            <br />
            <br />
            {submitting ? (
              <CircularLoader diameter="40px" />
            ) : (
              <input type="submit" value="Save changes" />
            )}
          </div>
        </form>
      </section>
    </article>
  );
};

FacebookEdit.propTypes = {
  currUser: PropTypes.object,
  navigateTo: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  wso: PropTypes.object.isRequired,
};

FacebookEdit.defaultProps = {
  currUser: null,
};

const mapStateToProps = (state) => ({
  currUser: getCurrUser(state),
  wso: getWSO(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
  updateUser: (updatedUser) => dispatch(doUpdateUser(updatedUser)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FacebookEdit);
