// React Imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getToken } from "../../../selectors/auth";

// API imports
import { getDormtrakRankings } from "../../../api/dormtrak";
import { checkAndHandleError } from "../../../lib/general";
import { Link } from "react-router5";

const DormtrakRanking = ({ token }) => {
  const [dormInfo, updateDormsInfo] = useState(null);

  useEffect(() => {
    const loadRankings = async () => {
      const rankingsResponse = await getDormtrakRankings(token);

      if (checkAndHandleError(rankingsResponse)) {
        updateDormsInfo(rankingsResponse.data.data);
      }
    };

    loadRankings();
  }, [token]);

  const times = [];
  for (let i = 0; i < 3; i += 1) {
    times.push(0);
  }

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
            {dormInfo
              ? times.map((element, index) => {
                  const a = dormInfo.maxMeanSingleSize[index];
                  const b = dormInfo.minMeanSingleSize[index];
                  return (
                    <tr key={b.averageSingleArea + a.averageSingleArea}>
                      <td>
                        <Link
                          routeName="dormtrak.dorms"
                          routeParams={{ dormID: a.id }}
                        >
                          {a.name}
                        </Link>
                        <br />
                        {`(${a.averageSingleArea} sq. ft.)`}
                      </td>
                      <td>
                        <Link
                          routeName="dormtrak.dorms"
                          routeParams={{ dormID: b.id }}
                        >
                          {b.name}
                        </Link>
                        <br />
                        {`(${b.averageSingleArea} sq. ft.)`}
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>

        <table>
          <tbody>
            <tr>
              <th>Biggest Singles</th>
              <th>Smallest Singles</th>
            </tr>
            {dormInfo
              ? times.map((element, index) => {
                  const a = dormInfo.biggestSingles[index];
                  const b = dormInfo.smallestSingles[index];
                  return (
                    <tr key={a.area}>
                      <td>
                        <Link
                          routeName="dormtrak.dorms"
                          routeParams={{ dormID: a.dormID }}
                        >
                          {`${a.dorm.name} ${a.number}`}
                        </Link>
                        <br />
                        {`(${a.area} sq. ft.)`}
                      </td>
                      <td>
                        <Link
                          routeName="dormtrak.dorms"
                          routeParams={{ dormID: b.dormID }}
                        >
                          {`${b.dorm.name} ${b.number}`}
                        </Link>
                        <br />
                        {`(${b.area} sq. ft.)`}
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>

        <table>
          <tbody>
            <tr>
              <th>Max Mean Double Size</th>
              <th>Min Mean Double Size</th>
            </tr>
            {dormInfo
              ? times.map((element, index) => {
                  const a = dormInfo.maxMeanDoubleSize[index];
                  const b = dormInfo.minMeanDoubleSize[index];
                  return (
                    <tr key={a.averageDoubleArea}>
                      <td>
                        <Link
                          routeName="dormtrak.dorms"
                          routeParams={{ dormID: a.id }}
                        >
                          {a.name}
                        </Link>
                        <br />
                        {`(${a.averageDoubleArea} sq. ft.)`}
                      </td>
                      <td>
                        <Link
                          routeName="dormtrak.dorms"
                          routeParams={{ dormID: a.id }}
                        >
                          {b.name}
                        </Link>
                        <br />
                        {`(${b.averageDoubleArea} sq. ft.)`}
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>

        <table>
          <tbody>
            <tr>
              <th>Biggest Doubles</th>
              <th>Smallest Doubles</th>
            </tr>

            {dormInfo
              ? times.map((element, index) => {
                  const a = dormInfo.biggestDoubles[index];
                  const b = dormInfo.smallestDoubles[index];
                  return (
                    <tr key={a.area}>
                      <td>
                        <Link
                          routeName="dormtrak.dorms"
                          routeParams={{ dormID: a.dormID }}
                        >
                          {`${a.dorm.name} ${a.number}`}
                        </Link>
                        <br />
                        {`(${a.area} sq. ft.)`}
                      </td>
                      <td>
                        <Link
                          routeName="dormtrak.dorms"
                          routeParams={{ dormID: b.dormID }}
                        >
                          {`${b.dorm.name} ${b.number}`}
                        </Link>
                        <br />
                        {`(${b.area} sq. ft.)`}
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>

        <table>
          <tbody>
            <tr>
              <th>Most Singles</th>
              <th>Most Doubles</th>
            </tr>

            {dormInfo
              ? times.map((element, index) => {
                  const a = dormInfo.mostSingles[index];
                  const b = dormInfo.mostDoubles[index];
                  return (
                    <tr key={a.numberSingles}>
                      <td>
                        <Link
                          routeName="dormtrak.dorms"
                          routeParams={{ dormID: a.id }}
                        >
                          {a.name}
                        </Link>
                        <br />
                        {`(${a.numberSingles})`}
                      </td>
                      <td>
                        <Link
                          routeName="dormtrak.dorms"
                          routeParams={{ dormID: b.id }}
                        >
                          {b.name}
                        </Link>
                        <br />
                        {`(${b.numberDoubles})`}
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>

        <table>
          <tbody>
            <tr>
              <th>Most bathrooms</th>
              <th>Fewest bathrooms</th>
            </tr>

            {dormInfo
              ? times.map((element, index) => {
                  const a = dormInfo.mostBathrooms[index];
                  const b = dormInfo.fewestBathrooms[index];
                  return (
                    <tr key={a.bathroomRatio}>
                      <td>
                        <Link
                          routeName="dormtrak.dorms"
                          routeParams={{ dormID: a.id }}
                        >
                          {a.name}
                        </Link>
                        <br />
                        {`(${a.bathroomRatio.toPrecision(3)}:1)`}
                      </td>
                      <td>
                        <Link
                          routeName="dormtrak.dorms"
                          routeParams={{ dormID: b.id }}
                        >
                          {b.name}
                        </Link>
                        <br />
                        {`(${b.bathroomRatio.toPrecision(3)}:1)`}
                      </td>
                    </tr>
                  );
                })
              : null}
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
