// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { MaybePhoto } from "../../common/Skeleton";

// External imports
// import { ConnectedLink } from "react-router5";
// import { IoMdPin, IoMdText } from "react-icons/io";
// import { FaSnapchatGhost, FaInstagram } from "react-icons/fa";
// import { MdEmail } from "react-icons/md";
import { userToNameWithClassYear } from "../../../lib/general";
import styles from "./Ephmatcher.module.scss";
import {
  EuiButton,
  EuiIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
} from "@elastic/eui";
import { connect } from "react-redux";
import { getCurrUser } from "../../../selectors/auth";
import { Link } from "react-router5";

const Ephmatcher = ({
  currUser,
  ephmatcher,
  ephmatcherProfile,
  // matched,
  photo,
  // selectEphmatcher,
  wso,
}) => {
  const [userPhoto, updateUserPhoto] = useState(photo);

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

    if (ephmatcher && !photo) loadPhoto();
    else if (photo) {
      updateUserPhoto(photo);
    }
    // eslint-disable-next-line
  }, [ephmatcher, photo, wso]);

  // const formatLocation = () => {
  //   const { locationCountry, locationState, locationTown } = ephmatcherProfile;

  //   let locations;
  //   if (locationCountry === "United States") {
  //     locations = [locationTown, locationState];
  //   } else {
  //     locations = [locationTown, locationState, locationCountry];
  //   }

  //   locations = locations.filter((loc) => loc);

  //   if (locations.length > 0) {
  //     return (
  //       <div className={styles.messageIcon}>
  //         <IoMdPin /> {locations.join(", ")}
  //       </div>
  //     );
  //   }

  //   return null;
  // };

  // const createMessageField = () => {
  //   const { messagingPlatform, messagingUsername } = ephmatcherProfile;
  //   const unixID = ephmatcher.unixID;

  //   let icon;
  //   let link;
  //   switch (messagingPlatform) {
  //     case "Phone":
  //       icon = <IoMdText className={styles.messageIcon} />;
  //       link = <a href={`sms:${messagingUsername}`}>{messagingUsername}</a>;
  //       break;
  //     case "Snapchat":
  //       icon = <FaSnapchatGhost className={styles.messageIcon} />;
  //       link = (
  //         <a href={`https://www.snapchat.com/add/${messagingUsername}`}>
  //           {messagingUsername}
  //         </a>
  //       );
  //       break;
  //     case "Instagram":
  //       icon = <FaInstagram className={styles.messageIcon} />;
  //       link = (
  //         <a href={`https://www.instagram.com/${messagingUsername}`}>
  //           {messagingUsername}
  //         </a>
  //       );
  //       break;
  //     default:
  //       icon = "";
  //       link = "";
  //   }

  //   if (!messagingPlatform || !messagingUsername || !link) {
  //     icon = <MdEmail className={styles.messageIcon} />;
  //     link = (
  //       <a href={`mailto:${unixID}@williams.edu`}>{unixID}@williams.edu</a>
  //     );
  //   }

  //   return (
  //     <div>
  //       {icon} {link}
  //     </div>
  //   );
  // };

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

    return (
      <EuiFlexGroup justifyContent="center">
        <EuiFlexItem grow={false}>
          <EuiButton fill>Match</EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    );
  };

  const { pronoun } = ephmatcher;

  return (
    <div className={styles.ephmatcher}>
      <MaybePhoto photo={userPhoto} />
      <EuiSpacer size="l" />
      <div className={styles.name}>{userToNameWithClassYear(ephmatcher)}</div>
      <div className={styles.pronouns}>{pronoun}</div>
      {renderTags(ephmatcher?.tags)}

      {/* {locationVisible && formatLocation()}
      {matched && createMessageField()} */}
      {renderDesciption(ephmatcherProfile?.description)}
      {/* {matched && matchMessage && (
        <div className="match-message">{matchMessage}</div>
      )} */}
      {renderButtons()}
    </div>
  );
};

Ephmatcher.propTypes = {
  currUser: PropTypes.object.isRequired,
  ephmatcher: PropTypes.object,
  ephmatcherProfile: PropTypes.object,
  // selectEphmatcher: PropTypes.func,
  // index: PropTypes.number,
  photo: PropTypes.string,
  // matched: PropTypes.bool,
  wso: PropTypes.object.isRequired,
};

Ephmatcher.defaultProps = {
  // selectEphmatcher: null,
  // index: 0,
  ephmatcher: {
    unixID: "Loading...",
  },
  ephmatcherProfile: null,
  photo: null,
  // matched: false,
};

const mapStateToProps = (state) => ({
  currUser: getCurrUser(state),
});

export default connect(mapStateToProps)(Ephmatcher);
