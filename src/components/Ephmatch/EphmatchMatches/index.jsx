// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux/routing imports
import { connect } from "react-redux";
import { getWSO } from "../../../selectors/auth";
import { actions } from "redux-router5";

// Additional imports
import styles from "./EphmatchMatches.module.scss";
import { userToNameWithClassYear } from "../../../lib/general";
import { Photo } from "../../common/Skeleton";
import { EuiButton, EuiIcon } from "@elastic/eui";
import { format } from "timeago.js";

const EphmatchMatch = ({
  ephmatcher,
  ephmatcherProfile,
  lastModified,
  wso,
}) => {
  const [userPhoto, updateUserPhoto] = useState(null);

  useEffect(() => {
    const loadPhoto = async () => {
      try {
        const photoResponse = await wso.userService.getUserLargePhoto(
          ephmatcher.unixID
        );
        updateUserPhoto(URL.createObjectURL(photoResponse.data));
      } catch {
        // Handle it via the skeleton
      }
    };

    if (ephmatcher) loadPhoto();
    // eslint-disable-next-line
  }, [ephmatcher, wso]);

  const renderPhoto = () => {
    if (userPhoto)
      return <img src={userPhoto} className={styles.photo} alt="profile" />;

    return <Photo className={styles.photo} />;
  };

  const matchedTime = () => {
    if (lastModified === "") return null;

    return (
      <span className={styles.matchedTime}>
        matched {format(new Date(lastModified))}
      </span>
    );
  };

  const renderNameAndClassYear = () => {
    if (!ephmatcher) return null;
    return (
      <div className={styles.userName}>
        {userToNameWithClassYear(ephmatcher)} {matchedTime()}
      </div>
    );
  };

  const renderPronouns = () => {
    return <div className={styles.pronouns}>{ephmatcher?.pronoun}</div>;
  };

  const renderTags = () => {
    if (!ephmatcher?.tags) return null;

    return (
      <div className={styles.tags}>
        <EuiIcon type="tag" />
        {ephmatcher.tags.map(({ name }) => (
          <span>{name}</span>
        ))}
      </div>
    );
  };

  const renderDescription = () => {
    return (
      <div className={styles.description}>{ephmatcherProfile?.description}</div>
    );
  };

  const renderButtons = () => {
    return (
      <div>
        <EuiButton>Unmatch</EuiButton> <EuiButton fill> Full Profile</EuiButton>
      </div>
    );
  };

  return (
    <div className={styles.match}>
      {renderPhoto()}
      <div className={styles.profile}>
        {renderNameAndClassYear()}
        {renderPronouns()}
        {renderTags()}
        {renderDescription()}
        {renderButtons()}
      </div>
    </div>
  );
};

EphmatchMatch.propTypes = {
  ephmatcher: PropTypes.object.isRequired,
  ephmatcherProfile: PropTypes.object.isRequired,
  lastModified: PropTypes.string,
  wso: PropTypes.object.isRequired,
};

EphmatchMatch.defaultProps = { lastModified: "" };

const EphmatchMatches = ({ navigateTo, wso }) => {
  const [matches, updateMatches] = useState([]);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const ephmatchersResponse = await wso.ephmatchService.listMatches({
          preload: ["tags"],
        });
        updateMatches(ephmatchersResponse.data);
      } catch {
        navigateTo("500");
      }
    };

    loadMatches();
  }, [navigateTo, wso]);

  const renderMatches = () => {
    if (matches.length === 0)
      return <h1 className="no-matches-found">No matches.</h1>;

    return (
      <div className={styles.page}>
        <div className={styles.pageContent}>
          {matches.map((match) => (
            <EphmatchMatch
              ephmatcher={match.matchedUser}
              ephmatcherProfile={match.matchedUser.ephmatchProfile}
              key={match.id}
              lastModified={match.updatedAt ?? match.createdAt}
              wso={wso}
            />
          ))}
        </div>
      </div>
    );
  };

  return <article className="facebook-results">{renderMatches()}</article>;
};

EphmatchMatches.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  wso: PropTypes.object.isRequired,
};

EphmatchMatches.defaultProps = {};

const mapStateToProps = (state) => ({
  wso: getWSO(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EphmatchMatches);
