// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux/routing imports
import { connect } from "react-redux";
import { getWSO } from "../../../selectors/auth";
import { doUpdateUser } from "../../../actions/auth";
import { actions } from "redux-router5";

// External imports
import styles from "./EphmatchProfile.module.scss";
import Ephmatcher from "../Ephmatcher";

const EphmatchProfile = ({ navigateTo, wso }) => {
  const [profile, updateProfile] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadEphmatchProfile = async () => {
      try {
        const ownProfile = await wso.ephmatchService.getSelfProfile();

        if (isMounted) {
          updateProfile(ownProfile.data);
        }
      } catch {
        // There shouldn't be any reason for the submission to be rejected.
        navigateTo("500");
      }
    };

    loadEphmatchProfile();

    return () => {
      isMounted = false;
    };
  }, [navigateTo, wso]);

  return (
    <div className={styles.page}>
      <div className={styles.pageContent}>
        {profile && (
          <Ephmatcher
            ephmatcher={profile.user}
            ephmatcherProfile={profile}
            wso={wso}
          />
        )}
      </div>
    </div>
  );
};

EphmatchProfile.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  wso: PropTypes.object.isRequired,
};

EphmatchProfile.defaultProps = {};

const mapStateToProps = (state) => ({
  wso: getWSO(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
  updateUser: (updatedUser) => dispatch(doUpdateUser(updatedUser)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EphmatchProfile);
