// React imports
import React from "react";
import { Line } from "../../Skeleton";
import { ModelsFactrakSurveyAvgRatings } from "wso-api-client/lib/services/types";

const FactrakRatings = ({
  ratings,
  general = false,
}: {
  ratings: ModelsFactrakSurveyAvgRatings | undefined;
  general?: boolean;
}) => {
  if (!ratings) return null;
  // Generates the crowdsourced opinion on the professor's courses' workload
  const courseWorkload = () => {
    if (!ratings.numCourseWorkload || !ratings.avgCourseWorkload) return null;

    const WORKLOAD_DESCRIPTIONS = [
      "",
      "very easy",
      "easy",
      "somewhat easy",
      "normal",
      "somewhat hard",
      "hard",
      "very hard",
    ];
    return (
      <li>
        The course workloads are&nbsp;
        <u>{WORKLOAD_DESCRIPTIONS[Math.round(ratings.avgCourseWorkload)]}</u>
        &nbsp;when compared to other courses ({ratings.numCourseWorkload}
        &nbsp;surveys).
      </li>
    );
  };

  // Generates the crowdsourced opinion on how stimulating the professor's courses are.
  const courseStimulating = () => {
    if (!ratings.numCourseStimulating || !ratings.avgCourseStimulating)
      return null;
    const STIMULATING_DESCR = [
      "",
      "very boring",
      "boring",
      "somewhat boring",
      "normal",
      "somewhat stimulating",
      "stimulating",
      "very stimulating",
    ];

    return (
      <li>
        The courses taught are&nbsp;
        <u>{STIMULATING_DESCR[Math.round(ratings.avgCourseStimulating)]}</u>
        &nbsp;when compared to other would take another course (
        {ratings.numCourseStimulating}
        &nbsp;surveys).
      </li>
    );
  };

  // Generates the crowdsourced opinion on how approachable the professor is.
  const profApproachability = () => {
    if (!ratings.avgApproachability) return null;
    const APPROACH_DESCR = [
      "",
      "very unapproachable",
      "unapproachable",
      "somewhat unapproachable",
      "somewhat approachable",
      "moderately approachable",
      "approachable",
      "very approachable",
    ];

    return (
      <li>
        The professor is&nbsp;
        <u>{APPROACH_DESCR[Math.round(ratings.avgApproachability)]}</u>
        &nbsp;(
        {ratings.numApproachability}
        &nbsp;surveys).
      </li>
    );
  };

  // Generates the crowdsourced opinion on how good the professor is at lecturing.
  const profLecture = () => {
    if (!ratings.numLeadLecture || !ratings.avgLeadLecture) return null;
    const LECTURE_DESCR = [
      "",
      "very ineffective",
      "ineffective",
      "somewhat ineffective",
      "somewhat effective",
      "moderately effective",
      "effective",
      "very effective",
    ];
    return (
      <li>
        The professor is&nbsp;
        <u>{LECTURE_DESCR[Math.round(ratings.avgLeadLecture)]}</u>
        &nbsp;at lecturing ({ratings.numLeadLecture}
        &nbsp;surveys).
      </li>
    );
  };

  // Generates the crowdsourced opinion on how good the professor is at supporting mental health.
  const profMentalHealth = () => {
    if (!ratings.numMentalHealthSupport || !ratings.avgMentalHealthSupport)
      return null;
    const MHS_DESCR = [
      "",
      "very ineffective",
      "ineffective",
      "somewhat ineffective",
      "somewhat effective",
      "moderately effective",
      "effective",
      "very effective",
    ];
    return (
      <li>
        The professor is&nbsp;
        <u>{MHS_DESCR[Math.round(ratings.avgMentalHealthSupport)]}</u>
        &nbsp;at supporting student mental health (
        {ratings.numMentalHealthSupport}
        &nbsp;surveys).
      </li>
    );
  };

  // Generates the crowdsourced opinion on how helpful the professor is.
  const profHelpful = () => {
    if (!ratings.numOutsideHelpfulness || !ratings.avgOutsideHelpfulness)
      return null;
    const HELP_DESCR = [
      "",
      "very unhelpful",
      "unhelpful",
      "somewhat unhelpful",
      "somewhat helpful",
      "moderately helpful",
      "helpful",
      "very helpful",
    ];
    return (
      <li>
        The professor is&nbsp;
        <u>{HELP_DESCR[Math.round(ratings.avgOutsideHelpfulness)]}</u>
        &nbsp;outside of class ({ratings.numOutsideHelpfulness}
        &nbsp;surveys).
      </li>
    );
  };

  const wouldTakeAnother = () => {
    if (!ratings.numWouldTakeAnother || !ratings.avgWouldTakeAnother)
      return null;

    return (
      <li>
        <u>{`${Math.round(ratings.avgWouldTakeAnother * 100)}%`}</u>
        {` out of ${
          ratings.numWouldTakeAnother
        } would take another course with ${
          general ? "their professors." : "this professor."
        }`}
      </li>
    );
  };

  const wouldRecommendCourse = () => {
    if (!ratings.numWouldRecommendCourse || !ratings.avgWouldRecommendCourse)
      return null;
    return (
      <li>
        <u>{`${Math.round(ratings.avgWouldRecommendCourse * 100)}%`}</u>
        {` out of ${ratings.numWouldRecommendCourse} recommend this ${
          general ? "course" : "professor's courses"
        } to a friend.`}
      </li>
    );
  };

  return (
    <div>
      <h4>Survey Statistics</h4>
      <ul>
        {wouldTakeAnother()}
        {wouldRecommendCourse()}
        {courseWorkload()}
        {courseStimulating()}
        {profApproachability()}
        {profLecture()}
        {profHelpful()}
        {profMentalHealth()}
      </ul>
    </div>
  );
};

const FactrakRatingsSkeleton = () => (
  <>
    <br />
    {["20%", "50%", "50%", "70%", "30%", "50%", "40%"].map((width, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <div key={i}>
        <Line width={width} />
      </div>
    ))}
    <br />
  </>
);

export default FactrakRatings;
export { FactrakRatingsSkeleton };
