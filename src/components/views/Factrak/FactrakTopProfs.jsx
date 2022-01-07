// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
// import FactrakComment, { FactrakCommentSkeleton } from "./FactrakComment";
import { Line } from "../../Skeleton";
import FactrakDeficitMessage from "./FactrakUtils";

// Redux imports
import { connect } from "react-redux";
import { getWSO, getCurrUser, getAPIToken } from "../../../selectors/auth";
import { createRouteNodeSelector, actions } from "redux-router5";

// Additional imports
import { containsOneOfScopes, scopes } from "../../../lib/general";
import { Link } from "react-router5";

const FactrakTopProfs = ({ currUser, navigateTo, token, wso, route }) => {
  const [profs, updateProfs] = useState(null);
  const [metric, updateMetric] = useState("");

  // db_metric names to professorRatings names
  const metricSwitch = (key) => {
    switch (key) {
      case "approachability":
        return "avgApproachability";
      case "course_workload":
        return "avgCourseWorkload";
      case "lead_lecture":
        return "avgLeadLecture";
      case "outside_helpfulness":
        return "avgOutsideHelpfulness";
      case "promote_discussion":
        return "avgPromoteDiscussion";
      default:
        return "avgWouldTakeAnother";
    }
  };

  useEffect(() => {
    const loadProfs = async () => {
      const params = {
        metric: "would_take_another", // default metric
      };
      updateMetric("avgWouldTakeAnother");

      if (route.params.aos) {
        const aosID = route.params.aos;
        params.areaOfStudyID = aosID;
      }

      if (route.params.sortBy) {
        params.metric = route.params.sortBy;
        updateMetric(metricSwitch(params.metric));
      }

      // Loads in professors and the ratings for each one
      try {
        const profRanked = await wso.factrakService.listProfessors(params);
        const profRankedData = profRanked.data;
        const withRanking = await Promise.all(
          profRankedData.map(async (prof) => {
            const ratingResponse = await wso.factrakService.getProfessorRatings(
              prof.id
            );
            const ratingResponseData = ratingResponse.data;
            return {
              ...prof,
              ratingResponseData,
            };
          })
        );
        updateProfs(withRanking);
      } catch (error) {
        navigateTo("error", { error });
      }
    };

    if (containsOneOfScopes(token, [scopes.ScopeFactrakFull])) {
      loadProfs();
    }
  }, [navigateTo, token, wso, route]);

  // Generates a row containing the prof information.
  const generateProfRow = (prof) => {
    let rating = "";
    if (metric === "avgWouldTakeAnother") {
      rating = `${Math.round(prof.ratingResponseData[metric] * 100)}%`;
    } else {
      rating = `${prof.ratingResponseData[metric]} / 7`;
    }
    return (
      <tr key={prof.id}>
        <td>
          <Link
            routeName="factrak.professors"
            routeParams={{ profID: prof.id }}
          >
            {prof.name}
          </Link>
        </td>
        <td>{rating}</td>
        <td>
          <a href={`mailto:${prof.unixID}@williams.edu`}>{prof.unixID}</a>
        </td>
      </tr>
    );
  };

  // Generate a skeleton of prof information
  const profSkeleton = (key) => (
    <tr key={key}>
      <td>
        <Line width="30%" />
      </td>
      <td>
        <Line width="80%" />
      </td>
      <td>
        <Line width="30%" />
      </td>
    </tr>
  );

  // Generates the component which holds the list of professors
  const generateProfs = () => {
    if (profs?.length === 0) return null;
    return (
      <>
        <br />
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Average Rating</th>
              <th className="unix-column">Unix</th>
            </tr>
          </thead>
          <tbody>
            {profs
              ? profs.map((prof) => generateProfRow(prof))
              : [...Array(5)].map((_, i) => profSkeleton(i))}
          </tbody>
        </table>
      </>
    );
  };

  return (
    <article className="main">
      <section className="margin-vertical-small">
        <h3>Top Professors</h3>
        <FactrakDeficitMessage currUser={currUser} />
        {generateProfs()}
      </section>
    </article>
  );
};

FactrakTopProfs.propTypes = {
  currUser: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  wso: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

FactrakTopProfs.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("factrak.rankings");

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

export default connect(mapStateToProps, mapDispatchToProps)(FactrakTopProfs);
