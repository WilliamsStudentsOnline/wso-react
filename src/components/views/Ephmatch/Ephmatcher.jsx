// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// External imports
import { checkAndHandleError } from "../../../lib/general";
import { getUserLargePhoto } from "../../../api/users";
import { ConnectedLink } from "react-router5";
import { IoMdPin } from "react-icons/io";

const Ephmatcher = ({
  ephmatcher,
  selectEphmatcher,
  index,
  token,
  ephmatcherProfile,
  photo,
}) => {
  const [userPhoto, updateUserPhoto] = useState(photo);

  useEffect(() => {
    const loadPhoto = async () => {
      const photoResponse = await getUserLargePhoto(token, ephmatcher.unixID);
      if (checkAndHandleError(photoResponse)) {
        updateUserPhoto(URL.createObjectURL(photoResponse.data));
      }
    };

    if (ephmatcher && !photo) loadPhoto();
    else if (photo) {
      updateUserPhoto(photo);
    }
    // eslint-disable-next-line
  }, [token, ephmatcher, photo]);

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
    let locEnding;
    if (ephmatcherProfile.locationCountry === "United States") {
      locEnding = ephmatcherProfile.locationState;
    } else if (ephmatcherProfile.locationState) {
      locEnding = `${ephmatcherProfile.locationState}, ${ephmatcherProfile.locationCountry}`;
    } else {
      locEnding = ephmatcherProfile.locationCountry;
    }
    return `${ephmatcherProfile.locationTown}, ${locEnding}`;
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
          {ephmatcherProfile.locationVisible && (
            <div style={{ color: "#aaa" }}>
              <IoMdPin /> {formatLocation()}
            </div>
          )}
          {ephmatcherProfile.description && (
            <div>{ephmatcherProfile.description}</div>
          )}
          {ephmatcherProfile.matchMessage && (
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
  ephmatcher: PropTypes.object,
  ephmatcherProfile: PropTypes.object.isRequired,
  selectEphmatcher: PropTypes.func,
  index: PropTypes.number,
  token: PropTypes.string.isRequired,
  photo: PropTypes.string,
};

Ephmatcher.defaultProps = {
  selectEphmatcher: null,
  index: 0,
  ephmatcher: {
    unixID: "Loading...",
  },
  photo: null,
};

export default Ephmatcher;
