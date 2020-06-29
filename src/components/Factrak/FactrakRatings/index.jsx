// React imports
import React from "react";
import PropTypes from "prop-types";
import { Line } from "../../common/Skeleton";

// Scss and elastic
import styles from "./FactrakRatings.module.scss";
import { EuiFlexItem, EuiFlexGroup, EuiText } from "@elastic/eui";

const FactrakRatings = ({ ratings, general = false }) => {
  if (!ratings) return null;

  // Generates the crowdsourced opinion on the professor's courses' workload
  const courseWorkload = () => {
    if (!ratings.numCourseWorkload) return null;

    const WORKLOAD_DESCRIPTIONS = [
      "",
      "Very easy",
      "Easy",
      "Somewhat easy",
      "Normal",
      "Somewhat hard",
      "Hard",
      "Very hard",
    ];
    return (
      <EuiText>
        <div className={styles.ratingHeader}>
          {WORKLOAD_DESCRIPTIONS[Math.round(ratings.avgCourseWorkload)]}
        </div>
        Workload
      </EuiText>
    );
  };

  // Generates the number of reviews for the professor
  const reviews = () => {
    if (!ratings.numWouldTakeAnother) return null;

    return (
      <EuiText>
        <div className={styles.ratingHeader}>
          {[Math.round(ratings.numWouldTakeAnother)]}
        </div>
        Reviews
      </EuiText>
    );
  };

  // Generates the crowdsourced opinion on how stimulating the professor's courses are.
  const courseStimulating = () => {
    if (!ratings.numCourseStimulating) return null;
    const STIMULATING_DESCR = [
      "",
      "Very boring",
      "Boring",
      "Somewhat boring",
      "Normal",
      "Somewhat stimulating",
      "Stimulating",
      "Very stimulating",
    ];

    return (
      <EuiText>
        <div className={styles.ratingHeader}>
          {STIMULATING_DESCR[Math.round(ratings.avgCourseStimulating)]}
        </div>
        when compared to other professors.
      </EuiText>
    );
  };

  // Generates the crowdsourced opinion on how approachable the professor is.
  const profApproachability = () => {
    if (!ratings.avgApproachability) return null;
    const APPROACH_DESCR = [
      "",
      "Very unapproachable",
      "Unapproachable",
      "Somewhat unapproachable",
      "Somewhat approachable",
      "Moderately approachable",
      "Approchable",
      "Very approchable",
    ];

    return (
      <EuiText>
        <div className={styles.ratingHeader}>
          {APPROACH_DESCR[Math.round(ratings.avgApproachability)]}
        </div>
        Personality
      </EuiText>
    );
  };

  // Generates the crowdsourced opinion on how good the professor is at lecturing.
  const profLecture = () => {
    if (!ratings.numLeadLecture) return null;
    const LECTURE_DESCR = [
      "",
      "Very ineffective",
      "Ineffective",
      "Somewhat ineffective",
      "Somewhat effective",
      "Moderately effective",
      "Effective",
      "Very effective",
    ];
    return (
      <EuiText>
        <div className={styles.ratingHeader}>
          {LECTURE_DESCR[Math.round(ratings.avgLeadLecture)]}
        </div>
        At lecturing.
      </EuiText>
    );
  };

  // Generates the crowdsourced opinion on how helpful the professor is.
  const profHelpful = () => {
    if (!ratings.numOutsideHelpfulness) return null;
    const HELP_DESCR = [
      "",
      "Very unhelpful",
      "Unhelpful",
      "Somewhat unhelpful",
      "Somewhat helpful",
      "Moderately helpful",
      "Helpful",
      "Very helpful",
    ];
    return (
      <EuiText>
        <div className={styles.ratingHeader}>
          {HELP_DESCR[Math.round(ratings.avgOutsideHelpfulness)]}
        </div>
        Outside of class.
      </EuiText>
    );
  };

  const wouldTakeAnother = () => {
    if (!ratings.numWouldTakeAnother) return null;

    return (
      <EuiText>
        <div className={styles.ratingHeader}>
          {`${Math.round(ratings.avgWouldTakeAnother * 100)}%`}
        </div>
        {` out of would take another course with ${
          general ? "their professors." : "this professor."
        }`}
      </EuiText>
    );
  };

  const wouldRecommendCourse = () => {
    if (!ratings.numWouldRecommendCourse) return null;
    return (
      <EuiText>
        <div className={styles.ratingHeader}>
          {`${Math.round(ratings.avgWouldRecommendCourse * 100)}%`}
        </div>
        {` would recommend this ${
          general ? "course" : "professor's courses"
        } to a friend.`}
      </EuiText>
    );
  };

  return (
    <EuiFlexGroup
      direction="column"
      alignItems="center"
      className={styles.professorRatings}
    >
      <EuiFlexItem>
        <EuiFlexGroup
          justifyContent="spaceAround"
          className={styles.topSection}
        >
          <EuiFlexItem>{reviews()}</EuiFlexItem>
          <EuiFlexItem>{wouldTakeAnother()}</EuiFlexItem>
          <EuiFlexItem>{wouldRecommendCourse()}</EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiFlexGroup justifyContent="spaceBetween">
          <EuiFlexItem>{courseWorkload()}</EuiFlexItem>
          <EuiFlexItem>{courseStimulating()}</EuiFlexItem>
          <EuiFlexItem>{profApproachability()}</EuiFlexItem>
          <EuiFlexItem>{profLecture()}</EuiFlexItem>
          <EuiFlexItem>{profHelpful()}</EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};

FactrakRatings.propTypes = {
  ratings: PropTypes.object.isRequired,
  general: PropTypes.bool.isRequired,
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
