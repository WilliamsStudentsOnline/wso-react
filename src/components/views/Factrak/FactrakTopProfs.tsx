// React imports
import React, { useState, useEffect } from "react";
// import FactrakComment, { FactrakCommentSkeleton } from "./FactrakComment";
import { Line } from "../../Skeleton";
import Select from "../../Select";

import FactrakDeficitMessage from "./FactrakUtils";

// Redux/Routing imports
import { useAppSelector } from "../../../lib/store";
import { getWSO, getCurrUser, getAPIToken } from "../../../lib/authSlice";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

// Additional imports
import { containsOneOfScopes, scopes } from "../../../lib/general";
import {
  ModelsFactrakSurveyAvgRatings,
  ModelsUser,
} from "wso-api-client/lib/services/types";

const FactrakTopProfs = () => {
  const currUser = useAppSelector(getCurrUser);
  const token = useAppSelector(getAPIToken);
  const wso = useAppSelector(getWSO);

  const navigateTo = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();

  const [profs, updateProfs] = useState<
    ModelsUser & { ratingResponseData: ModelsFactrakSurveyAvgRatings }[]
  >([]);
  const [metric, updateMetric] = useState("avgWouldTakeAnother");
  const [ascending, updateAscending] = useState(false);

  // Map Ratings API names to listProfessors API metrics
  const metricSwitch = (key: string) => {
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
  // TODO: Clean this up hack and change backend API
  useEffect(() => {
    const loadProfs = async () => {
      const queryParams = {
        metric: metricSwitch(metric) as
          | "approachability"
          | "course_workload"
          | "lead_lecture"
          | "outside_helpfulness"
          | "promote_discussion"
          | "would_take_another"
          | "course_stimulating", // default metric
        ascending,
        areaOfStudyID: params.aos ? parseInt(params.aos) : undefined,
      };

      // Loads in professors and the ratings for each one
      try {
        updateProfs([]);
        const profRanked = await wso.factrakService.listProfessors(queryParams);
        const profRankedData = profRanked.data;
        if (!profRankedData) {
          throw new Error("No ranked data returned");
        }
        queryParams.metric = metric as
          | "approachability"
          | "course_workload"
          | "lead_lecture"
          | "outside_helpfulness"
          | "promote_discussion"
          | "would_take_another"
          | "course_stimulating";
        const withRanking = await Promise.all(
          profRankedData.map(async (prof) => {
            if (!prof.id) {
              throw new Error("Missing prof ID");
            }
            const ratingResponse = await wso.factrakService.getProfessorRatings(
              prof.id,
              queryParams
            );
            const ratingResponseData = ratingResponse.data;
            if (!ratingResponseData) {
              throw new Error("Missing rating data");
            }
            return {
              ...prof,
              ratingResponseData,
            };
          })
        );
        updateProfs(withRanking);
      } catch (error) {
        navigateTo("/error", { replace: true, state: { error } });
      }
    };

    if (containsOneOfScopes(token, [scopes.ScopeFactrakFull])) {
      loadProfs();
    }
  }, [token, wso, params.aos, metric]);

  // Generates a row containing the prof information.
  const generateProfRow = (
    prof: ModelsUser & { ratingResponseData: ModelsFactrakSurveyAvgRatings }
  ) => {
    const index = metric as keyof ModelsFactrakSurveyAvgRatings;
    if (!prof.ratingResponseData[index]) {
      return null;
    }
    const val = prof.ratingResponseData[index] as number;
    let rating = "";
    if (metric === "avgWouldTakeAnother") {
      rating = `${Math.round(val * 100)}%`;
    } else {
      // Currently no API to retrieve the max value of the metric but
      // it's currently 7. Might need to change later
      rating = `${Math.round(((val + Number.EPSILON) * 100) / 100)} / 7`;
    }
    return (
      <tr key={prof.id}>
        <td>
          <Link to={`/factrak/professors/${prof.id}`}>{prof.name}</Link>
        </td>
        <td>{rating}</td>
        <td>
          <Link to={`/facebook/users/${prof.id}`}>{prof.unixID}</Link>
        </td>
      </tr>
    );
  };

  // Generate a skeleton of prof information
  const profSkeleton = (key: number) => (
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
                  to={`/factrak/rankings/${
                    params.aos ? params.aos : ""
                  }?${searchParams.toString()}`}
                  onClick={() => {
                    updateProfs(profs.reverse());
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
              // TODO: Update the URL to reflect the new metric
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

export default FactrakTopProfs;
