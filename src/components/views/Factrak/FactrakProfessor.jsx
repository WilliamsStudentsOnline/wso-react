// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FactrakComment from "./FactrakComment";
import FactrakRatings from "./FactrakRatings";
import FactrakDeficitMessage from "./FactrakUtils";

// Redux/ Routing imports
import { connect } from "react-redux";
import { getToken, getCurrUser } from "../../../selectors/auth";
import { createRouteNodeSelector } from "redux-router5";

// Additional imports
import {
  getProfessor,
  getDepartment,
  getSurveys,
  getProfessorRatings,
} from "../../../api/factrak";
import {
  checkAndHandleError,
  containsScopes,
  scopes,
} from "../../../lib/general";
import { Link } from "react-router5";

const FactrakProfessor = ({ token, route, currUser }) => {
  const [professor, updateProfessor] = useState(null);
  const [department, updateDepartment] = useState(null);
  const [ratings, updateRatings] = useState(null);
  const [surveys, updateSurveys] = useState([]);

  // Equivalent to ComponentDidMount
  useEffect(() => {
    const professorParam = route.params.profID;

    const loadProfs = async (professorID) => {
      const professorResponse = await getProfessor(token, professorID);
      if (checkAndHandleError(professorResponse)) {
        const professorData = professorResponse.data.data;
        updateProfessor(professorData);
        const departmentResponse = await getDepartment(
          token,
          professorData.departmentID
        );
        if (checkAndHandleError(departmentResponse)) {
          updateDepartment(departmentResponse.data.data);
        }
      }
    };

    const loadRatings = async (professorID) => {
      const ratingsResponse = await getProfessorRatings(token, professorID);
      if (checkAndHandleError(ratingsResponse)) {
        updateRatings(ratingsResponse.data.data);
      }
    };

    const loadSurveys = async (professorID) => {
      const params = {
        professorID,
        preload: ["course"],
        populateAgreements: true,
        populateClientAgreement: true,
      };
      const surveysResponse = await getSurveys(token, params);
      if (checkAndHandleError(surveysResponse)) {
        updateSurveys(surveysResponse.data.data);
      }
    };

    loadProfs(professorParam);
    loadRatings(professorParam);
    loadSurveys(professorParam);
    if (containsScopes(token, [scopes.ScopeFactrakFull])) {
      loadSurveys(professorParam);
    } else {
      updateSurveys(
        [...Array(10)].map((_, id) => {
          return { id };
        })
      );
    }
  }, [route.params.professor, token, route.params.profID]);

  if (!professor) return null;

  return (
    <article className="facebook-profile" id="fbprof">
      <section className="info">
        <h3>{professor.name}</h3>

        <h5>
          {department ? department.name : ""}
          <br />
          {professor && professor.title ? <span>{professor.title}</span> : null}
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
  token: PropTypes.string.isRequired,
  route: PropTypes.object.isRequired,
  currUser: PropTypes.object.isRequired,
};

FactrakProfessor.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("factrak.professors");

  return (state) => ({
    token: getToken(state),
    currUser: getCurrUser(state),
    ...routeNodeSelector(state),
  });
};

export default connect(mapStateToProps)(FactrakProfessor);
