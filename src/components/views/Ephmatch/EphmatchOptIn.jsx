// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Ephmatcher from "./Ephmatcher";
import EphmatchForm from "./EphmatchForm";

// Redux/routing imports
import { connect } from "react-redux";
import { getWSO } from "../../../selectors/auth";
import { actions } from "redux-router5";

// Additional imports

// Page created to handle both opting in and out.
const EphmatchOptIn = ({ wso, navigateTo }) => {
  // Note that this is different from Ephcatch
  const [optIn, updateOptIn] = useState(null);
  const [description, updateDescription] = useState("");
  const [userInfo, updateUserInfo] = useState(null);
  const [matchMessage, updateMatchMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadUserInfo = async () => {
      try {
        const ownProfile = await wso.userService.getUser("me");
        if (isMounted) {
          updateUserInfo(ownProfile.data);
        }
      } catch {
        // eslint-disable-next-line no-empty
      }
    };

    loadUserInfo();

    return () => {
      isMounted = false;
    };
  }, [wso]);

  const submitHandler = async (event) => {
    event.preventDefault();

    const params = { description, matchMessage, gender: "" };

    try {
      await wso.ephmatchService.createEphmatchProfile(params);

      // Update succeeded -> redirect them to main ephmatch page.
      navigateTo("ephmatch", null, { reload: true });
    } catch {
      // eslint-disable-next-line no-empty
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
                wso={wso}
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
  wso: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
};

EphmatchOptIn.defaultProps = {};

const mapStateToProps = (state) => ({
  wso: getWSO(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EphmatchOptIn);
