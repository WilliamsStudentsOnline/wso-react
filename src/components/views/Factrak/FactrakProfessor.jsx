// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FactrakComment, { FactrakCommentSkeleton } from "./FactrakComment";
import FactrakRatings, { FactrakRatingsSkeleton } from "./FactrakRatings";
import FactrakDeficitMessage from "./FactrakUtils";
import { Line } from "../../Skeleton";

// Redux/ Routing imports
import { connect } from "react-redux";
import { getWSO, getCurrUser, getAPIToken } from "../../../selectors/auth";
import { actions, createRouteNodeSelector } from "redux-router5";

// Additional imports
import { containsOneOfScopes, scopes } from "../../../lib/general";
import { Link } from "react-router5";

const FactrakProfessor = ({ currUser, navigateTo, route, token, wso }) => {
  const [professor, updateProfessor] = useState(null);
  const [department, updateDepartment] = useState(null);
  const [ratings, updateRatings] = useState(null);
  const [surveys, updateSurveys] = useState([]);

  // Equivalent to ComponentDidMount
  useEffect(() => {
    const professorParam = route.params.profID;

    const loadProfs = async (professorID) => {
      try {
        const professorResponse = await wso.factrakService.getProfessor(
          professorID
        );
        const professorData = professorResponse.data;

        updateProfessor(professorData);
        const departmentResponse = await wso.factrakService.getDepartment(
          professorData.departmentID
        );
        updateDepartment(departmentResponse.data);
      } catch (error) {
        navigateTo("error", { error }, { replace: true });
      }
    };

    const loadRatings = async (professorID) => {
      try {
        const ratingsResponse = await wso.factrakService.getProfessorRatings(
          professorID
        );
        updateRatings(ratingsResponse.data);
      } catch (error) {
        if (error.errorCode === 1330) {
          // Do nothing - This should be expected if the user has not fulfilled the 2 surveys
        } else {
          navigateTo("error", { error }, { replace: true });
        }
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
        const surveysResponse = await wso.factrakService.listSurveys(params);
        updateSurveys(surveysResponse.data);
      } catch (error) {
        if (error.errorCode === 1330) {
          // Do nothing - This should be expected if the user has not fulfilled the 2 surveys
        } else {
          navigateTo("error", { error }, { replace: true });
        }
      }
    };

    loadProfs(professorParam);
    loadRatings(professorParam);
    loadSurveys(professorParam);
    if (containsOneOfScopes(token, [scopes.ScopeFactrakFull])) {
      loadSurveys(professorParam);
    } else {
      updateSurveys([...Array(10)].map((_, id) => ({ id })));
    }
  }, [navigateTo, route.params.professor, route.params.profID, token, wso]);

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
          {department?.name}
          <br />
          <span>{professor?.title}</span>
        </h5>
        <br />
        <Link
          routeName="factrak.newSurvey"
          routeParams={{ profID: professor.id }}
        >
          <button type="button">Click here to review this professor</button>
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
                if (containsOneOfScopes(token, [scopes.ScopeFactrakFull])) {
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
  currUser: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  route: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
  wso: PropTypes.object.isRequired,
};

FactrakProfessor.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("factrak.professors");

  return (state) => ({
    currUser: getCurrUser(state),
    token: getAPIToken(state),
    wso: getWSO(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FactrakProfessor);
