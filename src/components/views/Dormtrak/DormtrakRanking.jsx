// React Imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Line } from "../../Skeleton";

// Redux imports
import { connect } from "react-redux";
import { getWSO } from "../../../selectors/auth";

// Additional imports
import { Link } from "react-router5";

const DormtrakRanking = ({ wso }) => {
  const [dormInfo, updateDormsInfo] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadRankings = async () => {
      try {
        const rankingsResponse = await wso.dormtrakService.getRankings();
        if (isMounted) {
          updateDormsInfo(rankingsResponse.data);
        }
      } catch {
        // Handle it by not doing anything for now;
      }
    };

    loadRankings();

    return () => {
      isMounted = false;
    };
  }, [wso]);

  const times = [0, 0, 0];
  const numRanked = times.length;

  const rankingSkeleton = (key) => (
    <tr key={key}>
      <td>
        <Line width="45%" />
        <br />
        <Line width="55%" />
      </td>
      <td>
        <Line width="45%" />
        <br />
        <Line width="55%" />
      </td>
    </tr>
  );

  const DormLink = ({ dormID, children }) => {
    return (
      <Link routeName="dormtrak.dorms" routeParams={{ dormID }}>
        {children}
        <br />
      </Link>
    );
  };

  DormLink.propTypes = {
    dormID: PropTypes.number.isRequired,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  };
  DormLink.defaultProps = {
    children: null,
  };

  return (
    <article className="dorm-ranks">
      <h3>Rankings</h3>
      {/* Only add satifaction rankings when at least one dorm is reviewed */}
      {dormInfo &&
      dormInfo.bestSatisfaction &&
      dormInfo.bestSatisfaction.length > 0 ? (
        <table>
          <tbody>
            <tr>
              <th>Most Satisfactory</th>
              <th>Least Satisfactory</th>
            </tr>
            {/* Only add at most 3 dorms the the rankings list */}
            {dormInfo.bestSatisfaction.slice(0, numRanked).map((_, index) => {
              const a = dormInfo.bestSatisfaction[index];
              const b = dormInfo.worstSatisfaction[index];
              return (
                <tr key={a.name}>
                  <td>
                    <DormLink dormID={a.id}>{a.name}</DormLink>
                    {`(${a.satisfaction} / 5)`}
                  </td>
                  <td>
                    <DormLink dormID={b.id}>{b.name}</DormLink>
                    {`(${b.satisfaction} / 5)`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : null}
      {/* Only add location rankings when at least one dorm is reviewed */}
      {dormInfo && dormInfo.bestLocation && dormInfo.bestLocation.length > 0 ? (
        <table>
          <tbody>
            <tr>
              <th>Best Location</th>
              <th>Worst Location</th>
            </tr>
            {/* Only add at most 3 dorms the the rankings list */}
            {dormInfo.bestLocation.slice(0, numRanked).map((_, index) => {
              const a = dormInfo.bestLocation[index];
              const b = dormInfo.worstLocation[index];
              return (
                <tr key={a.name}>
                  <td>
                    <DormLink dormID={a.id}>{a.name}</DormLink>
                    {`(${a.location} / 5)`}
                  </td>
                  <td>
                    <DormLink dormID={b.id}>{b.name}</DormLink>
                    {`(${b.location} / 5)`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : null}
      {/* Only add loudness rankings when at least one dorm is reviewed */}
      {dormInfo &&
      dormInfo.leastLoudness &&
      dormInfo.leastLoudness.length > 0 ? (
        <table>
          <tbody>
            <tr>
              <th>Quietest</th>
              <th>Loudest</th>
            </tr>
            {/* Only add at most 3 dorms the the rankings list */}
            {dormInfo.leastLoudness.slice(0, numRanked).map((_, index) => {
              const a = dormInfo.leastLoudness[index];
              const b = dormInfo.mostLoudness[index];
              return (
                <tr key={a.name}>
                  <td>
                    <DormLink dormID={a.id}>{a.name}</DormLink>
                    {`(${a.loudness} / 5)`}
                  </td>
                  <td>
                    <DormLink dormID={b.id}>{b.name}</DormLink>
                    {`(${b.loudness} / 5)`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : null}
      {/* Only add wifi rankings when at least one dorm is reviewed */}
      {dormInfo && dormInfo.bestWifi && dormInfo.bestWifi.length > 0 ? (
        <table>
          <tbody>
            <tr>
              <th>Best Wifi</th>
              <th>Worst Wifi</th>
            </tr>
            {/* Only add at most 3 dorms the the rankings list */}
            {dormInfo.bestWifi.slice(0, numRanked).map((_, index) => {
              const a = dormInfo.bestWifi[index];
              const b = dormInfo.worstWifi[index];
              return (
                <tr key={a.name}>
                  <td>
                    <DormLink dormID={a.id}>{a.name}</DormLink>
                    {`(${a.wifi} / 5)`}
                  </td>
                  <td>
                    <DormLink dormID={b.id}>{b.name}</DormLink>
                    {`(${b.wifi} / 5)`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : null}

      <table>
        <tbody>
          <tr>
            <th>Max Mean Single Size</th>
            <th>Min Mean Single Size</th>
          </tr>
          {times.map((_, index) => {
            if (!dormInfo) return rankingSkeleton(index);

            const a = dormInfo.maxMeanSingleSize[index];
            const b = dormInfo.minMeanSingleSize[index];
            return (
              <tr key={b.averageSingleArea + a.averageSingleArea}>
                <td>
                  <DormLink dormID={a.id}>{a.name}</DormLink>
                  {`(${a.averageSingleArea} sq. ft.)`}
                </td>
                <td>
                  <DormLink dormID={b.id}>{b.name}</DormLink>
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
          {times.map((_, index) => {
            if (!dormInfo) return rankingSkeleton(index);

            const a = dormInfo.biggestSingles[index];
            const b = dormInfo.smallestSingles[index];
            return (
              <tr key={a.area}>
                <td>
                  <DormLink dormID={a.dormID}>
                    {`${a.dorm.name} ${a.number}`}
                  </DormLink>
                  {`(${a.area} sq. ft.)`}
                </td>
                <td>
                  <DormLink dormID={b.dormID}>
                    {`${b.dorm.name} ${b.number}`}
                  </DormLink>
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
          {times.map((_, index) => {
            if (!dormInfo) return rankingSkeleton(index);

            const a = dormInfo.maxMeanDoubleSize[index];
            const b = dormInfo.minMeanDoubleSize[index];
            return (
              <tr key={a.averageDoubleArea}>
                <td>
                  <DormLink dormID={a.id}>{a.name}</DormLink>
                  {`(${a.averageDoubleArea} sq. ft.)`}
                </td>
                <td>
                  <DormLink dormID={b.id}>{b.name}</DormLink>
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

          {times.map((_, index) => {
            if (!dormInfo) return rankingSkeleton(index);

            const a = dormInfo.biggestDoubles[index];
            const b = dormInfo.smallestDoubles[index];
            return (
              <tr key={a.area}>
                <td>
                  <DormLink dormID={a.id}>
                    {`${a.dorm.name} ${a.number}`}
                  </DormLink>
                  {`(${a.area} sq. ft.)`}
                </td>
                <td>
                  <DormLink dormID={b.id}>
                    {`${b.dorm.name} ${b.number}`}
                  </DormLink>
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

          {times.map((_, index) => {
            if (!dormInfo) return rankingSkeleton(index);

            const a = dormInfo.mostSingles[index];
            const b = dormInfo.mostDoubles[index];
            return (
              <tr key={a.numberSingles}>
                <td>
                  <DormLink dormID={a.id}>{a.name}</DormLink>
                  {`(${a.numberSingles})`}
                </td>
                <td>
                  <DormLink dormID={b.id}>{b.name}</DormLink>
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

          {times.map((_, index) => {
            if (!dormInfo) return rankingSkeleton(index);

            const a = dormInfo.mostBathrooms[index];
            const b = dormInfo.fewestBathrooms[index];
            return (
              <tr key={a.bathroomRatio}>
                <td>
                  <DormLink dormID={a.id}>{a.name}</DormLink>
                  {`(${a.bathroomRatio.toPrecision(3)}:1)`}
                </td>
                <td>
                  <DormLink dormID={b.id}>{b.name}</DormLink>
                  {`(${b.bathroomRatio.toPrecision(3)}:1)`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </article>
  );
};

DormtrakRanking.propTypes = {
  wso: PropTypes.object.isRequired,
};

DormtrakRanking.defaultProps = {};

const mapStateToProps = (state) => ({
  wso: getWSO(state),
});

export default connect(mapStateToProps)(DormtrakRanking);
