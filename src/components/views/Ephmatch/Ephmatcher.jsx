// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// External imports
import { checkAndHandleError } from "../../../lib/general";
import { getUserThumbPhoto } from "../../../api/users";

const Ephmatcher = ({ ephmatcher, selectEphmatcher, index, token }) => {
  const [userPhoto, updateUserPhoto] = useState(null);

  useEffect(() => {
    const loadPhoto = async () => {
      const photoResponse = await getUserThumbPhoto(token, ephmatcher.unixID);
      if (checkAndHandleError(photoResponse)) {
        updateUserPhoto(URL.createObjectURL(photoResponse.data));
      }
    };

    loadPhoto();
    // eslint-disable-next-line
  }, [token]);

  if (selectEphmatcher === null)
    return (
      <aside>
        <div className="third">
          <div className="profile-photo">
            <img src={userPhoto} alt="profile" />
          </div>
        </div>
        <div className="two-third">
          <h4>{ephmatcher.name}</h4>

          {ephmatcher.unixID && ephmatcher.email ? (
            <ul>
              <li className="list-headers">UNIX</li>
              <li className="list-contents">{ephmatcher.unixID}</li>
            </ul>
          ) : null}
        </div>
      </aside>
    );

  return (
    <aside
      key={ephmatcher.id}
      className={
        ephmatcher.liked
          ? "ephmatch-select-link ephmatch-selected"
          : "ephmatch-select-link"
      }
      onClick={(event) => selectEphmatcher(event, index)}
      role="presentation"
    >
      <div className="third">
        <div className="profile-photo">
          <img src={userPhoto} alt="profile" />
        </div>
      </div>
      <div className="two-thirds">
        <h4>{ephmatcher.name}</h4>
      </div>
    </aside>
  );
};

Ephmatcher.propTypes = {
  ephmatcher: PropTypes.object.isRequired,
  selectEphmatcher: PropTypes.func,
  index: PropTypes.number,
  token: PropTypes.string.isRequired,
};

Ephmatcher.defaultProps = {
  selectEphmatcher: null,
  index: 0,
};

export default Ephmatcher;
