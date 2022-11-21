// React Imports
import React, { useState, useEffect, createRef } from "react";
import Errors from "../../Errors";
import { CircularLoader } from "../../Skeleton";

// Redux/Routing imports
import { useAppSelector, useAppDispatch } from "../../../lib/store";
import { getCurrUser, getWSO, updateUser } from "../../../reducers/authSlice";
import { useNavigate } from "react-router-dom";

// Additional Imports
import { userTypeStudent, userTypeAlumni } from "../../../constants/general";
import TagEdit from "../../TagEdit";

const FacebookEdit = () => {
  const dispatch = useAppDispatch();
  const currUser = useAppSelector(getCurrUser);
  const wso = useAppSelector(getWSO);

  const navigateTo = useNavigate();

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
    // Prevent memory leak: Can't perform a React state update on an unmounted component
    let isMounted = true;

    // We need to load tags because tag updating happens with each "Add Tag" button press.
    const loadTags = async () => {
      try {
        const userResponse = await wso.userService.getUser("me");
        const currTags = userResponse.data.tags;
        if (isMounted && currTags) updateTags(currTags.map((tag) => tag.name));
      } catch (error) {
        updateErrors([error.message]);
      }
    };

    // Necessary because the user might refresh into this page, and currUser might not have
    // been initialized.
    const loadUserInfo = async () => {};

    loadTags();
    loadUserInfo();

    return () => {
      // during componentWillUnmount, untoggle the flag to prevent further state changes
      isMounted = false;
    };
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

      dispatch(updateUser(updateResponse.data));
      updateSubmitting(false); // should be placed before navigateTo, otherwise updating unmounted component
      navigateTo(`/facebook/users/${currUser.id}`);
    } catch (error) {
      newErrors.push(error.message);
      updateErrors(newErrors);
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

export default FacebookEdit;
