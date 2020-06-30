// React Imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// External imports
import { Link } from "react-router5";

// Additional Imports
import { userTypeStudent } from "../../../constants/general";
import { EuiFlexItem, EuiFlexGroup, EuiSpacer } from "@elastic/eui";
import styles from "./FacebookGridUser.module.scss";

const FacebookGridUser = ({ wso, gridUser, gridUserClassYear }) => {
  const [userPhoto, updateUserPhoto] = useState(null);

  useEffect(() => {
    const loadPhoto = async () => {
      try {
        const photoResponse = await wso.userService.getUserLargePhoto(
          gridUser.unixID
        );
        updateUserPhoto(URL.createObjectURL(photoResponse.data));
      } catch (error) {
        // eslint-disable-next-line no-empty
      }
    };

    loadPhoto();
  }, [wso, gridUser.unixID]);

  // Generates the unix id field in grid view
  const gridUnixID = (user) => {
    if (user.unixID) {
      return (
        <>
          <li className="list-headers">UNIX: {user.unixID}</li>
          {/* <li className="list-contents">{user.unixID}</li> */}
        </>
      );
    }
    return null;
  };

  // Generates the user's room in grid view
  const gridUserRoom = (user) => {
    if (user.type === userTypeStudent && user.dormVisible && user.dormRoom) {
      return (
        <>
          <li className="list-headers">
            Room: {user.dormRoom.dorm.name} {user.dormRoom.number}
          </li>
          {/* <li className="list-contents">
            {user.dormRoom.dorm.name} {user.dormRoom.number}
          </li> */}
        </>
      );
    }
    if (user.type !== userTypeStudent && user.office) {
      return (
        <>
          <li className="list-headers"> Office: {user.office.number}</li>
          {/* <li className="list-contents">{user.office.number}</li> */}
        </>
      );
    }
    return null;
  };

  // Generates the user's hometown in grid view
  const gridUserHometown = (user) => {
    if (user.type === userTypeStudent && user.homeVisible && user.homeTown) {
      return (
        <>
          <li className="list-headers">
            Hometown: {user.homeTown},&nbsp;
            {user.homeCountry === "United States"
              ? user.homeState
              : user.homeCountry}
          </li>
        </>
      );
    }
    return null;
  };

  return (
    <EuiFlexGroup key={gridUser.id} className={styles.flexGroup}>
      <EuiFlexItem className={styles.third}>
        <div className="profile-photo">
          <Link
            routeName="facebook.users"
            routeParams={{ userID: gridUser.id }}
          >
            <img src={userPhoto} alt="avatar" />
          </Link>
        </div>
      </EuiFlexItem>
      <EuiFlexItem className={styles.twoThird}>
        <h4>
          <Link
            routeName="facebook.users"
            routeParams={{ userID: gridUser.id }}
          >
            {gridUser.name} {gridUserClassYear}
          </Link>
        </h4>
        <EuiSpacer size="s" />
        <ul>
          {gridUnixID(gridUser)}
          {gridUserRoom(gridUser)}
          {gridUserHometown(gridUser)}
        </ul>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};

FacebookGridUser.propTypes = {
  wso: PropTypes.object.isRequired,
  gridUser: PropTypes.object.isRequired,
  gridUserClassYear: PropTypes.string,
};

FacebookGridUser.defaultProps = {
  gridUserClassYear: "",
};

export default FacebookGridUser;
