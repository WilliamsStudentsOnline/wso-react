// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FactrakComment, { FactrakCommentSkeleton } from "../FactrakComment";
import FactrakRatings, { FactrakRatingsSkeleton } from "../FactrakRatings";
import FactrakDeficitMessage from "../FactrakUtils";
import { Line } from "../../common/Skeleton";

// Redux/ Routing imports
import { connect } from "react-redux";
import { getWSO, getCurrUser, getAPIToken } from "../../../selectors/auth";
import { actions, createRouteNodeSelector } from "redux-router5";

// Additional imports
import { containsOneOfScopes, scopes } from "../../../lib/general";
import { Link } from "react-router5";
import styles from "./FactrakProfessor.module.scss";

// Elastic Eui imports
import { EuiFlexGroup, EuiFlexItem } from "@elastic/eui";

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
      } catch {
        navigateTo("500");
      }
    };

    const loadRatings = async (professorID) => {
      try {
        const ratingsResponse = await wso.factrakService.getProfessorRatings(
          professorID
        );
        updateRatings(ratingsResponse.data);
      } catch {
        navigateTo("500");
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
      } catch {
        navigateTo("500");
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
        <section>
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
    <article className={styles.facebookProfile}>
      <EuiFlexGroup direction="column" alignItems="center">
        <EuiFlexItem>
          <EuiFlexGroup
            alignItems="spaceAround"
            className={styles.professorHeader}
          >
            <EuiFlexItem className={styles.circle}>
              <div className={styles.professorPhoto} />
            </EuiFlexItem>
            <EuiFlexItem className={styles.professorText}>
              <h3>{professor.name}</h3>

              <h5>
                <span>
                  {department?.name} - {professor?.title}
                </span>
                <br />
                <span>{professor?.unixID}@williams.edu</span>
              </h5>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
        <EuiFlexItem className={styles.ratingsBar}>
          <FactrakRatings ratings={ratings} />
        </EuiFlexItem>
        <EuiFlexItem>
          <Link
            routeName="factrak.newSurvey"
            routeParams={{ profID: professor.id }}
          >
            Write Review
          </Link>
        </EuiFlexItem>
        <EuiFlexItem>
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
        </EuiFlexItem>
      </EuiFlexGroup>
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
