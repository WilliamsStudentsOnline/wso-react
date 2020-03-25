// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Ephmatcher from "./Ephmatcher";
import EphmatchForm from "./EphmatchForm";

// Redux/routing imports
import { connect } from "react-redux";
import { getToken } from "../../../selectors/auth";
import { actions } from "redux-router5";

// Additional imports
import { checkAndHandleError } from "../../../lib/general";
import {
  createEphmatchProfile,
  getSelfEphmatchProfile,
} from "../../../api/ephmatch";
import { getUser } from "../../../api/users";

// Page created to handle both opting in and out.
const EphmatchOptIn = ({ token, navigateTo }) => {
  // Note that this is different from Ephcatch
  const [optIn, updateOptIn] = useState(null);
  const [description, updateDescription] = useState("");
  const [userInfo, updateUserInfo] = useState(null);
  const [matchMessage, updateMatchMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadUserInfo = async () => {
      const ownProfile = await getUser(token);
      if (checkAndHandleError(ownProfile) && isMounted) {
        updateUserInfo(ownProfile.data.data);
      }

      // Load ephmatch profile to see if one exists
      const ownEphmatchProfile = await getSelfEphmatchProfile(token);
      if (checkAndHandleError(ownEphmatchProfile) && isMounted) {
        const ephmatchProfile = ownEphmatchProfile.data.data;

        updateDescription(ephmatchProfile.description);
        updateMatchMessage(ephmatchProfile.matchMessage);
      }
    };

    loadUserInfo();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const submitHandler = async (event) => {
    event.preventDefault();

    const params = { description, matchMessage, gender: "" };
    const response = await createEphmatchProfile(token, params);

    // Update succeeded -> redirect them to main ephmatch page.
    if (checkAndHandleError(response)) {
      navigateTo("ephmatch", null, { reload: true });
    }
  };

  const dummyEphmatchProfile = {
    id: 0,
    description,
    matchMessage,
  };

  return (
    <div className="article">
      <section>
        <article>
          <p>
            Ephmatch is an exclusive feature for a limited time created to spark
            encounters between yourself and other Ephs. If you opt in, you will
            be able to see the profiles of other Ephs who have chosen to opt
            into the system. After opting in, you may choose to opt out at any
            time as well.
          </p>
          <br />
          <br />
          <EphmatchForm
            submitHandler={submitHandler}
            description={description}
            matchMessage={matchMessage}
            updateDescription={updateDescription}
            updateMatchMessage={updateMatchMessage}
          >
            <h3>Create your Ephmatch Profile</h3>
            <div className="ephmatch-sample-profile">
              <Ephmatcher
                ephmatcherProfile={dummyEphmatchProfile}
                ephmatcher={userInfo}
                token={token}
              />
            </div>
            <p>
              <input
                type="checkbox"
                onChange={(event) => updateOptIn(event.target.checked)}
                defaultChecked={optIn}
                required
              />
              <strong>I want to opt into Ephmatch.</strong>
            </p>
          </EphmatchForm>
        </article>
      </section>
    </div>
  );
};

EphmatchOptIn.propTypes = {
  token: PropTypes.string.isRequired,
  navigateTo: PropTypes.func.isRequired,
};

EphmatchOptIn.defaultProps = {};

const mapStateToProps = (state) => ({
  token: getToken(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EphmatchOptIn);
