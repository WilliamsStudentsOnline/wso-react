// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
// import FactrakComment, { FactrakCommentSkeleton } from "./FactrakComment";
import { Line } from "../../Skeleton";
import Select from "../../Select";

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
  const [metric, updateMetric] = useState("avgWouldTakeAnother");
  const [ascending, updateAscending] = useState(false);

  // Map Ratings API names to listProfessors API metrics
  const metricSwitch = (key) => {
    switch (key) {
      case "avgApproachability":
        return "approachability";
      case "avgCourseWorkload":
        return "course_workload";
      case "avgLeadLecture":
        return "lead_lecture";
      case "avgOutsideHelpfulness":
        return "outside_helpfulness";
      case "avgPromoteDiscussion":
        return "promote_discussion";
      default:
        return "would_take_another";
    }
  };

  useEffect(() => {
    if (profs) {
      updateProfs(profs.reverse());
    }
  }, [ascending, profs]);

  useEffect(() => {
    const loadProfs = async () => {
      const params = {
        metric: metricSwitch(metric), // default metric
        ascending,
      };

      if (route.params.aos) {
        const aosID = route.params.aos;
        params.areaOfStudyID = aosID;
      }

      // Loads in professors and the ratings for each one
      try {
        updateProfs(null);
        const profRanked = await wso.factrakService.listProfessors(params);
        const profRankedData = profRanked.data;
        params.metric = metric;
        const withRanking = await Promise.all(
          profRankedData.map(async (prof) => {
            const ratingResponse = await wso.factrakService.getProfessorRatings(
              prof.id,
              params
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
        navigateTo("error", { error }, { replace: true });
      }
    };

    if (containsOneOfScopes(token, [scopes.ScopeFactrakFull])) {
      loadProfs();
    }
  }, [navigateTo, token, wso, route, metric]);

  // Generates a row containing the prof information.
  const generateProfRow = (prof) => {
    let rating = "";
    if (metric === "avgWouldTakeAnother") {
      rating = `${Math.round(prof.ratingResponseData[metric] * 100)}%`;
    } else {
      // Currently no API to retrieve the max value of the metric but
      // it's currently 7. Might need to change later
      rating = `${Math.round(
        ((prof.ratingResponseData[metric] + Number.EPSILON) * 100) / 100
      )} / 7`;
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
              <th> Name </th>
              <th>
                <Link
                  routeName="factrak.rankings"
                  routeParams={{
                    aos: route.params.aos,
                  }}
                  onClick={() => {
                    updateAscending(!ascending);
                  }}
                  style={{
                    color: "#FFFFFF",
                    fontWeight: "bold",
                  }}
                >
                  Average Ratings {ascending ? "▲" : "▼"}
                </Link>
              </th>
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
        <div
          className="added-sort"
          style={{
            float: "right",
          }}
        >
          <strong>Sort By:</strong>
          <Select
            onChange={(event) => {
              updateMetric(event.target.value);
            }}
            options={[
              "Approachability",
              "Course Workload",
              "Discussion Promotion",
              "Lecture Ability",
              "Outside Helpfulness",
              "Overall Recommendation",
            ]}
            value={metric}
            valueList={[
              "avgApproachability",
              "avgCourseWorkload",
              "avgLeadLecture",
              "avgOutsideHelpfulness",
              "avgPromoteDiscussion",
              "avgWouldTakeAnother",
            ]}
            style={{
              display: "inline",
              margin: "5px 0px 5px 20px",
              padding: "4px",
            }}
          />
        </div>
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
