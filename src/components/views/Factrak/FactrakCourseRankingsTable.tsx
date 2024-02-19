// React imports
import React, { useState, useEffect } from "react";
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
import { FactrakCourseMetric } from "wso-api-client/lib/services/factrak";
import { ModelsCourse } from "wso-api-client/lib/services/types";

const FactrakCourseRankingsTable = () => {
  const currUser = useAppSelector(getCurrUser);
  const token = useAppSelector(getAPIToken);
  const wso = useAppSelector(getWSO);

  const navigateTo = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();

  const [courses, updateCourses] = useState<ModelsCourse[]>([]);
  const [metric, updateMetric] = useState<FactrakCourseMetric>(
    FactrakCourseMetric.WouldRecommendCourse
  );
  const [ascending, updateAscending] = useState(false);

  useEffect(() => {
    const loadCourses = async () => {
      const queryParams = {
        metric: metric,
        ascending,
        areaOfStudyID: params.aos ? parseInt(params.aos) : undefined,
        preload: ["areaOfStudy"],
      };

      // Loads in courses and the ratings for each one
      try {
        updateCourses([]);
        const courseRanked = await wso.factrakService.listCourses(queryParams);
        const courseRankedData = courseRanked.data;
        if (!courseRankedData) {
          throw new Error("No ranked data returned");
        }
        updateCourses(courseRankedData);
      } catch (error) {
        navigateTo("/error", { replace: true, state: { error } });
      }
    };

    if (containsOneOfScopes(token, [scopes.ScopeFactrakFull])) {
      loadCourses();
    }
  }, [token, wso, params.aos, metric]);

  // Generates a row containing the course information.
  const generateCourseRow = (course: ModelsCourse) => {
    if (course.factrakScore === undefined) {
      return null;
    }
    const val = course.factrakScore;
    let rating = "";
    if (metric === FactrakCourseMetric.WouldRecommendCourse) {
      rating = `${Math.round(val * 100)}%`;
    } else {
      // Currently no API to retrieve the max value of the metric but
      // it's currently 7. Might need to change later
      rating = `${Math.round(((val + Number.EPSILON) * 100) / 100)} / 7`;
    }
    return (
      <tr key={course.id}>
        <td>
          <Link
            to={`/factrak/courses/${course.id}`}
          >{`${course.areaOfStudy?.abbreviation} ${course.number}`}</Link>
        </td>
        <td>{rating}</td>
      </tr>
    );
  };

  // Generate a skeleton of course information
  const courseSkeleton = (key: number) => (
    <tr key={key}>
      <td>
        <Line width="50%" />
      </td>
      <td>
        <Line width="50%" />
      </td>
    </tr>
  );

  // Generates the component which holds the list of courses
  const generateCourses = () => {
    return (
      <>
        <br />
        <table>
          <thead>
            <tr>
              <th> Name </th>
              <th>
                <Link
                  to={`/factrak/course-rankings/${
                    params.aos ?? ""
                  }?${searchParams.toString()}`}
                  onClick={() => {
                    updateCourses(courses.reverse());
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
            </tr>
          </thead>
          <tbody>
            {courses.length > 0
              ? courses.map((course) => generateCourseRow(course))
              : [...Array(5)].map((_, i) => courseSkeleton(i))}
          </tbody>
        </table>
      </>
    );
  };

  return (
    <article className="main">
      <section className="margin-vertical-small">
        <h3>Top Courses</h3>
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
              "Overall Recommendation",
              "Course Workload",
              "Course Stimulating",
            ]}
            value={metric}
            valueList={[
              FactrakCourseMetric.WouldRecommendCourse,
              FactrakCourseMetric.CourseWorkload,
              FactrakCourseMetric.CourseStimulating,
            ]}
            style={{
              display: "inline",
              margin: "5px 0px 5px 20px",
              padding: "4px",
            }}
          />
        </div>
        <FactrakDeficitMessage currUser={currUser} />
        {generateCourses()}
      </section>
    </article>
  );
};

export default FactrakCourseRankingsTable;
