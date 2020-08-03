// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ContactField from "../Common/ContactField";
import { MaybePhoto } from "../../common/Skeleton";

// Redux/routing imports
import { connect } from "react-redux";
import { actions } from "redux-router5";
import { getWSO } from "../../../selectors/auth";

// Additional imports
import { EuiButtonEmpty, EuiGlobalToastList, EuiIcon } from "@elastic/eui";
import { format } from "timeago.js";
import styles from "./EphmatchMatches.module.scss";
import { userToNameWithClassYear } from "../../../lib/general";

const EphmatchMatch = ({
  ephmatcher,
  ephmatcherProfile,
  lastModified,
  loadMatches,
  setToasts,
  wso,
}) => {
  const [photo, updatePhoto] = useState(null);

  useEffect(() => {
    const loadPhoto = async () => {
      try {
        const photoResponse = await wso.userService.getUserLargePhoto(
          ephmatcher.unixID
        );
        updatePhoto(URL.createObjectURL(photoResponse.data));
      } catch {
        // Handle it via the skeleton
      }
    };

    if (ephmatcher) loadPhoto();
    // eslint-disable-next-line
  }, [ephmatcher, wso]);

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
          <span key={name}>{name}</span>
        ))}
      </div>
    );
  };

  const renderDescription = () => {
    return (
      <div className={styles.description}>{ephmatcherProfile?.description}</div>
    );
  };

  const clickHandler = async () => {
    try {
      await wso.ephmatchService.unlikeProfile(ephmatcher.id);
      loadMatches();
    } catch (error) {
      setToasts([
        {
          title: `Unable to unmatch with ${ephmatcher.name} right now!`,
          color: "danger",
        },
      ]);
    }
  };

  const renderButtons = () => {
    return (
      <div>
        <EuiButtonEmpty onClick={clickHandler}>Unmatch</EuiButtonEmpty>
      </div>
    );
  };

  const renderMatchMessage = () => {
    return (
      <>
        <span className={styles.matchMessage}>
          {ephmatcherProfile.matchMessage}
        </span>

        <ContactField
          ephmatcher={ephmatcher}
          ephmatcherProfile={ephmatcherProfile}
        />
      </>
    );
  };

  return (
    <div className={styles.match}>
      <MaybePhoto photo={photo} className={styles.photo} />
      <div className={styles.profile}>
        {renderNameAndClassYear()}
        {renderPronouns()}
        {renderTags()}
        {renderDescription()}

        {renderMatchMessage()}
        {renderButtons()}
      </div>
    </div>
  );
};

EphmatchMatch.propTypes = {
  ephmatcher: PropTypes.object.isRequired,
  ephmatcherProfile: PropTypes.object.isRequired,
  lastModified: PropTypes.string,
  loadMatches: PropTypes.func.isRequired,
  setToasts: PropTypes.func.isRequired,
  wso: PropTypes.object.isRequired,
};

EphmatchMatch.defaultProps = { lastModified: "" };

const EphmatchMatches = ({ navigateTo, wso }) => {
  const [matches, setMatches] = useState(null);

  // Global toasts
  const [toasts, setToasts] = useState([]);

  const loadMatches = async () => {
    try {
      const ephmatchersResponse = await wso.ephmatchService.listMatches({
        preload: ["tags"],
      });
      setMatches(ephmatchersResponse.data);
    } catch {
      navigateTo("500");
    }
  };

  useEffect(() => {
    loadMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigateTo, wso]);

  const removeToast = (removedToast) => {
    setToasts(toasts.filter((toast) => toast.id !== removedToast.id));
  };

  const renderMatches = () => {
    if (!matches) return <h1>Loading..</h1>;

    if (matches.length === 0) return <h1>No matches.</h1>;

    return matches.map((match) => (
      <EphmatchMatch
        ephmatcher={match.matchedUser}
        ephmatcherProfile={match.matchedUser.ephmatchProfile}
        key={match.id}
        lastModified={match.updatedAt ?? match.createdAt}
        loadMatches={loadMatches}
        setToasts={setToasts}
        wso={wso}
      />
    ));
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageContent}> {renderMatches()} </div>
      <EuiGlobalToastList
        toasts={toasts}
        dismissToast={removeToast}
        toastLifeTimeMs={6000}
      />
    </div>
  );
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
