// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// External imports
import { checkAndHandleError } from "../../../lib/general";
import { getUserThumbPhoto } from "../../../api/users";

import Trakyak from "../../../assets/images/trakyak.png";

const Ephmatcher = ({
  ephmatcher,
  selectEphmatcher,
  index,
  token,
  ephmatcherProfile,
}) => {
  const [userPhoto, updateUserPhoto] = useState(Trakyak);

  useEffect(() => {
    const loadPhoto = async () => {
      const photoResponse = await getUserThumbPhoto(token, ephmatcher.unixID);
      if (checkAndHandleError(photoResponse)) {
        updateUserPhoto(URL.createObjectURL(photoResponse.data));
      }
    };

    if (ephmatcher) loadPhoto();
    // eslint-disable-next-line
  }, [token]);

  // Generates the user's class year
  const classYear = (year, offCycle) => {
    if (!year) return null;
    if (offCycle) return `'${(year - 1) % 100}.5`;

    return `'${year % 100}`;
  };

  return (
    <aside
      key={ephmatcherProfile.id}
      className={
        ephmatcherProfile.liked
          ? "ephcatch-selected ephcatch-select-link"
          : "ephcatch-select-link"
      }
      onClick={
        selectEphmatcher ? (event) => selectEphmatcher(event, index) : null
      }
      role="presentation"
    >
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
      {ephmatcher && (
        <div style={{ flex: 2, padding: "10px", textAlign: "left" }}>
          <h4>{`${ephmatcher.name} ${classYear(
            ephmatcher.classYear,
            ephmatcher.offCycle
          )}`}</h4>
          {ephmatcher.unixID && (
            <span className="list-headers">{ephmatcher.unixID}</span>
          )}
          {ephmatcherProfile.description && (
            <div>{ephmatcherProfile.description}</div>
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
};

Ephmatcher.defaultProps = {
  selectEphmatcher: null,
  index: 0,
  ephmatcher: {
    unixID: "Loading...",
  },
};

export default Ephmatcher;
