// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// External Imports
import { Chart } from "react-google-charts";

import { getDormtrakDormFacts } from "../../../api/dormtrak";
import { checkAndHandleError, capitalize } from "../../../lib/general";

const DormtrakFacts = ({ dorm, token }) => {
  const [facts, updateFacts] = useState(null);

  useEffect(() => {
    const loadFacts = async () => {
      const factResponse = await getDormtrakDormFacts(token, dorm.id);
      if (checkAndHandleError(factResponse)) {
        updateFacts(factResponse.data.data);
      }
    };

    loadFacts();
  }, [token, dorm.id]);

  return (
    <article className="home">
      <h3>Facts</h3>

      {dorm.neighborhood && dorm.neighborhood.name !== "First-year" ? (
        <div>
          <strong>Class breakdown</strong>:
          {facts ? (
            <div id="piechart">
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
                  legend: "none",
                  chartArea: { width: "75%", height: "80%" },
                  backgroundColor: "transparent",
                  pieSliceText: "label",
                  pieSliceTextStyle: { color: "black", fontSize: 8 },
                }}
              />
            </div>
          ) : (
            "Not Available"
          )}
        </div>
      ) : null}

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
        {`: ${dorm.capacity}`}
        <br />
      </div>

      <div>
        <strong>Singles</strong>
        {`: ${dorm.numberSingles}`}
        <br />
      </div>

      <div>
        <strong>Mean Single Size</strong>
        {`: ${dorm.averageSingleArea} sq. ft.`}
        <br />
      </div>

      <div>
        <strong>Most Common Single Size</strong>
        {`: ${dorm.modeSingleArea} sq. ft.`}
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
        {`: ${dorm.numberDoubles}`}
        <br />
      </div>

      {dorm.numberDoubles > 0 ? (
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
            {facts && facts.biggestDouble
              ? `: ${facts.biggestDouble.number}`
              : null}
            <br />
          </div>
          <div>
            <strong>Smallest Double</strong>
            {facts && facts.smallestDouble
              ? `: ${facts.smallestDouble.number}`
              : null}
            <br />
          </div>
        </>
      ) : null}

      <div>
        <strong>Flexes</strong>
        {`: ${dorm.numberFlex}`}
        <br />
      </div>

      <div>
        <strong>Student-bathroom ratio</strong>
        {`: ${dorm.bathroomRatio.toPrecision(3)}:1`}
        <br />
      </div>
      <div>
        <strong>Common rooms</strong>
        {facts ? `: ${facts.commonRoomAccessRatio}` : ": N/A"}
        <br />
      </div>
      <div>
        <strong>Washers</strong>
        {`: ${dorm.numberWashers}`}
        <br />
      </div>
      <div>
        <strong>Average Ratings for&nbsp;:</strong>
        {facts
          ? ["Wifi", "Location", "Loudness", "Satisfaction"].map((attr) => {
              if (!facts[`average ${attr}`]) return null;
              return `${capitalize(attr)}: ${facts[`average ${attr}`]}`;
            })
          : ": N/A"}
      </div>
    </article>
  );
};

DormtrakFacts.propTypes = {
  dorm: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
};

export default DormtrakFacts;
