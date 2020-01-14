// React Imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux/ Routing imports
import { connect } from "react-redux";
import { getToken, getCurrUser } from "../../../selectors/auth";
import { createRouteNodeSelector, actions } from "redux-router5";

// Additional Imports
import { getUser, getUserLargePhoto } from "../../../api/users";
import { checkAndHandleError } from "../../../lib/general";
import { ConnectedLink } from "react-router5";
import { userTypeStudent, userTypeAlumni } from "../../../constants/general";

const FacebookUser = ({ currUser, token, route, navigateTo }) => {
  const [viewPerson, updateTarget] = useState(null);
  const [userPhoto, updateUserPhoto] = useState(null);

  useEffect(() => {
    const loadTarget = async () => {
      if (!route.params.userID) {
        navigateTo("404");
        return;
      }

      const targetResponse = await getUser(token, route.params.userID);

      if (checkAndHandleError(targetResponse)) {
        updateTarget(targetResponse.data.data);
        const photoResponse = await getUserLargePhoto(
          token,
          targetResponse.data.data.unixID
        );
        if (checkAndHandleError(photoResponse)) {
          updateUserPhoto(URL.createObjectURL(photoResponse.data));
        }
      } else {
        navigateTo("404");
      }
    };

    loadTarget();
  }, [token, route.params.userID, navigateTo]);

  // Returns the room/ office information of the user.
  const userRoom = () => {
    if (
      viewPerson.type === userTypeStudent &&
      viewPerson.dormVisible &&
      viewPerson.dormRoom
    ) {
      return (
        <>
          <h5>Room:</h5>
          <h4>
            {viewPerson.dormRoom.dorm.name} {viewPerson.dormRoom.number}
          </h4>
          <br />
        </>
      );
    }

    if (viewPerson.office) {
      return (
        <>
          <h5>Office:</h5>
          <h4>{viewPerson.office.number}</h4>
          <br />
        </>
      );
    }
    return null;
  };

  if (!viewPerson) return null;

  // Generates user's title
  const userTitle = () => {
    if (viewPerson.type === userTypeStudent) {
      return <h5>Student</h5>;
    }
    if (viewPerson.title) {
      return (
        <h5>
          {viewPerson.title ? viewPerson.title : null}
          <br />
          {viewPerson.department.name}
        </h5>
      );
    }

    return null;
  };

  // Generates user's pronouns
  const userPronouns = () => {
    if (viewPerson.pronoun) {
      return <h5>{`Pronouns: ${viewPerson.pronoun}`}</h5>;
    }
    return null;
  };

  // Generate user's unix
  const userUnix = () => {
    if (viewPerson.unixID) {
      return (
        <>
          <h5>Unix:</h5>
          <h4>{viewPerson.unixID}</h4>
          <br />
        </>
      );
    }
    return null;
  };

  // Generate user's tags
  const userTags = () => {
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
                  {index < viewPerson.tags.length - 1 ? (
                    <span>,&nbsp;</span>
                  ) : null}
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
    if (viewPerson.type === userTypeStudent) {
      return (
        <>
          <h5>SU Box:</h5>
          <h4>{viewPerson.suBox || "None listed"}</h4>
          <br />
        </>
      );
    }
    return null;
  };

  // Generate user's hometown
  const userHometown = () => {
    if (
      viewPerson.homeVisible &&
      viewPerson.homeTown &&
      viewPerson.type === userTypeStudent
    ) {
      return (
        <>
          <h5>Hometown:</h5>
          <h4>
            {viewPerson.homeTown},&nbsp;
            {viewPerson.homeCountry === "United States"
              ? viewPerson.homeState
              : viewPerson.homeCountry}
          </h4>
        </>
      );
    }
    return null;
  };

  // Generates the user's class year
  const classYear = () => {
    if (!viewPerson.classYear || viewPerson.type !== userTypeStudent)
      return null;
    if (viewPerson.offCycle) return `'${(viewPerson.classYear - 1) % 100}.5`;

    return `'${viewPerson.classYear % 100}`;
  };

  return (
    <article className="facebook-profile">
      <section>
        <aside className="picture">
          <img src={userPhoto} alt="avatar" />
        </aside>

        <aside className="info">
          <h3>
            {viewPerson.name}&nbsp;{classYear()}
            {currUser && currUser.id === viewPerson.id ? (
              <span>&nbsp;(me)</span>
            ) : null}
          </h3>
          {userTitle()}
          {userPronouns()}
          <br />
          {userUnix()}
          {userTags()}
          {userSUBox()}
          {userRoom()}
          {userHometown()}
        </aside>
      </section>
    </article>
  );
};

FacebookUser.propTypes = {
  token: PropTypes.string.isRequired,
  route: PropTypes.object.isRequired,
  currUser: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
};

FacebookUser.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("facebook.users");

  return (state) => ({
    token: getToken(state),
    currUser: getCurrUser(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FacebookUser);
