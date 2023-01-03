// React imports
import React, { useEffect, useState } from "react";
import { Circle } from "../../Skeleton";

// External Imports
import { Chart } from "react-google-charts";
import { useAppSelector } from "../../../lib/store";
import { getWSO } from "../../../lib/authSlice";
import { ModelsDorm, ModelsDormFacts } from "wso-api-client/lib/services/types";

const DormtrakFacts = ({ dorm }: { dorm: ModelsDorm }) => {
  const wso = useAppSelector(getWSO);
  const [facts, updateFacts] = useState<ModelsDormFacts | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;

    const loadFacts = async () => {
      try {
        if (dorm.id) {
          const factResponse = await wso.dormtrakService.getDormFacts(dorm.id);
          if (isMounted) {
            updateFacts(factResponse.data);
          }
        }
      } catch {
        // It's okay to not have a response here because there is a loading state
      }
    };

    if (dorm?.id) loadFacts();

    return () => {
      isMounted = false;
    };
  }, [dorm, wso]);

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
    if (dorm.neighborhood?.name !== "First-year") {
      return (
        <div>
          <strong>Class breakdown</strong>:
          <div id="dormtrak-piechart">
            {(facts.seniorCount ?? 0) +
              (facts.juniorCount ?? 0) +
              (facts.sophomoreCount ?? 0) >
              0 && (
              <Chart
                // graph_id="piechart"
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
    const ratingScores = ratingParameters
      .map((attr) => facts[`average${attr}` as keyof typeof facts])
      .map((val) => val as number);

    if (ratingScores.filter((e) => e).length === 0) return null;

    return (
      <>
        <strong>Average Ratings for&nbsp;:</strong>
        {ratingScores.map(
          (score, index) =>
            score !== 0 && (
              <div key={ratingParameters[index]}>
                {ratingParameters[index]}:{" "}
                {ratingScores[index] ? ratingScores[index].toPrecision(2) : 0}
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
        {facts?.seniorCount ? `: ${facts.seniorCount}` : ": N/A"}
        <br />
      </div>

      <div>
        <strong>Juniors</strong>
        {facts?.juniorCount ? `: ${facts.juniorCount}` : ": N/A"}
        <br />
      </div>

      <div>
        <strong>Sophomores</strong>
        {facts?.sophomoreCount ? `: ${facts.sophomoreCount}` : ": N/A"}
        <br />
      </div>
      <div>
        <strong>Capacity</strong>
        {`: ${dorm?.capacity}`}
        <br />
      </div>

      <div>
        <strong>Singles</strong>
        {`: ${dorm?.numberSingles}`}
        <br />
      </div>

      <div>
        <strong>Mean Single Size</strong>
        {`: ${dorm?.averageSingleArea} sq. ft.`}
        <br />
      </div>

      <div>
        <strong>Most Common Single Size</strong>
        {`: ${dorm?.modeSingleArea} sq. ft.`}
        <br />
      </div>

      <div>
        <strong>Biggest Single</strong>
        {facts?.biggestSingle ? `: ${facts.biggestSingle.number}` : "N/A"}
        <br />
      </div>

      <div>
        <strong>Smallest Single</strong>
        {facts?.smallestSingle ? `: ${facts.smallestSingle.number}` : "N/A"}
        <br />
      </div>

      <div>
        <strong>Doubles</strong>
        {`: ${dorm?.numberDoubles}`}
        <br />
      </div>

      {dorm?.numberDoubles && dorm.numberDoubles > 0 && (
        <>
          <div>
            <strong>Mean Double Size</strong>
            {`: ${dorm?.averageDoubleArea} sq. ft.`}
            <br />
          </div>
          <div>
            <strong>Most Common Double Size</strong>
            {`: ${dorm?.modeDoubleArea} sq. ft.`}
            <br />
          </div>
          <div>
            <strong>Biggest Double</strong>
            {facts?.biggestDouble && `: ${facts.biggestDouble.number}`}
            <br />
          </div>
          <div>
            <strong>Smallest Double</strong>
            {facts?.smallestDouble && `: ${facts.smallestDouble.number}`}
            <br />
          </div>
        </>
      )}

      <div>
        <strong>Flexes</strong>
        {`: ${dorm?.numberFlex}`}
        <br />
      </div>

      {dorm?.bathroomRatio && (
        <div>
          <strong>Student-bathroom ratio</strong>
          {`: ${dorm?.bathroomRatio.toPrecision(3)} : 1`}
          <br />
        </div>
      )}
      {facts?.commonRoomAccessRatio && (
        <div>
          <strong>Common rooms</strong>
          {facts
            ? `: ${facts.commonRoomAccessRatio.toPrecision(3)} : 1`
            : ": N/A"}
          <br />
        </div>
      )}
      <div>
        <strong>Washers</strong>
        {`: ${dorm?.numberWashers}`}
        <br />
      </div>
      <div>{ratings()}</div>
    </article>
  );
};

export default DormtrakFacts;
