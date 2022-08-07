// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Ephmatcher from "./Ephmatcher";
import EphmatchForm from "./EphmatchForm";

// Redux/routing imports
import { connect } from "react-redux";
import { getWSO, getAPIToken } from "../../../selectors/auth";
import { useNavigate } from "react-router-dom";
import { containsAllOfScopes, scopes } from "../../../lib/general";

// Page created to handle both opting in and out.
const EphmatchOptIn = ({ token, wso }) => {
  const navigateTo = useNavigate();

  // Note that this is different from Ephcatch
  const [optIn, updateOptIn] = useState(false);
  const [description, updateDescription] = useState("");
  const [userInfo, updateUserInfo] = useState(null);
  const [matchMessage, updateMatchMessage] = useState("");
  const [messagingPlatform, updateMessagingPlatform] = useState("NONE");
  const [messagingUsername, updateMessagingUsername] = useState("");
  const [lookingFor, updateLookingFor] = useState("NONE");
  const [unixID, updateUnixID] = useState("");

  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadUserInfo = async () => {
      try {
        const ownProfile = await wso.userService.getUser("me");
        if (isMounted) {
          updateUserInfo(ownProfile.data);
          updateUnixID(ownProfile.data.unixID);
        }
      } catch (error) {
        navigateTo("/error", { replace: true, state: { error } });
      }

      try {
        const ownEphmatchProfile = await wso.ephmatchService.getSelfProfile();
        if (isMounted) {
          updateDescription(ownEphmatchProfile.data.description);
          updateMatchMessage(ownEphmatchProfile.data.matchMessage);
          updateMessagingPlatform(
            ownEphmatchProfile.data.messagingPlatform
              ? ownEphmatchProfile.data.messagingPlatform
              : "NONE"
          );
          updateMessagingUsername(ownEphmatchProfile.data.messagingUsername);
          updateLookingFor(
            ownEphmatchProfile.data.lookingFor
              ? ownEphmatchProfile.data.lookingFor
              : "NONE"
          );
        }
      } catch (error) {
        if (error.errorCode === 404) {
          // This is expected if the user has no profile
        } else {
          navigateTo("/error", { replace: true, state: { error } });
        }
      }
    };

    loadUserInfo();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Wait until the api handler is updated before navigating!
  useEffect(() => {
    let isMounted = true;

    if (updated && isMounted) {
      // Update succeeded -> redirect them to main ephmatch page.
      navigateTo("/ephmatch");
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updated, wso]);

  const submitHandler = async (event) => {
    event.preventDefault();

    const params = {
      description,
      matchMessage,
      messagingPlatform,
      messagingUsername:
        messagingUsername === "NONE" ? null : messagingUsername,
      lookingFor,
    };

    try {
      await wso.ephmatchService.createSelfProfile(params);
      setUpdated(true);
    } catch (error) {
      // There shouldn't be any reason for the submission to be rejected.
      navigateTo("/error", { replace: true, state: { error } });
    }
  };

  if (
    containsAllOfScopes(token, [
      scopes.ScopeEphmatch,
      scopes.ScopeEphmatchMatches,
      scopes.ScopeEphmatchProfiles,
    ])
  ) {
    return (
      <div className="article">
        <section>
          <article>
            <br />
            <h1 className="no-matches-found">
              You are already opted into Ephmatch
            </h1>
          </article>
        </section>
      </div>
    );
  }

  const dummyEphmatchProfile = {
    id: 0,
    description,
    matchMessage,
    messagingPlatform,
    messagingUsername,
    lookingFor,
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
            messagingPlatform={messagingPlatform}
            messagingUsername={messagingUsername}
            lookingFor={lookingFor}
            updateDescription={updateDescription}
            updateMatchMessage={updateMatchMessage}
            updateMessagingPlatform={updateMessagingPlatform}
            updateMessagingUsername={updateMessagingUsername}
            updateLookingFor={updateLookingFor}
            unix={unixID}
          >
            <h3>Create your Ephmatch Profile</h3>
            <div className="ephmatch-sample-profile">
              <Ephmatcher
                ephmatcherProfile={dummyEphmatchProfile}
                ephmatcher={userInfo}
                matched
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
  token: PropTypes.string.isRequired,
  wso: PropTypes.object.isRequired,
};

EphmatchOptIn.defaultProps = {};

const mapStateToProps = (state) => ({
  token: getAPIToken(state),
  wso: getWSO(state),
});

export default connect(mapStateToProps)(EphmatchOptIn);
