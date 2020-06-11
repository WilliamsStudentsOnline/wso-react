// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// External imports
import { ConnectedLink } from "react-router5";
import { IoMdPin, IoMdText } from "react-icons/io";
import { FaSnapchatGhost, FaInstagram } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import "../../stylesheets/Ephmatch.css";

const Ephmatcher = ({
  wso,
  ephmatcher,
  selectEphmatcher,
  index,
  ephmatcherProfile,
  photo,
  matched,
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
        // eslint-disable-next-line no-empty
      }
    };

    if (ephmatcher && !photo) loadPhoto();
    else if (photo) {
      updateUserPhoto(photo);
    }
    // eslint-disable-next-line
  }, [wso, ephmatcher, photo]);

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
        <div className="message-icon">
          <IoMdPin /> {locations.join(", ")}
        </div>
      );
    }

    return null;
  };

  const createMessageField = () => {
    let icon;
    let link;
    switch (ephmatcherProfile.messagingPlatform) {
      case "Phone":
        icon = <IoMdText className="message-icon" />;
        link = (
          <a href={`sms:${ephmatcherProfile.messagingUsername}`}>
            {ephmatcherProfile.messagingUsername}
          </a>
        );
        break;
      case "Snapchat":
        icon = <FaSnapchatGhost className="message-icon" />;
        link = (
          <a
            href={`https://www.snapchat.com/add/${ephmatcherProfile.messagingUsername}`}
          >
            {ephmatcherProfile.messagingUsername}
          </a>
        );
        break;
      case "Instagram":
        icon = <FaInstagram className="message-icon" />;
        link = (
          <a
            href={`https://www.instagram.com/${ephmatcherProfile.messagingUsername}`}
          >
            {ephmatcherProfile.messagingUsername}
          </a>
        );
        break;
      default:
        icon = "";
        link = "";
    }

    if (
      !ephmatcherProfile.messagingPlatform ||
      !ephmatcherProfile.messagingUsername ||
      !link
    ) {
      icon = <MdEmail className="message-icon" />;
      link = (
        <a href={`mailto:${ephmatcher.unixID}@williams.edu`}>
          {ephmatcher.unixID}@williams.edu
        </a>
      );
    }

    return (
      <div>
        {icon} {link}
      </div>
    );
  };

  return (
    <aside
      key={ephmatcherProfile.id}
      className={
        ephmatcherProfile.liked
          ? "ephmatch-selected ephmatch-select-link"
          : "ephmatch-select-link"
      }
      onClick={
        selectEphmatcher ? (event) => selectEphmatcher(event, index) : null
      }
      role="presentation"
    >
      {userPhoto && (
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
      )}
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
          {ephmatcherProfile.locationVisible && formatLocation()}
          {matched && createMessageField()}
          {ephmatcherProfile.description && (
            <div>{ephmatcherProfile.description}</div>
          )}
          {matched && ephmatcherProfile.matchMessage && (
            <div className="match-message">
              {ephmatcherProfile.matchMessage}
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

Ephmatcher.propTypes = {
  wso: PropTypes.object.isRequired,
  ephmatcher: PropTypes.object,
  ephmatcherProfile: PropTypes.object.isRequired,
  selectEphmatcher: PropTypes.func,
  index: PropTypes.number,
  photo: PropTypes.string,
  matched: PropTypes.bool,
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
