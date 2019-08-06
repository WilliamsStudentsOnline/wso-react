// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getToken } from "../../../selectors/auth";

// External Imports
import { createRouteNodeSelector } from "redux-router5";
import {
  getProfsOfAOS,
  getCoursesOfAOS,
  getAreaOfStudy,
} from "../../../api/factrak";

const FactrakAOS = ({ route, token }) => {
  const [courses, updateCourses] = useState([]);
  const [profs, updateProfs] = useState([]);
  const [area, updateArea] = useState({});

  // Equivalent to ComponentDidMount
  useEffect(() => {
    const areaParam = route.params.area;

    const loadProfs = async (areaID) => {
      const profsData = await getProfsOfAOS(token, areaID);
      if (profsData) {
        updateProfs(profsData);
      } else {
        // @TODO: Error handling?
      }
    };

    const loadCourses = async (areaID) => {
      const coursesData = await getCoursesOfAOS(token, areaID);
      if (coursesData) {
        console.log(coursesData);
        updateCourses(coursesData.sort((a, b) => a.number > b.number));
      } else {
        // @TODO: Error handling?
      }
    };

    // @TODO: think deeper about whether you want this to be passed as props?
    const loadAOS = async (areaID) => {
      // @TODO: Error handling for invalid areaID?
      const areaOfStudy = await getAreaOfStudy(token, areaID);
      if (areaOfStudy) {
        updateArea(areaOfStudy);
      } else {
        // @TODO: Error handling?
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
                  {course.professors.map((prof) => {
                    return (
                      <a href={`/factrak/courses/${course.id}?prof=${prof.id}`}>
                        {prof.name}
                      </a>
                    );
                  })}
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
  const routeNodeSelector = createRouteNodeSelector("factrak");

  return (state) => ({
    token: getToken(state),
    ...routeNodeSelector(state),
  });
};

export default connect(mapStateToProps)(FactrakAOS);
