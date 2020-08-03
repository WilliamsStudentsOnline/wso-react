// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ContactField from "../Common/ContactField";
import { MaybePhoto } from "../../common/Skeleton";
import { InfoModal } from "../../common/Modal";
import Matched from "../../../assets/SVG/EphMatch1.svg";

// External imports
import { userToNameWithClassYear } from "../../../lib/general";
import styles from "./Ephmatcher.module.scss";
import {
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiGlobalToastList,
  EuiIcon,
  EuiSpacer,
  EuiButtonEmpty,
  EuiToolTip,
} from "@elastic/eui";
import { connect } from "react-redux";
import { getCurrUser } from "../../../selectors/auth";
import { Link } from "react-router5";

const Ephmatcher = ({
  currUser,
  ephmatcher,
  ephmatcherProfile,
  photo,
  wso,
}) => {
  const [userPhoto, setUserPhoto] = useState(photo);
  const [profile, setProfile] = useState(ephmatcherProfile);

  // Global state variables
  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadPhoto = async () => {
      try {
        const photoResponse = await wso.userService.getUserLargePhoto(
          ephmatcher.unixID
        );

        if (isMounted) {
          setUserPhoto(URL.createObjectURL(photoResponse.data));
        }
      } catch {
        // Handle it via the skeleton
      }
    };

    if (ephmatcher && !photo) loadPhoto();
    else if (photo) setUserPhoto(photo);

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line
  }, [ephmatcher, photo, wso]);

  const renderTags = (tags) => {
    if (!tags) return null;

    return (
      <div className={styles.tags}>
        <EuiIcon type="tag" />
        {tags.map(({ name }) => (
          <span key={name}>{name}</span>
        ))}
      </div>
    );
  };

  const renderDesciption = (description) => {
    if (!description) return null;

    return <div className={styles.description}>{description}</div>;
  };

  const removeToast = (removedToast) => {
    setToasts(toasts.filter((toast) => toast.id !== removedToast.id));
  };

  const renderButtons = () => {
    if (ephmatcher.unixID === currUser.unixID) {
      return (
        <EuiFlexGroup justifyContent="center">
          <EuiFlexItem grow={false}>
            <EuiButton fill>
              <Link routeName="ephmatch.settings">Edit</Link>
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      );
    }

    if (profile.liked) {
      const unmatchHandler = async () => {
        try {
          await wso.ephmatchService.unlikeProfile(ephmatcher.id);
          const updatedEphmatcher = await wso.ephmatchService.getProfile(
            ephmatcher.id
          );
          setProfile(updatedEphmatcher.data);
        } catch {
          setToasts([
            {
              title: `Unable to unlike ${profile.user.name}`,
              color: "danger",
              id: "Unable to unlike profile",
            },
          ]);
        }
      };

      return (
        <EuiFlexGroup justifyContent="center">
          <EuiFlexItem grow={false}>
            <EuiButtonEmpty onClick={unmatchHandler}>Unmatch</EuiButtonEmpty>
          </EuiFlexItem>
        </EuiFlexGroup>
      );
    }

    const matchHandler = async () => {
      try {
        await wso.ephmatchService.likeProfile(ephmatcher.id);
        const updatedEphmatcher = await wso.ephmatchService.getProfile(
          ephmatcher.id
        );
        setProfile(updatedEphmatcher.data);

        if (updatedEphmatcher.data.matched) {
          setModal(
            <InfoModal
              alt="Matched!"
              image={Matched}
              closeModal={() => setModal(null)}
              title="You two matched!"
            />
          );
        }
      } catch {
        setToasts([
          {
            title: `Unable to like ${profile.user.name}`,
            color: "danger",
            id: "Unable to Update Profile",
          },
        ]);
      }
    };

    return (
      <EuiFlexGroup justifyContent="center">
        <EuiFlexItem grow={false}>
          <EuiButton onClick={matchHandler} fill>
            Match
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    );
  };

  const renderMatchedFields = () => {
    if (ephmatcher.id === currUser.id && profile.matchMessage) {
      return (
        <EuiToolTip content="Only visible to your matches">
          <>
            <span className={styles.matchMessage}>{profile.matchMessage}</span>
            <ContactField
              ephmatcher={ephmatcher}
              ephmatcherProfile={ephmatcherProfile}
            />
          </>
        </EuiToolTip>
      );
    }

    if (profile.matched) {
      return (
        <>
          <span className={styles.matchMessage}>{profile.matchMessage}</span>
          <ContactField
            ephmatcher={ephmatcher}
            ephmatcherProfile={ephmatcherProfile}
          />
        </>
      );
    }

    return null;
  };

  const { pronoun } = ephmatcher;

  return (
    <div className={styles.ephmatcher}>
      <MaybePhoto photo={userPhoto} />
      <EuiSpacer size="l" />
      <div className={styles.name}>{userToNameWithClassYear(ephmatcher)}</div>
      <div className={styles.pronouns}>{pronoun}</div>
      {renderTags(ephmatcher?.tags)}
      {renderDesciption(ephmatcherProfile?.description)}
      <EuiSpacer />
      {renderMatchedFields()}
      {renderButtons()}
      <EuiGlobalToastList
        toasts={toasts}
        dismissToast={removeToast}
        toastLifeTimeMs={6000}
      />
      {modal}
    </div>
  );
};

Ephmatcher.propTypes = {
  currUser: PropTypes.object.isRequired,
  ephmatcher: PropTypes.object.isRequired,
  ephmatcherProfile: PropTypes.object.isRequired,
  photo: PropTypes.string,
  wso: PropTypes.object.isRequired,
};

Ephmatcher.defaultProps = {
  photo: null,
};

const mapStateToProps = (state) => ({
  currUser: getCurrUser(state),
});

export default connect(mapStateToProps)(Ephmatcher);
