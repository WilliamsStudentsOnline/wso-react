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
import { FactrakProfessorMetric } from "wso-api-client/lib/services/factrak";
import { ModelsUser } from "wso-api-client/lib/services/types";

const PROFESSOR_METRIC_OPTIONS = [
  {
    label: "Approachability",
    value: FactrakProfessorMetric.Approachability,
  },
  { label: "Course Workload", value: FactrakProfessorMetric.CourseWorkload },
  {
    label: "Discussion Promotion",
    value: FactrakProfessorMetric.PromoteDiscussion,
  },
  { label: "Lecture Ability", value: FactrakProfessorMetric.LeadLecture },
  {
    label: "Outside Helpfulness",
    value: FactrakProfessorMetric.OutsideHelpfulness,
  },
  {
    label: "Overall Recommendation",
    value: FactrakProfessorMetric.WouldTakeAnother,
  },
];

const FactrakProfessorRankingsTable = () => {
  const currUser = useAppSelector(getCurrUser);
  const token = useAppSelector(getAPIToken);
  const wso = useAppSelector(getWSO);

  const navigateTo = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();

  const [profs, updateProfs] = useState<ModelsUser[] | undefined>(undefined);
  const [metric, updateMetric] = useState<FactrakProfessorMetric>(
    FactrakProfessorMetric.WouldTakeAnother
  );
  const [ascending, updateAscending] = useState(false);

  useEffect(() => {
    const loadProfs = async () => {
      const queryParams = {
        metric: metric,
        ascending,
        areaOfStudyID: params.aos ? parseInt(params.aos) : undefined,
      };

      // Loads in professors and the ratings for each one
      try {
        const profRanked = await wso.factrakService.listProfessors(queryParams);
        const profRankedData = profRanked.data;
        updateProfs(profRankedData ?? []);
      } catch (error) {
        navigateTo("/error", { replace: true, state: { error } });
      }
    };

    if (containsOneOfScopes(token, [scopes.ScopeFactrakFull])) {
      loadProfs();
    }
  }, [token, wso, params.aos, metric]);

  // Generates a row containing the prof information.
  const generateProfRow = (prof: ModelsUser) => {
    if (prof.factrakScore === undefined) {
      return null;
    }
    const val = prof.factrakScore;
    let rating = "";
    if (metric === FactrakProfessorMetric.WouldTakeAnother) {
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

  const sortLinkTo = `/factrak/professor-rankings/${
    params.aos ?? ""
  }?${searchParams.toString()}`;

  return (
    <RankingsTable
      title="Top Professors"
      deficitMessage={<FactrakDeficitMessage currUser={currUser} />}
      metric={metric}
      metricOptions={PROFESSOR_METRIC_OPTIONS}
      onMetricChange={(value) => {
        updateMetric(value as FactrakProfessorMetric);
        updateProfs(undefined);
        // TODO: Update the URL to reflect the new metric
      }}
      ascending={ascending}
      onToggleAscending={() => {
        updateAscending(!ascending);
        if (profs === undefined) {
          return;
        }
        updateProfs(profs.reverse());
      }}
      sortLinkTo={sortLinkTo}
      extraHeaders={<th className="unix-column">Unix</th>}
      skeletonColumns={3}
      loading={profs === undefined}
      rows={profs?.map((prof) => generateProfRow(prof))}
    />
  );
};

export default FactrakProfessorRankingsTable;
