// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FactrakComment, { FactrakCommentSkeleton } from "./FactrakComment";
import FactrakRatings, { FactrakRatingsSkeleton } from "./FactrakRatings";
import FactrakDeficitMessage from "./FactrakUtils";
import { Line } from "../../Skeleton";

// Redux/ Routing imports
import { connect } from "react-redux";
import { getAPI, getCurrUser, getToken } from "../../../selectors/auth";
import { createRouteNodeSelector } from "redux-router5";

// Additional imports
import { containsScopes, scopes } from "../../../lib/general";
import { Link } from "react-router5";

const FactrakProfessor = ({ api, currUser, route, token }) => {
  const [professor, updateProfessor] = useState(null);
  const [department, updateDepartment] = useState(null);
  const [ratings, updateRatings] = useState(null);
  const [surveys, updateSurveys] = useState([]);

  // Equivalent to ComponentDidMount
  useEffect(() => {
    const professorParam = route.params.profID;

    const loadProfs = async (professorID) => {
      try {
        const professorResponse = await api.factrakService.getProfessor(
          professorID
        );
        const professorData = professorResponse.data;

        updateProfessor(professorData);
        const departmentResponse = await api.factrakService.getDepartment(
          professorData.departmentID
        );
        updateDepartment(departmentResponse.data);
      } catch {
        // eslint-disable-next-line no-empty
      }
    };

    const loadRatings = async (professorID) => {
      try {
        const ratingsResponse = await api.factrakService.getProfessorRatings(
          professorID
        );
        updateRatings(ratingsResponse.data);
      } catch {
        // eslint-disable-next-line no-empty
      }
    };

    const loadSurveys = async (professorID) => {
      const params = {
        professorID,
        preload: ["course"],
        populateAgreements: true,
        populateClientAgreement: true,
      };
      try {
        const surveysResponse = await api.factrakService.listSurveys(params);
        updateSurveys(surveysResponse.data);
      } catch {
        // eslint-disable-next-line no-empty
      }
    };

    loadProfs(professorParam);
    loadRatings(professorParam);
    loadSurveys(professorParam);
    if (containsScopes(token, [scopes.ScopeFactrakFull])) {
      loadSurveys(professorParam);
    } else {
      updateSurveys([...Array(10)].map((_, id) => ({ id })));
    }
  }, [api, route.params.professor, route.params.profID, token]);

  if (!professor)
    return (
      <article className="facebook-profile" id="fbprof">
        <section className="info">
          <h3>
            <Line width="20%" />
          </h3>
          <h5>
            <Line width="20%" />
            <br />
            <Line width="40%" />
          </h5>
          <br />
          <br />
          <Line width="20%" />
          <br />
          <FactrakRatingsSkeleton />
          <br />
          <h3>Comments</h3>
          <br />
          <FactrakDeficitMessage currUser={currUser} />
          <div id="factrak-comments-section">
            {[...Array(10)].map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={i}>
                <FactrakCommentSkeleton />
              </div>
            ))}
          </div>
        </section>
      </article>
    );

  return (
    <article className="facebook-profile" id="fbprof">
      <section className="info">
        <h3>{professor.name}</h3>

        <h5>
          {department ? department.name : ""}
          <br />
          {professor && professor.title && <span>{professor.title}</span>}
        </h5>
        <br />

        <br />
        <Link
          routeName="factrak.newSurvey"
          routeParams={{ profID: professor.id }}
        >
          Click here to review this professor
        </Link>
        <br />
        <br />
        <FactrakRatings ratings={ratings} />
        <br />
        <br />

        <h3>Comments</h3>
        <br />
        <FactrakDeficitMessage currUser={currUser} />
        <div id="factrak-comments-section">
          {surveys && surveys.length > 0
            ? surveys.map((survey) => {
                if (containsScopes(token, [scopes.ScopeFactrakFull])) {
                  return (
                    <FactrakComment
                      comment={survey}
                      showProf={false}
                      abridged={false}
                      key={survey.id}
                    />
                  );
                }

                return (
                  <FactrakComment
                    abridged={false}
                    showProf={false}
                    key={survey.id}
                  />
                );
              })
            : "No comments yet."}
        </div>
      </section>
    </article>
  );
};

FactrakProfessor.propTypes = {
  api: PropTypes.object.isRequired,
  currUser: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
};

FactrakProfessor.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("factrak.professors");

  return (state) => ({
    api: getAPI(state),
    currUser: getCurrUser(state),
    token: getToken(state),
    ...routeNodeSelector(state),
  });
};

export default connect(mapStateToProps)(FactrakProfessor);
