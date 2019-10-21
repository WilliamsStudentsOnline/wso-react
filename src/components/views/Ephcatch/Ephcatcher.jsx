// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// External imports
import { checkAndHandleError } from "../../../lib/general";
import { getUserThumbPhoto } from "../../../api/users";

const Ephcatcher = ({ ephcatcher, selectEphcatcher, index, token }) => {
  const [userPhoto, updateUserPhoto] = useState(null);

  useEffect(() => {
    const loadPhoto = async () => {
      const photoResponse = await getUserThumbPhoto(token, ephcatcher.unixID);
      if (checkAndHandleError(photoResponse)) {
        updateUserPhoto(URL.createObjectURL(photoResponse.data));
      }
    };

    loadPhoto();
    // eslint-disable-next-line
  }, [token]);

  if (selectEphcatcher == null)
    return (
      <aside>
        <div className="third">
          <div className="profile-photo">
            <img src={userPhoto} alt="profile" />
          </div>
        </div>
        <div className="two-third">
          <h4>{ephcatcher.name}</h4>

          {ephcatcher.unixID && ephcatcher.email ? (
            <ul>
              <li className="list-headers">UNIX</li>
              <li className="list-contents">{ephcatcher.unixID}</li>
            </ul>
          ) : null}
        </div>
      </aside>
    );

  return (
    <aside
      key={ephcatcher.id}
      className={
        ephcatcher.liked
          ? "ephcatch-select-link ephcatch-selected"
          : "ephcatch-select-link"
      }
      onClick={(event) => selectEphcatcher(event, index)}
      role="presentation"
    >
      <div className="third">
        <div className="profile-photo">
          <img src={userPhoto} alt="profile" />
        </div>
      </div>
      <div className="two-thirds">
        <h4>{ephcatcher.name}</h4>
      </div>
    </aside>
  );
};

Ephcatcher.propTypes = {
  ephcatcher: PropTypes.object.isRequired,
  selectEphcatcher: PropTypes.func,
  index: PropTypes.number,
  token: PropTypes.string.isRequired,
};

Ephcatcher.defaultProps = {
  selectEphcatcher: null,
  index: 0,
};

export default Ephcatcher;
