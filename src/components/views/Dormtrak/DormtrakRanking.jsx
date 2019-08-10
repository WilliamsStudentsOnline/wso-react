// React Imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getToken } from "../../../selectors/auth";

// API imports
import { getDormtrakRankings } from "../../../api/dormtrak";
import { checkAndHandleError } from "../../../lib/general";

const DormtrakRanking = ({ token }) => {
  const [dormInfo, updateDormsInfo] = useState(null);

  // Equivalent to ComponentDidMount
  useEffect(() => {
    const loadRankings = async () => {
      const rankingsResponse = await getDormtrakRankings(token);
      console.log(rankingsResponse);
      if (checkAndHandleError(rankingsResponse)) {
        console.log(rankingsResponse);
        updateDormsInfo(rankingsResponse.data.data);
      }
    };

    loadRankings();
  }, [token]);

  const times = [];
  for (let i = 0; i < 3; i += 1) {
    times.push(0);
  }

  if (!dormInfo) return null;

  return (
    <>
      <article className="dorm-ranks">
        <h3>Rankings</h3>

        <table>
          <tbody>
            <tr>
              <th>Max Mean Single Size</th>
              <th>Min Mean Single Size</th>
            </tr>
            {times.map((element, index) => {
              const a = dormInfo.maxMeanSingleSize[index];
              const b = dormInfo.minMeanSingleSize[index];
              return (
                <tr key={b.averageSingleArea + a.averageSingleArea}>
                  <td>
                    <a href={`/dormtrak/dorms/${a.name}`}>{a.name}</a>
                    <br />
                    {`(${a.averageSingleArea} sq. ft.)`}
                  </td>
                  <td>
                    <a href={`/dormtrak/dorms/${b.name}`}>{b.name}</a>
                    <br />
                    {`(${b.averageSingleArea} sq. ft.)`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <table>
          <tbody>
            <tr>
              <th>Biggest Singles</th>
              <th>Smallest Singles</th>
            </tr>
            {times.map((element, index) => {
              const a = dormInfo.biggestSingles[index];
              const b = dormInfo.smallestSingles[index];
              return (
                <tr key={a.area}>
                  <td>
                    <a href={`/dormtrak/dorms/${a.dormID}`}>
                      {`${a.dormID} ${a.number}`}
                    </a>
                    <br />
                    {`(${a.area} sq. ft.)`}
                  </td>
                  <td>
                    <a href={`/dormtrak/dorms/${b.dormID}`}>
                      {`${b.dormID} ${b.number}`}
                    </a>
                    <br />
                    {`(${b.area} sq. ft.)`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <table>
          <tbody>
            <tr>
              <th>Max Mean Double Size</th>
              <th>Min Mean Double Size</th>
            </tr>
            {times.map((element, index) => {
              const a = dormInfo.maxMeanDoubleSize[index];
              const b = dormInfo.minMeanDoubleSize[index];
              return (
                <tr key={a.averageDoubleArea}>
                  <td>
                    <a href={`/dormtrak/dorms/${a.name}`}>{a.name}</a>
                    <br />
                    {`(${a.averageDoubleArea} sq. ft.)`}
                  </td>
                  <td>
                    <a href={`/dormtrak/dorms/${b.name}`}>{b.name}</a>
                    <br />
                    {`(${b.averageDoubleArea} sq. ft.)`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <table>
          <tbody>
            <tr>
              <th>Biggest Doubles</th>
              <th>Smallest Doubles</th>
            </tr>

            {times.map((element, index) => {
              const a = dormInfo.biggestDoubles[index];
              const b = dormInfo.smallestDoubles[index];
              return (
                <tr key={a.area}>
                  <td>
                    <a href={`/dormtrak/dorms/${a.dormID}`}>
                      {`${a.dormID} ${a.number}`}
                    </a>
                    <br />
                    {`(${a.area} sq. ft.)`}
                  </td>
                  <td>
                    <a href={`/dormtrak/dorms/${b.dormID}`}>
                      {`${b.dormID} ${b.number}`}
                    </a>
                    <br />
                    {`(${b.area} sq. ft.)`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <table>
          <tbody>
            <tr>
              <th>Most Singles</th>
              <th>Most Doubles</th>
            </tr>

            {times.map((element, index) => {
              const a = dormInfo.mostSingles[index];
              const b = dormInfo.mostDoubles[index];
              return (
                <tr key={a.numberSingles}>
                  <td>
                    <a href={`/dormtrak/dorms/${a.name}`}>{a.name}</a>
                    <br />
                    {`(${a.numberSingles})`}
                  </td>
                  <td>
                    <a href={`/dormtrak/dorms/${b.name}`}>{b.name}</a>
                    <br />
                    {`(${b.numberDoubles})`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <table>
          <tbody>
            <tr>
              <th>Most bathrooms</th>
              <th>Fewest bathrooms</th>
            </tr>

            {times.map((element, index) => {
              const a = dormInfo.mostBathrooms[index];
              const b = dormInfo.fewestBathrooms[index];
              return (
                <tr key={a.bathroom_ratio}>
                  <td>
                    <a href={`/dormtrak/dorms/${a.name}`}>{a.name}</a>
                    <br />
                    {`(${a.bathroomRatio.toPrecision(3)}:1)`}
                  </td>
                  <td>
                    <a href={`/dormtrak/dorms/${b.name}`}>{b.name}</a>
                    <br />
                    {`(${b.bathroomRatio.toPrecision(3)}:1)`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </article>
    </>
  );
};

DormtrakRanking.propTypes = {
  token: PropTypes.string.isRequired,
};

DormtrakRanking.defaultProps = {};

const mapStateToProps = (state) => ({
  token: getToken(state),
});

export default connect(mapStateToProps)(DormtrakRanking);
