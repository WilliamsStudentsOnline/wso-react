// React Imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Line, Photo } from "../../common/Skeleton";

// Redux/ Routing imports
import { connect } from "react-redux";
import { getWSO, getCurrUser } from "../../../selectors/auth";
import { createRouteNodeSelector, actions } from "redux-router5";

// Additional Imports
import { ConnectedLink } from "react-router5";
import { userTypeStudent, userTypeAlumni } from "../../../constants/general";
import { EuiButton, EuiFlexItem, EuiFlexGroup } from "@elastic/eui";
import styles from "./FacebookUser.module.scss";

const FacebookUser = ({ wso, currUser, route, navigateTo }) => {
  const [viewPerson, updateTarget] = useState(null);
  const [userPhoto, updateUserPhoto] = useState(undefined);

  useEffect(() => {
    const loadTarget = async () => {
      if (!route.params.userID) {
        navigateTo("404");
        return;
      }

      try {
        const targetResponse = await wso.userService.getUser(
          route.params.userID
        );
        updateTarget(targetResponse.data);
        const photoResponse = await wso.userService.getUserLargePhoto(
          targetResponse.data.unixID
        );

        updateUserPhoto(URL.createObjectURL(photoResponse.data));
      } catch {
        updateUserPhoto(null);
      }
    };

    loadTarget();
  }, [wso, route.params.userID, navigateTo]);

  // Returns the room/ office information of the user.
  const userRoom = () => {
    if (!viewPerson) {
      return (
        <>
          <h5>
            <Line width="10%" />
          </h5>
          <h6>
            <Line width="25%" />
          </h6>
          <br />
        </>
      );
    }
    if (
      viewPerson.type === userTypeStudent &&
      viewPerson.dormVisible &&
      viewPerson.dormRoom
    ) {
      return (
        <>
          <h5>Room:</h5>
          <h6>
            {viewPerson.dormRoom.dorm.name} {viewPerson.dormRoom.number}
          </h6>
          <br />
        </>
      );
    }

    if (viewPerson.office) {
      return (
        <>
          <h5>Office:</h5>
          <h6>{viewPerson.office.number}</h6>
          <br />
        </>
      );
    }
    return null;
  };

  // Generates user's title
  const userTitle = () => {
    if (!viewPerson) return <Line width="10%" />;

    if (viewPerson.type === userTypeStudent) {
      return <h2>Student</h2>;
    }
    if (viewPerson.title) {
      return (
        <>
          <h2>{viewPerson.title}</h2>
          <h6>{viewPerson.department && viewPerson.department.name}</h6>
        </>
      );
    }

    return null;
  };

  // Generates user's pronouns
  const userPronouns = () => {
    if (!viewPerson) {
      return (
        <h6>
          <Line width="30%" />
        </h6>
      );
    }

    if (viewPerson.pronoun) {
      return <h6>{`Pronouns: ${viewPerson.pronoun}`}</h6>;
    }
    return null;
  };

  // Generate user's unix
  const userUnix = () => {
    if (!viewPerson) {
      return (
        <>
          <h5>
            <Line width="10%" />
          </h5>
          <h6>
            <Line width="10%" />
          </h6>
          <br />
        </>
      );
    }

    if (viewPerson.unixID) {
      return (
        <>
          <h5>Unix:</h5>
          <h6>{viewPerson.unixID}</h6>
          <br />
        </>
      );
    }
    return null;
  };

  // Generate user's tags
  const userTags = () => {
    if (!viewPerson) {
      return (
        <>
          <h5>
            <Line width="10%" />
          </h5>
          <h6>
            <Line width="30%" />
          </h6>
          <br />
        </>
      );
    }

    if (
      (viewPerson.type === userTypeStudent ||
        viewPerson.type === userTypeAlumni) &&
      viewPerson.tags
    ) {
      return (
        <>
          <h5>Tags:</h5>
          <ul>
            {viewPerson.tags.map((tag, index) => {
              return (
                <li className="view-tag" key={tag.name}>
                  <ConnectedLink
                    routeName="facebook"
                    routeParams={{ q: `tag:"${tag.name}"` }}
                  >
                    {tag.name}
                  </ConnectedLink>
                  {index < viewPerson.tags.length - 1 && <span>,&nbsp;</span>}
                </li>
              );
            })}
          </ul>
          <br />
        </>
      );
    }
    return null;
  };

  // Generate user's su box
  const userSUBox = () => {
    if (!viewPerson) {
      return (
        <>
          <h5>
            <Line width="10%" />
          </h5>
          <h6>
            <Line width="25%" />
          </h6>
          <br />
        </>
      );
    }
    if (viewPerson.type === userTypeStudent) {
      return (
        <>
          <h5>SU Box:</h5>
          <h6>{viewPerson.suBox || "None listed"}</h6>
          <br />
        </>
      );
    }
    return null;
  };

  // Generate user's hometown
  const userHometown = () => {
    if (!viewPerson) {
      return (
        <>
          <h5>
            <Line width="20%" />
          </h5>
          <h6>
            <Line width="45%" />
          </h6>
          <br />
        </>
      );
    }
    if (
      viewPerson.homeVisible &&
      viewPerson.homeTown &&
      viewPerson.type === userTypeStudent
    ) {
      return (
        <>
          <h5>Hometown:</h5>
          <h6>
            {viewPerson.homeTown},&nbsp;
            {viewPerson.homeCountry === "United States"
              ? viewPerson.homeState
              : viewPerson.homeCountry}
          </h6>
        </>
      );
    }
    return null;
  };

  // Generates the user's class year
  const classYear = () => {
    if (!viewPerson.classYear || viewPerson.type !== userTypeStudent) return "";
    if (viewPerson.offCycle) return `'${(viewPerson.classYear - 1) % 100}.5`;

    return `'${viewPerson.classYear % 100}`;
  };

  const picture = () => {
    if (userPhoto === undefined) return <Photo />;

    return <img src={userPhoto} alt="avatar" />;
  };

  const nameAndYear = () => {
    if (viewPerson) {
      return `${viewPerson.name} ${classYear()}`;
    }

    return <Line width="40%" />;
  };

  if (currUser && viewPerson && currUser.id === viewPerson.id) {
    return (
      <article className={styles.facebookProfile}>
        <section>
          <EuiFlexGroup className={styles.flexGroupTop}>
            <EuiFlexItem grow={false}>
              <aside className={styles.title}>{userTitle()}</aside>
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiFlexGroup className={styles.flexGroupMiddle}>
            <EuiFlexItem grow={false}>
              <aside className={styles.picture}>{picture()}</aside>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <aside className={styles.info}>
                <h3>
                  {nameAndYear()}
                  {<span>&nbsp;(me)</span>}
                </h3>
                {userPronouns()}
                <br />
                {userUnix()}
                {userTags()}
                {userSUBox()}
                {userRoom()}
                {userHometown()}
              </aside>
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiFlexGroup className={styles.flexGroupBottom}>
            <EuiFlexItem grow={false}>
              <EuiButton
                fill
                href="../edit"
                style={{
                  backgroundColor: "#c6cbe1",
                  border: "#c6cbe1",
                  color: "#45528d",
                }}
              >
                Edit Profile
              </EuiButton>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiButton
                fill
                href="../../#"
                style={{
                  backgroundColor: "#45528d",
                  border: "#45528d",
                  color: "#dce0ef",
                }}
              >
                Log Out
              </EuiButton>
            </EuiFlexItem>
          </EuiFlexGroup>
        </section>
      </article>
    );
  }

  return (
    <article className={styles.facebookProfile}>
      <section>
        <EuiFlexGroup className={styles.flexGroupTop}>
          <EuiFlexItem grow={false}>
            <aside className={styles.title}>{userTitle()}</aside>
          </EuiFlexItem>
        </EuiFlexGroup>
        <div className={styles.flexGroupMiddleSearch}>
          <EuiFlexGroup className={styles.flexGroupMiddle}>
            <EuiFlexItem grow={false}>
              <aside className={styles.picture}>{picture()}</aside>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <aside className={styles.info}>
                <h3>{nameAndYear()}</h3>
                {userPronouns()}
                <br />
                {userUnix()}
                {userTags()}
                {userSUBox()}
                {userRoom()}
                {userHometown()}
              </aside>
            </EuiFlexItem>
          </EuiFlexGroup>
        </div>
      </section>
    </article>
  );
};

FacebookUser.propTypes = {
  wso: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  currUser: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
};

FacebookUser.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("facebook.users");

  return (state) => ({
    wso: getWSO(state),
    currUser: getCurrUser(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FacebookUser);
