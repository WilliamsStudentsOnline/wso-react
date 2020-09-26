// React imports
import React from "react";
import PropTypes from "prop-types";
import { Line } from "../../common/Skeleton";

// Scss and elastic
import styles from "./FactrakRatings.module.scss";
import { EuiFlexItem, EuiFlexGroup, EuiText } from "@elastic/eui";
import { Chart, Partition } from "@elastic/charts";
import { EUI_CHARTS_THEME_LIGHT } from "@elastic/eui/dist/eui_charts_theme";
import "@elastic/charts/dist/theme_only_light.css";

const FactrakRatings = ({ ratings, general }) => {
  if (!ratings) return null;

  const euiChartTheme = EUI_CHARTS_THEME_LIGHT;
  const euiPartitionConfig = euiChartTheme.partition;
  // Generates the crowdsourced opinion on the professor's courses' workload
  const courseWorkload = () => {
    if (!ratings.numCourseWorkload) return null;

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
      <EuiText>
        <div className={styles.rating}>
          Workload is&nbsp;
          <strong>
            {WORKLOAD_DESCRIPTIONS[Math.round(ratings.avgCourseWorkload)]}
          </strong>
        </div>
      </EuiText>
    );
  };

  // Generates the crowdsourced opinion on how stimulating the professor's courses are.
  const courseStimulating = () => {
    if (!ratings.numCourseStimulating) return null;
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
      <EuiText>
        <div className={styles.rating}>
          Course is&nbsp;
          <strong>
            {STIMULATING_DESCR[Math.round(ratings.avgCourseStimulating)]}
          </strong>
        </div>
      </EuiText>
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
      "approchable",
      "very approchable",
    ];

    return (
      <EuiText>
        <div className={styles.rating}>
          Professor(s) is&nbsp;
          <strong>
            {APPROACH_DESCR[Math.round(ratings.avgApproachability)]}
          </strong>
        </div>
      </EuiText>
    );
  };

  // Generates the crowdsourced opinion on how good the professor is at lecturing.
  const profLecture = () => {
    if (!ratings.numLeadLecture) return null;
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
      <EuiText>
        <div className={styles.rating}>
          Lectures are&nbsp;
          <strong>{LECTURE_DESCR[Math.round(ratings.avgLeadLecture)]}</strong>
        </div>
      </EuiText>
    );
  };

  // Generates the crowdsourced opinion on how helpful the professor is.
  const profHelpful = () => {
    if (!ratings.numOutsideHelpfulness) return null;
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
      <EuiText>
        <div className={styles.rating}>
          Professor(s) is&nbsp;
          <strong>
            {HELP_DESCR[Math.round(ratings.avgOutsideHelpfulness)]}
          </strong>
        </div>
      </EuiText>
    );
  };

  const wouldTakeAnother = () => {
    if (!ratings.numWouldTakeAnother) return null;

    return (
      <EuiText className={styles.wouldTakeAnother}>
        <div className={styles.colored}>{`${Math.round(
          ratings.avgWouldTakeAnother * 100
        )}%`}</div>
        {` Would take another course with ${
          general ? "their professors." : "this professor."
        }`}
      </EuiText>
    );
  };

  const wouldRecommendCourse = () => {
    if (!ratings.numWouldRecommendCourse) return null;
    return (
      <EuiText className={styles.wouldRecommend}>
        <div className={styles.colored}>{`${Math.round(
          ratings.avgWouldRecommendCourse * 100
        )}%`}</div>
        {` Recommend this ${
          general ? "course" : "professor's courses"
        } to a friend.`}
      </EuiText>
    );
  };

  return (
    <EuiFlexGroup
      direction="row"
      alignItems="center"
      className={styles.professorRatings}
    >
      <EuiFlexItem>
        <EuiFlexGroup className={styles.topSection} direction="column">
          <EuiFlexItem>
            <EuiFlexGroup
              direction="row"
              alignItems="center"
              justifyContent="spaceAround"
              wrap={false}
              responsive={false}
            >
              <EuiFlexItem grow={1}>
                <Chart
                  size={{ height: 100, width: 100 }}
                  className={styles.chart}
                >
                  <Partition
                    data={[
                      {
                        name: "",
                        percent: Math.round(ratings.avgWouldTakeAnother * 100),
                      },
                      {
                        name: " ",
                        percent:
                          100 - Math.round(ratings.avgWouldTakeAnother * 100),
                      },
                    ]}
                    valueAccessor={(d) => Number(d.percent)}
                    valueFormatter={() => ""}
                    layers={[
                      {
                        groupByRollup: (d) => d.name,
                        shape: {
                          fillColor: (d) =>
                            euiChartTheme.theme.colors.vizColors[d.sortIndex],
                        },
                      },
                    ]}
                    config={{
                      ...euiPartitionConfig,
                      emptySizeRatio: 0.3,
                      clockwiseSectors: false,
                    }}
                  />
                </Chart>
              </EuiFlexItem>
              <EuiFlexItem grow={2}>{wouldTakeAnother()}</EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFlexGroup
              direction="row"
              alignItems="center"
              responsive={false}
            >
              <EuiFlexItem grow={1}>
                <Chart
                  size={{ height: 100, width: 100 }}
                  className={styles.chart}
                >
                  <Partition
                    data={[
                      {
                        name: "",
                        percent: Math.round(
                          ratings.avgWouldRecommendCourse * 100
                        ),
                      },
                      {
                        name: " ",
                        percent:
                          100 -
                          Math.round(ratings.avgWouldRecommendCourse * 100),
                      },
                    ]}
                    valueAccessor={(d) => Number(d.percent)}
                    // Removes the number label
                    valueFormatter={() => ""}
                    layers={[
                      {
                        groupByRollup: (d) => d.name,
                        shape: {
                          fillColor: (d) =>
                            euiChartTheme.theme.colors.vizColors[d.sortIndex],
                        },
                      },
                    ]}
                    config={{
                      ...euiPartitionConfig,
                      emptySizeRatio: 0.3,
                      clockwiseSectors: false,
                    }}
                  />
                </Chart>
              </EuiFlexItem>
              <EuiFlexItem grow={2}>{wouldRecommendCourse()}</EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiFlexGroup
          justifyContent="spaceBetween"
          direction="column"
          className={styles.judgements}
        >
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
  general: PropTypes.bool,
  ratings: PropTypes.object.isRequired,
};

FactrakRatings.defaultProps = {
  general: false,
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

const FactrakReviewCount = ({ ratings }) => {
  if (ratings == null) return null;
  return (
    <p className={styles.reviewCount}>
      {[Math.round(ratings.numWouldTakeAnother)]}&nbsp;
      {ratings.numWouldTakeAnother === 1 ? "Review" : "Reviews"}
    </p>
  );
};

FactrakReviewCount.propTypes = {
  ratings: PropTypes.object.isRequired,
};

export default FactrakRatings;
export { FactrakRatingsSkeleton };
export { FactrakReviewCount };
