// React Imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// External imports
import { Link } from "react-router-dom";

// Additional Imports
import { userTypeStudent } from "../../../constants/general";
import { getWSO } from "../../../lib/authSlice";
import { useAppSelector } from "../../../lib/store";
import { ResponsesGetUserResponseUser } from "wso-api-client/lib/services/types";

const FacebookGridUser = ({
  gridUser,
  gridUserClassYear = "",
}: {
  gridUser: ResponsesGetUserResponseUser;
  gridUserClassYear: string;
}) => {
  const wso = useAppSelector(getWSO);
  const [userPhoto, updateUserPhoto] = useState<string | undefined>(undefined);

  useEffect(() => {
    const loadPhoto = async () => {
      try {
        if (gridUser.unixID) {
          const photoResponse = await wso.userService.getUserLargePhoto(
            gridUser.unixID
          );
          updateUserPhoto(URL.createObjectURL(photoResponse));
        }
      } catch (error) {
        // eslint-disable-next-line no-empty
      }
    };

    loadPhoto();
  }, [wso, gridUser.unixID]);

  // Generates the unix id field in grid view
  const gridUnixID = (user: ResponsesGetUserResponseUser) => {
    if (user.unixID) {
      return (
        <>
          <li className="list-headers">Williams Username</li>
          <li className="list-contents">{user.unixID}</li>
        </>
      );
    }
    return null;
  };

  // Generates the user's room in grid view
  const gridUserRoom = (user: ResponsesGetUserResponseUser) => {
    if (user.type === userTypeStudent && user.dormVisible && user.dormRoom) {
      return (
        <>
          <li className="list-headers"> Room</li>
          <li className="list-contents">
            {user.dormRoom?.dorm?.name} {user.dormRoom.number}
          </li>
        </>
      );
    }
    if (
      user.type === userTypeStudent &&
      (!user.dormVisible || !user.dormRoom) &&
      user.campusStatus
    ) {
      return (
        <>
          <li className="list-headers"> Campus Status</li>
          <li className="list-contents">{user.campusStatus}</li>
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
          <Link to={`/facebook/users/${gridUser.id}`}>
            <img src={userPhoto} alt="avatar" />
          </Link>
        </div>
      </div>
      <div className="two-third">
        <h4>
          <Link to={`/facebook/users/${gridUser.id}`}>
            {gridUser.name} {gridUserClassYear}
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

export default FacebookGridUser;
