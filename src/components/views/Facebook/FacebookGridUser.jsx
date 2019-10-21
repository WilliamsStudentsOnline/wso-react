// React Imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// External imports
import { Link } from "react-router5";

// Additional Imports
import { userTypeStudent } from "../../../constants/general";
import { checkAndHandleError } from "../../../lib/general";
import { getUserLargePhoto } from "../../../api/users";

const FacebookGridUser = ({ gridUser, token }) => {
  const [userPhoto, updateUserPhoto] = useState(null);

  useEffect(() => {
    const loadPhoto = async () => {
      const photoResponse = await getUserLargePhoto(token, gridUser.unixID);
      if (checkAndHandleError(photoResponse)) {
        updateUserPhoto(URL.createObjectURL(photoResponse.data));
      }
    };

    if (token !== "") loadPhoto();
  }, [token, gridUser.unixID]);

  // Generates the unix id field in grid view
  const gridUnixID = (user) => {
    if (user.unixID) {
      return (
        <>
          <li className="list-headers">UNIX</li>
          <li className="list-contents">{user.unixID}</li>
        </>
      );
    }
    return null;
  };

  // Generates the user's room in grid view
  const gridUserRoom = (user) => {
    if (user.type === userTypeStudent && (user.dormVisible && user.dormRoom)) {
      return (
        <>
          <li className="list-headers"> Room</li>
          <li className="list-contents">
            {user.dormRoom.dorm.name} {user.dormRoom.number}
          </li>
        </>
      );
    }
    if (user.type !== userTypeStudent && user.office) {
      return (
        <>
          <li className="list-headers"> Office</li>
          <li className="list-contents">{user.office.number}</li>
        </>
      );
    }
    return null;
  };

  return (
    <aside key={gridUser.id}>
      <div className="third">
        <div className="profile-photo">
          <Link
            routeName="facebook.users"
            routeParams={{ userID: gridUser.id }}
          >
            <img src={userPhoto} alt="avatar" />
          </Link>
        </div>
      </div>
      <div className="two-third">
        <h4>
          <Link
            routeName="facebook.users"
            routeParams={{ userID: gridUser.id }}
          >
            {gridUser.name}
          </Link>
        </h4>
        <ul>
          {gridUnixID(gridUser)}
          {gridUserRoom(gridUser)}
        </ul>
      </div>
    </aside>
  );
};

FacebookGridUser.propTypes = {
  gridUser: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
};

export default FacebookGridUser;
