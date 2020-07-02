// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Photo } from "../../common/Skeleton";

// External imports
import { ConnectedLink } from "react-router5";
import { IoMdPin, IoMdText } from "react-icons/io";
import { FaSnapchatGhost, FaInstagram } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { messageIcon } from "./Ephmatcher.module.scss";

const Ephmatcher = ({
  ephmatcher,
  ephmatcherProfile,
  index,
  matched,
  photo,
  selectEphmatcher,
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

  // Generates the user's class year
  const classYear = (year, offCycle) => {
    if (!year) return null;
    if (offCycle) return `'${(year - 1) % 100}.5`;

    return `'${year % 100}`;
  };

  const userTags = () => {
    if (ephmatcher.tags) {
      return (
        <ul style={{ paddingLeft: 0, margin: 0 }}>
          {ephmatcher.tags.map((tag, i) => {
            return (
              <li className="view-tag" key={tag.name}>
                <ConnectedLink
                  routeName="facebook"
                  routeParams={{ q: `tag:"${tag.name}"` }}
                >
                  {tag.name}
                </ConnectedLink>
                {i < ephmatcher.tags.length - 1 && <span>,&nbsp;</span>}
              </li>
            );
          })}
        </ul>
      );
    }
    return null;
  };

  const formatLocation = () => {
    const { locationCountry, locationState, locationTown } = ephmatcherProfile;

    let locations;
    if (locationCountry === "United States") {
      locations = [locationTown, locationState];
    } else {
      locations = [locationTown, locationState, locationCountry];
    }

    locations = locations.filter((loc) => loc);

    if (locations.length > 0) {
      return (
        <div className={messageIcon}>
          <IoMdPin /> {locations.join(", ")}
        </div>
      );
    }

    return null;
  };

  const createMessageField = () => {
    const { messagingPlatform, messagingUsername } = ephmatcherProfile;
    const unixID = ephmatcher.unixID;

    let icon;
    let link;
    switch (messagingPlatform) {
      case "Phone":
        icon = <IoMdText className={messageIcon} />;
        link = <a href={`sms:${messagingUsername}`}>{messagingUsername}</a>;
        break;
      case "Snapchat":
        icon = <FaSnapchatGhost className={messageIcon} />;
        link = (
          <a href={`https://www.snapchat.com/add/${messagingUsername}`}>
            {messagingUsername}
          </a>
        );
        break;
      case "Instagram":
        icon = <FaInstagram className={messageIcon} />;
        link = (
          <a href={`https://www.instagram.com/${messagingUsername}`}>
            {messagingUsername}
          </a>
        );
        break;
      default:
        icon = "";
        link = "";
    }

    if (!messagingPlatform || !messagingUsername || !link) {
      icon = <MdEmail className={messageIcon} />;
      link = (
        <a href={`mailto:${unixID}@williams.edu`}>{unixID}@williams.edu</a>
      );
    }

    return (
      <div>
        {icon} {link}
      </div>
    );
  };

  const renderPhoto = () => {
    if (userPhoto)
      return (
        <div style={{ width: "100%" }}>
          <img
            src={userPhoto}
            style={{
              width: "100%",
              borderRadius: "10px 10px 0 0",
              height: "300px",
              objectFit: "cover",
            }}
            alt="profile"
          />
        </div>
      );

    return <Photo height="300px" width="100%" />;
  };

  const {
    description,
    id,
    liked,
    locationVisible,
    matchMessage,
  } = ephmatcherProfile;

  return (
    <aside
      key={id}
      className={
        liked
          ? "ephmatch-selected ephmatch-select-link"
          : "ephmatch-select-link"
      }
      onClick={
        selectEphmatcher ? (event) => selectEphmatcher(event, index) : null
      }
      role="presentation"
    >
      {renderPhoto()}
      {ephmatcher && (
        <div style={{ flex: 2, padding: "10px", textAlign: "left" }}>
          <h4>{`${ephmatcher.name} ${classYear(
            ephmatcher.classYear,
            ephmatcher.offCycle
          )}`}</h4>
          {ephmatcher.unixID && (
            <span className="list-headers">{ephmatcher.unixID}</span>
          )}
          {userTags()}
          {locationVisible && formatLocation()}
          {matched && createMessageField()}
          {description && <div>{description}</div>}
          {matched && matchMessage && (
            <div className="match-message">{matchMessage}</div>
          )}
        </div>
      )}
    </aside>
  );
};

Ephmatcher.propTypes = {
  ephmatcher: PropTypes.object,
  ephmatcherProfile: PropTypes.object.isRequired,
  selectEphmatcher: PropTypes.func,
  index: PropTypes.number,
  photo: PropTypes.string,
  matched: PropTypes.bool,
  wso: PropTypes.object.isRequired,
};

Ephmatcher.defaultProps = {
  selectEphmatcher: null,
  index: 0,
  ephmatcher: {
    unixID: "Loading...",
  },
  photo: null,
  matched: false,
};

export default Ephmatcher;
