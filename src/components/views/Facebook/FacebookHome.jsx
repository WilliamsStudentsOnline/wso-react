// React Imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Trakyak from "../../../assets/images/trakyak.png";

// Redux/ Router imports
import { connect } from "react-redux";
import { getToken } from "../../../selectors/auth";
import { createRouteNodeSelector } from "redux-router5";

// Additional Imports
import { getAllUsers } from "../../../api/users";
import { checkAndHandleError } from "../../../lib/general";
import { Link } from "react-router5";
import { userTypeStudent } from "../../../constants/general";

const FacebookHome = ({ token, route }) => {
  const [results, updateResults] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      if (!route.params.q) {
        updateResults([]);
        return;
      }

      const queryParams = {
        q: route.params.q,
        preload: ["dorm", "office"],
      };
      const resultsResponse = await getAllUsers(token, queryParams);

      if (checkAndHandleError(resultsResponse)) {
        updateResults(resultsResponse.data.data);
      } else updateResults([]);
    };

    loadUsers();
  }, [token, route.params.q]);

  // Generates the user's room
  const listUserRoom = (user) => {
    if (user.type === userTypeStudent && (user.dormVisible && user.dormRoom)) {
      return `${user.dormRoom.dorm.name} ${user.dormRoom.number}`;
    }
    if (user.type !== userTypeStudent && user.office) {
      return user.office.number;
    }
    return null;
  };

  // Displays results in a list view when there are too many results
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
                  <Link
                    routeName="facebook.users"
                    routeParams={{ userID: user.id }}
                  >
                    {user.name}
                  </Link>
                </td>
                <td>{user.unixID}</td>
                <td>{listUserRoom(user)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

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

  // Displays results in a grid view when there aren't too many results
  const GridView = () => {
    return (
      <div className="grid-wrap">
        {results.map((user) => {
          return (
            <aside key={user.id}>
              <div className="third">
                <div className="profile-photo">
                  <Link
                    routeName="facebook.users"
                    routeParams={{ userID: user.id }}
                  >
                    <img src={Trakyak} alt="avatar" />
                    {/* <img src={`/pic/${user.unixID}`} alt="avatar" /> */}
                  </Link>
                </div>
              </div>
              <div className="two-third">
                <h4>
                  <Link
                    routeName="facebook.users"
                    routeParams={{ userID: user.id }}
                  >
                    {user.name}
                  </Link>
                </h4>
                <ul>
                  {gridUnixID(user)}
                  {gridUserRoom(user)}
                </ul>
              </div>
            </aside>
          );
        })}
      </div>
    );
  };

  // Returns the results of the search
  const FacebookResults = () => {
    if (results.length === 0)
      return (
        <>
          <br />
          <h1 className="no-matches-found">No matches were found.</h1>
        </>
      );

    if (results.length > 10) return ListView();
    return GridView();
  };

  // This will act as a loading buffer
  if (!results) {
    return (
      <article className="facebook-results">
        <section>
          {" "}
          <br />
          <h1 className="no-matches-found">Loading...</h1>
        </section>
      </article>
    );
  }

  return (
    <article className="facebook-results">
      <section>{FacebookResults()}</section>
    </article>
  );
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
