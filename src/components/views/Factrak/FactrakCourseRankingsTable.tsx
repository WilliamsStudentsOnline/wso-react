// React imports
import React, { useState, useEffect } from "react";
import { RankingsTable } from "../../ui";

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

const COURSE_METRIC_OPTIONS = [
  {
    label: "Overall Recommendation",
    value: FactrakCourseMetric.WouldRecommendCourse,
  },
  { label: "Course Workload", value: FactrakCourseMetric.CourseWorkload },
  {
    label: "Course Stimulating",
    value: FactrakCourseMetric.CourseStimulating,
  },
];

const FactrakCourseRankingsTable = () => {
  const currUser = useAppSelector(getCurrUser);
  const token = useAppSelector(getAPIToken);
  const wso = useAppSelector(getWSO);

  const navigateTo = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();

  const [courses, updateCourses] = useState<ModelsCourse[] | undefined>(
    undefined
  );
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
        const courseRanked = await wso.factrakService.listCourses(queryParams);
        const courseRankedData = courseRanked.data;
        updateCourses(courseRankedData ?? []);
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

  const sortLinkTo = `/factrak/course-rankings/${
    params.aos ?? ""
  }?${searchParams.toString()}`;

  return (
    <RankingsTable
      title="Top Courses"
      deficitMessage={<FactrakDeficitMessage currUser={currUser} />}
      metric={metric}
      metricOptions={COURSE_METRIC_OPTIONS}
      onMetricChange={(value) => {
        updateMetric(value as FactrakCourseMetric);
        updateCourses(undefined);
        // TODO: Update the URL to reflect the new metric
      }}
      ascending={ascending}
      onToggleAscending={() => {
        updateAscending(!ascending);
        if (courses === undefined) {
          return;
        }
        updateCourses(courses.reverse());
      }}
      sortLinkTo={sortLinkTo}
      loading={courses === undefined}
      rows={courses?.map((course) => generateCourseRow(course))}
    />
  );
};

export default FactrakCourseRankingsTable;
