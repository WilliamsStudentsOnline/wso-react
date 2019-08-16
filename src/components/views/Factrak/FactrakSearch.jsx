// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { getToken } from "../../../selectors/auth";

import { checkAndHandleError } from "../../../lib/general";
import { createRouteNodeSelector } from "redux-router5";

import { getProfessors, getCourses } from "../../../api/factrak";

import { Link } from "react-router5";

const FactrakSearch = ({ token, route }) => {
  const [profs, updateProfs] = useState(null);
  const [courses, updateCourses] = useState(null);

  useEffect(() => {
    const loadProfs = async () => {
      const queryParams = {
        q: route.params.q ? route.params.q : undefined,
      };
      const profsResponse = await getProfessors(token, queryParams);

      if (checkAndHandleError(profsResponse)) {
        updateProfs(profsResponse.data.data.sort((a, b) => a.name > b.name));
      } else updateProfs([]);
    };

    const loadCourses = async () => {
      const queryParams = {
        q: route.params.q ? route.params.q : undefined,
      };
      const coursesResponse = await getCourses(token, queryParams);
      if (checkAndHandleError(coursesResponse)) {
        updateCourses(
          coursesResponse.data.data.sort((a, b) => a.name > b.name)
        );
      } else updateCourses([]);
    };

    loadProfs();
    loadCourses();
  }, [token, route.params.q]);

  const professorDisplay = () => {
    if (!profs || profs.length === 0) return null;
    return (
      <section className="margin-vertical-small">
        <br />
        <h4>Professors</h4>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th className="unix-column">Unix</th>
              <th>Office</th>
            </tr>
          </thead>
          <tbody>
            {profs.map((prof) => {
              // Doesn't check for existence of professor in LDAP.
              return (
                <tr key={prof.name}>
                  <td>
                    <Link
                      routeName="factrak.professors"
                      routeParams={{ profID: prof.id }}
                    >
                      {prof.name}
                    </Link>
                  </td>
                  <td>{prof.unixID || ""}</td>
                  <td>{prof.room || ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    );
  };
  const courseDisplay = () => {
    if (!courses || courses.length === 0) return null;
    return (
      <section className="margin-vertical-small">
        <h4>Courses</h4>
        <table>
          <thead>
            <tr>
              <th className="col-20">Course</th>
              <th className="col-80">Professors</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => {
              return (
                <tr key={course.id}>
                  <td className="col-20">
                    <Link
                      routeName="factrak.courses"
                      routeParams={{ courseID: course.id }}
                    >
                      {course.name}
                    </Link>
                  </td>
                  <td className="col-80">
                    {course.professors.map((prof) => (
                      <Link
                        key={`${course.id}?prof=${prof.id}`}
                        routeName="factrak.courses.singleProf"
                        routeParams={{ courseID: course.id, profID: prof.id }}
                      >
                        {prof.name}
                      </Link>
                    ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    );
  };
  return (
    <article className="factrak-home">
      {professorDisplay()}
      {courseDisplay()}
    </article>
  );
};

FactrakSearch.propTypes = {
  token: PropTypes.string.isRequired,
  route: PropTypes.object.isRequired,
};

FactrakSearch.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("dormtrak.search");

  return (state) => ({
    token: getToken(state),
    ...routeNodeSelector(state),
  });
};

export default connect(mapStateToProps)(FactrakSearch);
