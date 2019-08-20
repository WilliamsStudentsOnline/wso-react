// React Imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { getToken } from "../../../selectors/auth";

import { getAllUsers } from "../../../api/users";
import { checkAndHandleError } from "../../../lib/general";
import { createRouteNodeSelector } from "redux-router5";

const FacebookHome = ({ token, route }) => {
  const [results, updateResults] = useState(null);

  useEffect(() => {
    const loadDorms = async () => {
      if (!route.params.q) {
        updateResults(null);
        return;
      }

      const queryParams = {
        q: route.params.q,
        preload: ["dorm", "office"],
      };
      const resultsResponse = await getAllUsers(token, queryParams);
      // console.log(resultsResponse);
      if (checkAndHandleError(resultsResponse)) {
        updateResults(resultsResponse.data.data);
      } else updateResults([]);
    };

    loadDorms();
  }, [token, route.params.q]);

  const ListView = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th className="unix-column">Unix</th>
            <th>Room/Office</th>
          </tr>
        </thead>
        <tbody>
          {results.map((user) => {
            return (
              <tr key={user.id}>
                <td>
                  <a href={`/facebook/users/${user.id}`}>{user.name}</a>
                </td>
                <td>{user.unixID}</td>
                <td>
                  {user.type === "student" &&
                  (user.dormVisible && user.dormRoom)
                    ? `${user.dormRoom.dorm.name} ${user.dormRoom.number}`
                    : ""}
                  {user.type !== "student" && user.office
                    ? user.office.number
                    : ""}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const GridView = () => {
    return (
      <div className="grid-wrap">
        {results.map((user) => {
          return (
            <aside key={user.id}>
              <div className="third">
                <div className="profile-photo">
                  <a href={`/facebook/users/${user.id}`}>
                    <img src={`/pic/${user.unixID}`} alt="avatar" />
                  </a>
                </div>
              </div>
              <div className="two-third">
                <h4>
                  <a href={`/facebook/users/${user.id}`}>{user.name}</a>
                </h4>
                <ul>
                  {user.unixID ? (
                    <>
                      <li className="list-headers">UNIX</li>
                      <li className="list-contents">{user.unixID}</li>
                    </>
                  ) : null}
                  {user.type === "student" &&
                  (user.dormVisible && user.dormRoom) ? (
                    <>
                      <li className="list-headers"> Room</li>
                      <li className="list-contents">
                        {user.dormRoom.dorm.name} {user.dormRoom.number}
                      </li>
                    </>
                  ) : null}
                  {user.type !== "student" && user.office ? (
                    <>
                      <li className="list-headers"> Office</li>
                      <li className="list-contents">{user.office.number}</li>
                    </>
                  ) : null}
                </ul>
              </div>
            </aside>
          );
        })}
      </div>
    );
  };

  const FacebookResults = () => {
    if (results.length > 6) return ListView();
    return GridView();
  };

  if (results) {
    return (
      <article className="facebook-results">
        <section>
          {results.length > 0 ? (
            FacebookResults()
          ) : (
            <>
              <br />
              <h1 className="no-matches-found">No matches were found.</h1>
            </>
          )}
        </section>
      </article>
    );
  }

  return null;
};

FacebookHome.propTypes = {
  token: PropTypes.string.isRequired,
  route: PropTypes.object.isRequired,
};

FacebookHome.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("facebook");

  return (state) => ({
    token: getToken(state),
    ...routeNodeSelector(state),
  });
};

export default connect(mapStateToProps)(FacebookHome);
