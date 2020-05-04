// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FactrakComment, { FactrakCommentSkeleton } from "./FactrakComment";
import FactrakDeficitMessage from "./FactrakUtils";
import FactrakRatings, { FactrakRatingsSkeleton } from "./FactrakRatings";
import { Line } from "../../Skeleton";

// Redux/ Router imports
import { connect } from "react-redux";
import { createRouteNodeSelector, actions } from "redux-router5";
import { getAPI, getCurrUser, getToken } from "../../../selectors/auth";

// Additional imports
import { containsScopes, scopes } from "../../../lib/general";
import { Link } from "react-router5";

const FactrakCourse = ({ api, currUser, route, token }) => {
  const [course, updateCourse] = useState(null);
  const [courseSurveys, updateSurveys] = useState(null);
  const [courseProfs, updateProfs] = useState([]);
  const [ratings, updateRatings] = useState(null);

  // TODO examine profID being -1
  useEffect(() => {
    const courseID = route.params.courseID;
    const profID = route.params.profID ? route.params.profID : -1;

    const loadCourse = async () => {
      try {
        const courseResponse = await api.factrakService.getCourse(courseID);
        updateCourse(courseResponse.data);
      } catch {
        // eslint-disable-next-line no-empty
      }
    };

    const loadSurveys = async () => {
      const queryParams = {
        preload: ["professor", "course"],
        courseID,
        populateAgreements: true,
        populateClientAgreement: true,
        professorID: profID > 0 ? profID : null,
      };

      try {
        const surveyResponse = await api.factrakService.listSurveys(
          queryParams
        );
        updateSurveys(surveyResponse.data);
      } catch {
        // eslint-disable-next-line no-empty
      }
    };

    const loadRatings = async () => {
      try {
        const ratingsResponse = await api.factrakService.getCourseRatings(
          profID,
          courseID
        );
        updateRatings(ratingsResponse.data);
      } catch {
        // eslint-disable-next-line no-empty
      }
    };

    const loadProfs = async () => {
      const params = { courseID };

      try {
        const profResponse = await api.factrakService.listProfessors(params);
        updateProfs(profResponse.data);
      } catch {
        // eslint-disable-next-line no-empty
      }
    };

    loadCourse();
    loadRatings(profID);
    if (containsScopes(token, [scopes.ScopeFactrakFull])) {
      loadSurveys();
    } else {
      updateSurveys([...Array(10)].map((_, id) => ({ id })));
    }

    loadProfs();
  }, [token, route.params.course, route.params.profID, route.params.courseID]);

  // Generates the list of professors who teach the course
  const professorList = () => {
    if (courseProfs.length === 0) return null;
    return (
      <div>
        View comments only for:
        <br />
        {course && course.id ? (
          courseProfs.map((prof) => (
            <React.Fragment key={prof.name}>
              <Link
                routeName="factrak.courses.singleProf"
                routeParams={{
                  courseID: course.id,
                  profID: prof.id,
                }}
              >
                {prof.name}
              </Link>
              &emsp;
            </React.Fragment>
          ))
        ) : (
          <Line width="50%" />
        )}
      </div>
    );
  };

  // Generates the factrak survey comments of the course
  const commentList = () => {
    if (!courseSurveys) {
      return [...Array(5)].map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={i}>
          <FactrakCommentSkeleton />
        </div>
      ));
    }

    return (
      <div className="factrak-prof-comments">
        {courseSurveys.length === 0
          ? "None yet."
          : courseSurveys.map((comment) => {
              if (containsScopes(token, [scopes.ScopeFactrakFull])) {
                return (
                  <FactrakComment
                    comment={comment}
                    abridged={false}
                    showProf
                    key={comment.id}
                  />
                );
              }

              return (
                <FactrakComment abridged={false} showProf key={comment.id} />
              );
            })}
      </div>
    );
  };

  const selectedProf = () => {
    if (route.params.profID === null || route.params.profID === -1) return null;

    const prof = courseProfs.find(
      (courseProf) => courseProf.id === route.params.profID
    );

    if (!prof) {
      return (
        <>
          <br />
          {containsScopes(token, [scopes.ScopeFactrakFull]) && (
            <h4>
              <u>Average Course Ratings</u>
            </h4>
          )}
          <br />
          {ratings ? (
            <FactrakRatings ratings={ratings} general />
          ) : (
            <FactrakRatingsSkeleton />
          )}
        </>
      );
    }
    return (
      <>
        <br />
        {containsScopes(token, [scopes.ScopeFactrakFull]) && (
          <h4>
            <u>Ratings for {prof.name} in this course</u>
          </h4>
        )}
        <br />
        <FactrakRatings ratings={ratings} />
      </>
    );
  };

  const courseTitle = () => {
    if (!course) return <Line width="20%" />;

    return `${course.areaOfStudy ? course.areaOfStudy.abbreviation : ""} ${
      course.number
    }`;
  };

  return (
    <article className="facebook-profile">
      <section className="info">
        <h3>{courseTitle()}</h3>
        <br />
        {professorList()}
        {selectedProf()}
        <br />
        <FactrakDeficitMessage currUser={currUser} />
        {commentList()}
      </section>
    </article>
  );
};

FactrakCourse.propTypes = {
  api: PropTypes.object.isRequired,
  currUser: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
};

FactrakCourse.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("factrak.courses");

  return (state) => ({
    api: getAPI(state),
    currUser: getCurrUser(state),
    token: getToken(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FactrakCourse);
