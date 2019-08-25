// React Imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { getToken, getCurrUser } from "../../../selectors/auth";
import { getUser } from "../../../api/users";
import { checkAndHandleError } from "../../../lib/general";
import { createRouteNodeSelector } from "redux-router5";

import { Link } from "react-router5";

const FacebookUser = ({ currUser, token, route }) => {
  const [viewPerson, updateTarget] = useState(null);

  useEffect(() => {
    const loadTarget = async () => {
      if (!route.params.userID) {
        updateTarget(null);
        return;
      }

      const targetResponse = await getUser(token, route.params.userID);

      if (checkAndHandleError(targetResponse)) {
        updateTarget(targetResponse.data.data);
      } else updateTarget(null);
    };

    loadTarget();
  }, [token, route.params.userID]);

  const displayRoom = () => {
    if (
      viewPerson.type === "student" &&
      (viewPerson.dormVisible && viewPerson.dormRoom)
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
    return (
      <>
        <h5>Office:</h5>
        <h4>{viewPerson.office ? viewPerson.office.number : ""}</h4>
        <br />
      </>
    );
  };

  if (!viewPerson) return null;

  return (
    <article className="facebook-profile">
      <section>
        <aside className="picture">
          <img src={`/pic/${viewPerson.unixID}`} alt="avatar" />
        </aside>

        <aside className="info">
          <h3>
            {viewPerson.name}
            {currUser.id === viewPerson.id ? <span>&nbsp;(me)</span> : null}
          </h3>

          {viewPerson.type === "student" ? (
            <h5>Student</h5>
          ) : (
            <h5>
              {viewPerson.title ? viewPerson.title : null}
              <br />
              {viewPerson.department.name}
            </h5>
          )}

          {viewPerson.pronoun ? (
            <h5>{`Pronouns: ${viewPerson.pronoun}`}</h5>
          ) : null}

          <br />
          {viewPerson.unixID ? (
            <>
              <h5>Unix:</h5>
              <h4>{viewPerson.unixID}</h4>
              <br />
            </>
          ) : null}

          {(viewPerson.type === "student" || viewPerson.type === "alumni") &&
          viewPerson.tags ? (
            <>
              <h5>Tags:</h5>
              <ul>
                {viewPerson.tags.map((tag, index) => {
                  return (
                    <li className="view-tag" key={tag.name}>
                      <Link
                        routeName="facebook"
                        routeParams={{ q: tag.name.split(" ").join("+") }}
                      >
                        {tag.name}
                      </Link>
                      {index < viewPerson.tags.length - 1 ? (
                        <span>,&nbsp;</span>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
              <br />
            </>
          ) : null}

          {viewPerson.type === "student" ? (
            <>
              <h5>SU Box:</h5>
              <h4>{viewPerson.suBox || "None listed"}</h4>
              <br />
            </>
          ) : null}

          {displayRoom()}

          {viewPerson.homeVisible &&
          viewPerson.homeTown &&
          viewPerson.type === "student" ? (
            <>
              <h5>Hometown:</h5>
              <h4>
                {viewPerson.homeTown},{" "}
                {viewPerson.homeCountry === "United States"
                  ? viewPerson.homeState
                  : viewPerson.homeCountry}
              </h4>
            </>
          ) : null}
        </aside>
      </section>
    </article>
  );
};

FacebookUser.propTypes = {
  token: PropTypes.string.isRequired,
  route: PropTypes.object.isRequired,
  currUser: PropTypes.object.isRequired,
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

export default connect(mapStateToProps)(FacebookUser);
