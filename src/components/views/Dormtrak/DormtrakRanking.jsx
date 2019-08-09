// React Imports
import React from "react";
import PropTypes from "prop-types";

const DormtrakRanking = ({ dormInfo, max }) => {
  const times = [];
  for (let i = 0; i < max; i += 1) {
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
            {times.map((element, index) => {
              const a = dormInfo.max_mean_singles[index];
              const b = dormInfo.min_mean_singles[index];
              return (
                <tr key={b.average_single_area + a.average_single_area}>
                  <td>
                    <a href={`/dormtrak/dorms/${a.name}`}>{a.name}</a>
                    <br />
                    {`(${a.average_single_area} sq. ft.)`}
                  </td>
                  <td>
                    <a href={`/dormtrak/dorms/${b.name}`}>{b.name}</a>
                    <br />
                    {`(${b.average_single_area} sq. ft.)`}
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
              const a = dormInfo.biggest_singles[index];
              const b = dormInfo.smallest_singles[index];
              return (
                <tr key={a.area}>
                  <td>
                    <a href={`/dormtrak/dorms/${a.dorm}`}>
                      {`${a.dorm} ${a.number}`}
                    </a>
                    <br />
                    {`(${a.area} sq. ft.)`}
                  </td>
                  <td>
                    <a href={`/dormtrak/dorms/${b.dorm}`}>
                      {`${b.dorm} ${b.number}`}
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
              const a = dormInfo.max_mean_doubles[index];
              const b = dormInfo.min_mean_doubles[index];
              return (
                <tr key={a.average_double_area}>
                  <td>
                    <a href={`/dormtrak/dorms/${a.name}`}>{a.name}</a>
                    <br />
                    {`(${a.average_double_area} sq. ft.)`}
                  </td>
                  <td>
                    <a href={`/dormtrak/dorms/${b.name}`}>{b.name}</a>
                    <br />
                    {`(${b.average_double_area} sq. ft.)`}
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
              const a = dormInfo.biggest_doubles[index];
              const b = dormInfo.smallest_doubles[index];
              return (
                <tr key={a.area}>
                  <td>
                    <a href={`/dormtrak/dorms/${a.dorm}`}>
                      {`${a.dorm} ${a.number}`}
                    </a>
                    <br />
                    {`(${a.area} sq. ft.)`}
                  </td>
                  <td>
                    <a href={`/dormtrak/dorms/${b.dorm}`}>
                      {`${b.dorm} ${b.number}`}
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
              const a = dormInfo.most_singles[index];
              const b = dormInfo.most_doubles[index];
              return (
                <tr key={a.number_singles}>
                  <td>
                    <a href={`/dormtrak/dorms/${a.name}`}>{a.name}</a>
                    <br />
                    {`(${a.number_singles})`}
                  </td>
                  <td>
                    <a href={`/dormtrak/dorms/${b.name}`}>{b.name}</a>
                    <br />
                    {`(${b.number_doubles})`}
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
              const a = dormInfo.most_bathrooms[index];
              const b = dormInfo.fewest_bathrooms[index];
              return (
                <tr key={a.bathroom_ratio}>
                  <td>
                    <a href={`/dormtrak/dorms/${a.name}`}>{a.name}</a>
                    <br />
                    {`(${a.bathroom_ratio.toPrecision(3)}:1)`}
                  </td>
                  <td>
                    <a href={`/dormtrak/dorms/${b.name}`}>{b.name}</a>
                    <br />
                    {`(${b.bathroom_ratio.toPrecision(3)}:1)`}
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
  max: PropTypes.number.isRequired,
  dormInfo: PropTypes.object.isRequired,
};

export default DormtrakRanking;
