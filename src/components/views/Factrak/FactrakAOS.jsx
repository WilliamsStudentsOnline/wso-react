// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getToken } from "../../../selectors/auth";

// External Imports
import { createRouteNodeSelector, actions } from "redux-router5";
import {
  getProfsOfAOS,
  getCoursesOfAOS,
  getAreaOfStudy,
} from "../../../api/factrak";
import { checkAndHandleError } from "../../../lib/general";

const FactrakAOS = ({ route, token }) => {
  const [courses, updateCourses] = useState([]);
  const [profs, updateProfs] = useState([]);
  const [area, updateArea] = useState({});

  // Equivalent to ComponentDidMount
  useEffect(() => {
    const areaParam = route.params.area;

    const loadProfs = async (areaID) => {
      const profsResponse = await getProfsOfAOS(token, areaID);
      if (checkAndHandleError(profsResponse)) {
        updateProfs(profsResponse.data.data);
      }
    };

    const loadCourses = async (areaID) => {
      const coursesResponse = await getCoursesOfAOS(token, areaID);
      if (checkAndHandleError(coursesResponse)) {
        const coursesData = coursesResponse.data.data;
        updateCourses(coursesData.sort((a, b) => a.number > b.number));
      }
    };

    const loadAOS = async (areaID) => {
      const areaOfStudyResponse = await getAreaOfStudy(token, areaID);
      if (checkAndHandleError(areaOfStudyResponse)) {
        updateArea(areaOfStudyResponse.data.data);
      }
    };

    loadProfs(areaParam);
    loadCourses(areaParam);
    loadAOS(areaParam);
  }, [route.params.area, token]);

  return (
    <article className="factrak-home">
      <section className="margin-vertical-small">
        <h3>{area && area.name ? area.name : ""}</h3>
        {profs.length > 0 ? (
          <>
            <br />
            <h4>{`Professors in ${area && area.name ? area.name : ""}`}</h4>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Title</th>
                  <th className="unix-column">Unix</th>
                </tr>
              </thead>
              <tbody>
                {profs.map((prof) => (
                  <tr key={prof.id}>
                    <td>
                      <a href={`/factrak/professors/${prof.id}`}>{prof.name}</a>
                    </td>

                    <td>{prof.title}</td>
                    <td>{prof.unixID}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : null}
      </section>

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
            {courses.map((course) => (
              <tr key={course.id}>
                <td className="col-20">
                  <a href={`/factrak/courses/${course.id}`}>
                    {`${area.abbreviation} ${course.number}`}
                  </a>
                </td>
                <td className="col-80">
                  {course.professors &&
                    course.professors
                      .map((prof) => {
                        return (
                          <a
                            href={`/factrak/courses/${course.id}?prof=${prof.id}`}
                          >
                            {prof.name}
                          </a>
                        );
                      })
                      .reduce((prev, curr) => [prev, ", ", curr])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </article>
  );
};

FactrakAOS.propTypes = {
  route: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("factrak.areasOfStudy");

  return (state) => ({
    token: getToken(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FactrakAOS);
