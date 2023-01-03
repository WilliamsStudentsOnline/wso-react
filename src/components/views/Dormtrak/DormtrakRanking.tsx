// React Imports
import React, { useState, useEffect } from "react";
import { Line } from "../../Skeleton";

// Redux imports
import { useAppSelector } from "../../../lib/store";
import { getWSO } from "../../../lib/authSlice";

// Additional imports
import { Link } from "react-router-dom";
import { ModelsDormtrakRanking } from "wso-api-client/lib/services/types";

const DormtrakRanking = () => {
  const wso = useAppSelector(getWSO);
  const [dormInfo, updateDormsInfo] = useState<
    ModelsDormtrakRanking | undefined
  >(undefined);

  const roundToTenth = (num: number) => {
    return (Math.round(num * 10) / 10).toFixed(1);
  };

  useEffect(() => {
    let isMounted = true;

    const loadRankings = async () => {
      try {
        const rankingsResponse = await wso.dormtrakService.getRankings();
        if (isMounted && rankingsResponse.data) {
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

  const rankingSkeleton = (key: React.Key) => (
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

  const DormLink = ({
    dormID,
    children,
  }: {
    dormID: number;
    children?: string;
  }) => {
    return (
      <Link to={`/dormtrak/dorms/${dormID}`}>
        {children}
        <br />
      </Link>
    );
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
              const a = dormInfo.bestSatisfaction
                ? dormInfo.bestSatisfaction[index]
                : undefined;
              const b = dormInfo.worstSatisfaction
                ? dormInfo.worstSatisfaction[index]
                : undefined;
              // round dorm satisfaction to nearest tenth
              const aSatisfaction = roundToTenth(a?.satisfaction ?? 0);
              const bSatisfaction = roundToTenth(b?.satisfaction ?? 0);
              return (
                a &&
                b && (
                  <tr key={a?.name}>
                    <td>
                      <DormLink dormID={a.id as number}>{a.name}</DormLink>
                      {`(${aSatisfaction} / 5.0)`}
                    </td>
                    <td>
                      <DormLink dormID={b?.id as number}>{b.name}</DormLink>
                      {`(${bSatisfaction} / 5.0)`}
                    </td>
                  </tr>
                )
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
              const a = dormInfo.bestLocation
                ? dormInfo.bestLocation[index]
                : undefined;
              const b = dormInfo.worstLocation
                ? dormInfo.worstLocation[index]
                : undefined;
              // round dorm locations to nearest tenth
              const aLocation = roundToTenth(a?.location ?? 0);
              const bLocation = roundToTenth(b?.location ?? 0);
              return (
                a &&
                b && (
                  <tr key={a.name}>
                    <td>
                      <DormLink dormID={a.id as number}>{a.name}</DormLink>
                      {`(${aLocation} / 5.0)`}
                    </td>
                    <td>
                      <DormLink dormID={b.id as number}>{b.name}</DormLink>
                      {`(${bLocation} / 5.0)`}
                    </td>
                  </tr>
                )
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
              const a = dormInfo.leastLoudness
                ? dormInfo.leastLoudness[index]
                : undefined;
              const b = dormInfo.mostLoudness
                ? dormInfo.mostLoudness[index]
                : undefined;
              // round dorm loudness to nearest tenth
              const aLoudness = roundToTenth(a?.loudness ?? 0);
              const bLoudness = roundToTenth(b?.loudness ?? 0);
              return (
                a &&
                b && (
                  <tr key={a.name}>
                    <td>
                      <DormLink dormID={a.id as number}>{a.name}</DormLink>
                      {`(${aLoudness} / 5.0)`}
                    </td>
                    <td>
                      <DormLink dormID={b.id as number}>{b.name}</DormLink>
                      {`(${bLoudness} / 5.0)`}
                    </td>
                  </tr>
                )
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
              const a = dormInfo.bestWifi
                ? dormInfo.bestWifi[index]
                : undefined;
              const b = dormInfo.worstWifi
                ? dormInfo.worstWifi[index]
                : undefined;
              // round dorm wifi to nearest tenth
              const aWifi = roundToTenth(a?.wifi ?? 0);
              const bWifi = roundToTenth(b?.wifi ?? 0);
              return (
                a &&
                b && (
                  <tr key={a.name}>
                    <td>
                      <DormLink dormID={a.id as number}>{a.name}</DormLink>
                      {`(${aWifi} / 5.0)`}
                    </td>
                    <td>
                      <DormLink dormID={b.id as number}>{b.name}</DormLink>
                      {`(${bWifi} / 5.0)`}
                    </td>
                  </tr>
                )
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

            const a = dormInfo.maxMeanSingleSize
              ? dormInfo.maxMeanSingleSize[index]
              : undefined;
            const b = dormInfo.minMeanSingleSize
              ? dormInfo.minMeanSingleSize[index]
              : undefined;
            return (
              a &&
              a.averageSingleArea &&
              b &&
              b.averageSingleArea && (
                <tr key={b.averageSingleArea + a.averageSingleArea}>
                  <td>
                    <DormLink dormID={a.id as number}>{a.name}</DormLink>
                    {`(${a.averageSingleArea} sq. ft.)`}
                  </td>
                  <td>
                    <DormLink dormID={b.id as number}>{b.name}</DormLink>
                    {`(${b.averageSingleArea} sq. ft.)`}
                  </td>
                </tr>
              )
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

            const a = dormInfo.biggestSingles
              ? dormInfo.biggestSingles[index]
              : undefined;
            const b = dormInfo.smallestSingles
              ? dormInfo.smallestSingles[index]
              : undefined;
            return (
              a &&
              b &&
              a.area &&
              b.area && (
                <tr key={a.area}>
                  <td>
                    <DormLink dormID={a.dormID as number}>
                      {`${a.dorm?.name} ${a.number}`}
                    </DormLink>
                    {`(${a.area} sq. ft.)`}
                  </td>
                  <td>
                    <DormLink dormID={b.dormID as number}>
                      {`${b.dorm?.name} ${b.number}`}
                    </DormLink>
                    {`(${b.area} sq. ft.)`}
                  </td>
                </tr>
              )
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

            const a = dormInfo.maxMeanDoubleSize
              ? dormInfo.maxMeanDoubleSize[index]
              : undefined;
            const b = dormInfo.minMeanDoubleSize
              ? dormInfo.minMeanDoubleSize[index]
              : undefined;
            return (
              a &&
              b &&
              a.averageDoubleArea &&
              b.averageDoubleArea && (
                <tr key={a.averageDoubleArea}>
                  <td>
                    <DormLink dormID={a.id as number}>{a.name}</DormLink>
                    {`(${a.averageDoubleArea} sq. ft.)`}
                  </td>
                  <td>
                    <DormLink dormID={b.id as number}>{b.name}</DormLink>
                    {`(${b.averageDoubleArea} sq. ft.)`}
                  </td>
                </tr>
              )
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

            const a = dormInfo.biggestDoubles
              ? dormInfo.biggestDoubles[index]
              : undefined;
            const b = dormInfo.smallestDoubles
              ? dormInfo.smallestDoubles[index]
              : undefined;
            return (
              a &&
              b && (
                <tr key={a.area}>
                  <td>
                    <DormLink dormID={a.id as number}>
                      {`${a.dorm?.name} ${a.number}`}
                    </DormLink>
                    {`(${a.area} sq. ft.)`}
                  </td>
                  <td>
                    <DormLink dormID={b.id as number}>
                      {`${b.dorm?.name} ${b.number}`}
                    </DormLink>
                    {`(${b.area} sq. ft.)`}
                  </td>
                </tr>
              )
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

            const a = dormInfo.mostSingles
              ? dormInfo.mostSingles[index]
              : undefined;
            const b = dormInfo.mostDoubles
              ? dormInfo.mostDoubles[index]
              : undefined;
            return (
              a &&
              b && (
                <tr key={a.numberSingles}>
                  <td>
                    <DormLink dormID={a.id as number}>{a.name}</DormLink>
                    {`(${a.numberSingles})`}
                  </td>
                  <td>
                    <DormLink dormID={b.id as number}>{b.name}</DormLink>
                    {`(${b.numberDoubles})`}
                  </td>
                </tr>
              )
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

            const a = dormInfo.mostBathrooms
              ? dormInfo.mostBathrooms[index]
              : undefined;
            const b = dormInfo.fewestBathrooms
              ? dormInfo.fewestBathrooms[index]
              : undefined;
            return (
              a &&
              b &&
              a.bathroomRatio &&
              b.bathroomRatio && (
                <tr key={a.bathroomRatio}>
                  <td>
                    <DormLink dormID={a.id as number}>{a.name}</DormLink>
                    {`(${a.bathroomRatio.toPrecision(3)}:1)`}
                  </td>
                  <td>
                    <DormLink dormID={b.id as number}>{b.name}</DormLink>
                    {`(${b.bathroomRatio.toPrecision(3)}:1)`}
                  </td>
                </tr>
              )
            );
          })}
        </tbody>
      </table>
    </article>
  );
};

export default DormtrakRanking;
