// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Circle } from "../../Skeleton";

// External Imports
import { Chart } from "react-google-charts";

const DormtrakFacts = ({ api, dorm }) => {
  const [facts, updateFacts] = useState(null);

  useEffect(() => {
    const loadFacts = async () => {
      try {
        const factResponse = await api.dormtrakService.getDormFacts(dorm.id);

        updateFacts(factResponse.data);
      } catch {
        // eslint-disable-next-line no-empty
      }
    };

    if (dorm && dorm.id) loadFacts();
  }, [api, dorm]);

  const classBreakdown = () => {
    if (!dorm || !facts) {
      return (
        <div>
          <strong>Class breakdown</strong>:
          <div id="dormtrak-piechart">
            <Circle diameter="130px" />
          </div>
        </div>
      );
    }
    if (dorm.neighborhood && dorm.neighborhood.name !== "First-year") {
      return (
        <div>
          <strong>Class breakdown</strong>:
          <div id="dormtrak-piechart">
            {facts.seniorCount + facts.juniorCount + facts.sophomoreCount >
              0 && (
              <Chart
                id="piechart"
                chartType="PieChart"
                data={[
                  ["Class", "% of residents"],
                  ["Seniors", facts.seniorCount],
                  ["Juniors", facts.juniorCount],
                  ["Sophomores", facts.sophomoreCount],
                ]}
                options={{
                  backgroundColor: "transparent",
                  pieSliceText: "none",
                  height: 160,
                }}
              />
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const ratings = () => {
    if (!facts) return "N/A";

    const ratingParameters = ["Wifi", "Location", "Loudness", "Satisfaction"];
    const ratingScores = ratingParameters.map(
      (attr) => facts[`average${attr}`]
    );

    if (ratingScores.filter((e) => e !== 0).length === 0) return null;

    return (
      <>
        <strong>Average Ratings for&nbsp;:</strong>
        {ratingScores.map(
          (score, index) =>
            score !== 0 && (
              <div key={score}>
                {ratingParameters[index]}: {ratingScores[index].toPrecision(2)}
                <br />
              </div>
            )
        )}
      </>
    );
  };

  return (
    <article className="home">
      <h3>Facts</h3>

      {classBreakdown()}

      <div>
        <strong>Seniors</strong>
        {facts && facts.seniorCount ? `: ${facts.seniorCount}` : ": N/A"}
        <br />
      </div>

      <div>
        <strong>Juniors</strong>
        {facts && facts.juniorCount ? `: ${facts.juniorCount}` : ": N/A"}
        <br />
      </div>

      <div>
        <strong>Sophomores</strong>
        {facts && facts.sophomoreCount ? `: ${facts.sophomoreCount}` : ": N/A"}
        <br />
      </div>
      <div>
        <strong>Capacity</strong>
        {`: ${dorm && dorm.capacity}`}
        <br />
      </div>

      <div>
        <strong>Singles</strong>
        {`: ${dorm && dorm.numberSingles}`}
        <br />
      </div>

      <div>
        <strong>Mean Single Size</strong>
        {`: ${dorm && dorm.averageSingleArea} sq. ft.`}
        <br />
      </div>

      <div>
        <strong>Most Common Single Size</strong>
        {`: ${dorm && dorm.modeSingleArea} sq. ft.`}
        <br />
      </div>

      <div>
        <strong>Biggest Single</strong>
        {facts && facts.biggestSingle
          ? `: ${facts.biggestSingle.number}`
          : "N/A"}
        <br />
      </div>

      <div>
        <strong>Smallest Single</strong>
        {facts && facts.smallestSingle
          ? `: ${facts.smallestSingle.number}`
          : "N/A"}
        <br />
      </div>

      <div>
        <strong>Doubles</strong>
        {`: ${dorm && dorm.numberDoubles}`}
        <br />
      </div>

      {dorm && dorm.numberDoubles > 0 && (
        <>
          <div>
            <strong>Mean Double Size</strong>
            {`: ${dorm.averageDoubleArea} sq. ft.`}
            <br />
          </div>
          <div>
            <strong>Most Common Double Size</strong>
            {`: ${dorm.modeDoubleArea} sq. ft.`}
            <br />
          </div>
          <div>
            <strong>Biggest Double</strong>
            {facts && facts.biggestDouble && `: ${facts.biggestDouble.number}`}
            <br />
          </div>
          <div>
            <strong>Smallest Double</strong>
            {facts &&
              facts.smallestDouble &&
              `: ${facts.smallestDouble.number}`}
            <br />
          </div>
        </>
      )}

      <div>
        <strong>Flexes</strong>
        {`: ${dorm && dorm.numberFlex}`}
        <br />
      </div>

      <div>
        <strong>Student-bathroom ratio</strong>
        {`: ${dorm && dorm.bathroomRatio.toPrecision(3)} : 1`}
        <br />
      </div>
      <div>
        <strong>Common rooms</strong>
        {facts
          ? `: ${facts.commonRoomAccessRatio.toPrecision(3)} : 1`
          : ": N/A"}
        <br />
      </div>
      <div>
        <strong>Washers</strong>
        {`: ${dorm && dorm.numberWashers}`}
        <br />
      </div>
      <div>{facts && ratings()}</div>
    </article>
  );
};

DormtrakFacts.propTypes = {
  api: PropTypes.object.isRequired,
  dorm: PropTypes.object,
};

DormtrakFacts.defaultProps = {
  dorm: null,
};

export default DormtrakFacts;
