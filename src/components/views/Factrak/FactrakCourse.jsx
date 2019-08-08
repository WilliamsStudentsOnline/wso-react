// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FactrakComment from "./FactrakComment";

// Redux imports
import { connect } from "react-redux";
import { getToken } from "../../../selectors/auth";

// API imports
import {
  getCourse,
  getCourseSurveys,
  getCourseProfs,
} from "../../../api/factrak";
import { createRouteNodeSelector } from "redux-router5";

const FactrakCourse = ({ route, token }) => {
  const [course, updateCourse] = useState({});
  const [courseSurveys, updateSurveys] = useState([]);
  const [courseProfs, updateProfs] = useState([]);

  // Equivalent to ComponentDidMount
  useEffect(() => {
    const courseID = route.params.course;

    const loadCourse = async () => {
      const courseResponse = await getCourse(token, courseID);
      if (courseResponse.status === 200) {
        updateCourse(courseResponse.data.data);
      } else {
        // @TODO: Error handling?
      }
    };

    const loadSurveys = async () => {
      const surveyResponse = await getCourseSurveys(token, courseID);
      if (surveyResponse.status === 200) {
        updateSurveys(surveyResponse.data.data);
      } else {
        // @TODO: Error handling?
      }
    };

    const loadProfs = async () => {
      const profResponse = await getCourseProfs(token, courseID);
      if (profResponse.status === 200) {
        updateProfs(profResponse.data.data);
      } else {
        // @TODO: Error handling?
      }
    };

    loadCourse();
    loadSurveys();
    loadProfs();
  }, [token, route.params.course]);

  const professorList = () => {
    if (courseProfs.length === 0) return null;
    return (
      <div>
        {`View comments only for `}
        <br />
        {courseProfs.map((prof) => (
          <a
            key={prof.name}
            href={`/factrak/courses/${course.id}?prof=${prof.id}`}
          >
            {prof.name}
          </a>
        ))}
      </div>
    );
  };

  const commentList = () => {
    if (courseSurveys.length === 0) return null;
    return (
      <div className="factrak-prof-comments">
        {courseSurveys.length === 0
          ? "None yet."
          : courseSurveys.map((comment) => (
              <FactrakComment
                comment={comment}
                abridged={false}
                showProf
                key={comment.id}
              />
            ))}
      </div>
    );
  };

  // Original rails has additional code that never seem to run.
  return (
    <article className="facebook-profile">
      <section className="info">
        <h3>
          {`${course.areaOfStudy ? course.areaOfStudy.abbreviation : ""} ${
            course.number
          }`}
        </h3>
        <br />
        {professorList()}
        <br />
        {commentList()}
      </section>
    </article>
  );
};

FactrakCourse.propTypes = {
  token: PropTypes.string.isRequired,
  route: PropTypes.object.isRequired,
};

FactrakCourse.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("factrak.courses");

  return (state) => ({
    token: getToken(state),
    ...routeNodeSelector(state),
  });
};

export default connect(mapStateToProps)(FactrakCourse);
