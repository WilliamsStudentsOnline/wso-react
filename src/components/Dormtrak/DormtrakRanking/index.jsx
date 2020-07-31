// React Imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Line } from "../../common/Skeleton";

// Redux imports
import { connect } from "react-redux";
import { getWSO } from "../../../selectors/auth";

// Additional imports
import { Link } from "react-router5";
import styles from "./DormtrakRanking.module.scss";

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
    <section>
      <h3>Facts</h3>

      <table>
        <tbody>
          <tr>
            <th className={styles.left}>Max Mean Single</th>
            <th className={styles.right}>Min Mean Single</th>
          </tr>
          {times.map((_, index) => {
            if (!dormInfo) return rankingSkeleton(index);

            const a = dormInfo.maxMeanSingleSize[index];
            const b = dormInfo.minMeanSingleSize[index];
            return (
              <tr key={b.averageSingleArea + a.averageSingleArea}>
                <td>
                  <DormLink dormID={a.id}>
                    <span className={styles.dormName}>{a.name}</span>
                  </DormLink>
                  {`(${a.averageSingleArea} sq. ft.)`}
                </td>
                <td>
                  <DormLink dormID={b.id}>
                    <span className={styles.dormName}>{b.name}</span>
                  </DormLink>
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
            <th className={styles.left}>Biggest Singles</th>
            <th className={styles.right}>Smallest Singles</th>
          </tr>
          {times.map((_, index) => {
            if (!dormInfo) return rankingSkeleton(index);

            const a = dormInfo.biggestSingles[index];
            const b = dormInfo.smallestSingles[index];
            return (
              <tr key={a.area}>
                <td>
                  <DormLink dormID={a.dormID}>
                    <span
                      className={styles.dormName}
                    >{`${a.dorm.name} ${a.number}`}</span>
                  </DormLink>
                  {`(${a.area} sq. ft.)`}
                </td>
                <td>
                  <DormLink dormID={b.dormID}>
                    <span
                      className={styles.dormName}
                    >{`${b.dorm.name} ${b.number}`}</span>
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
            <th className={styles.left}>Max Mean Double Size</th>
            <th className={styles.right}>Min Mean Double Size</th>
          </tr>
          {times.map((_, index) => {
            if (!dormInfo) return rankingSkeleton(index);

            const a = dormInfo.maxMeanDoubleSize[index];
            const b = dormInfo.minMeanDoubleSize[index];
            return (
              <tr key={a.averageDoubleArea}>
                <td>
                  <DormLink dormID={a.id}>
                    <span className={styles.dormName}>{a.name}</span>
                  </DormLink>
                  {`(${a.averageDoubleArea} sq. ft.)`}
                </td>
                <td>
                  <DormLink dormID={b.id}>
                    <span className={styles.dormName}>{b.name}</span>
                  </DormLink>
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
            <th className={styles.left}>Biggest Doubles</th>
            <th className={styles.right}>Smallest Doubles</th>
          </tr>

          {times.map((_, index) => {
            if (!dormInfo) return rankingSkeleton(index);

            const a = dormInfo.biggestDoubles[index];
            const b = dormInfo.smallestDoubles[index];
            return (
              <tr key={a.area}>
                <td>
                  <DormLink dormID={a.id}>
                    <span
                      className={styles.dormName}
                    >{`${a.dorm.name} ${a.number}`}</span>
                  </DormLink>
                  {`(${a.area} sq. ft.)`}
                </td>
                <td>
                  <DormLink dormID={b.id}>
                    <span
                      className={styles.dormName}
                    >{`${b.dorm.name} ${b.number}`}</span>
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
            <th className={styles.left}>Most Singles</th>
            <th className={styles.right}>Most Doubles</th>
          </tr>

          {times.map((_, index) => {
            if (!dormInfo) return rankingSkeleton(index);

            const a = dormInfo.mostSingles[index];
            const b = dormInfo.mostDoubles[index];
            return (
              <tr key={a.numberSingles}>
                <td>
                  <DormLink dormID={a.id}>
                    <span className={styles.dormName}>{a.name}</span>
                  </DormLink>
                  {`(${a.numberSingles})`}
                </td>
                <td>
                  <DormLink dormID={b.id}>
                    <span className={styles.dormName}>{b.name}</span>
                  </DormLink>
                  {`(${b.numberDoubles})`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* <table>
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
      </table> */}
    </section>
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
