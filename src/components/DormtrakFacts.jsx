// React imports
import React from 'react';
import PropTypes from 'prop-types';

// External Imports
import { Chart } from 'react-google-charts';

const DormtrakFacts = ({ dorm }) => {
  const capitalize = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <article className="home">
      <h3>Facts</h3>

      {dorm.neighborhood_name !== 'First-year' ? (
        <div>
          <strong>Class breakdown</strong>
:
          <div id="piechart">
            <Chart
              id="piechart"
              chartType="PieChart"
              data={[
                ['Class', '% of residents'],
                ['Seniors', dorm.students.seniors],
                ['Juniors', dorm.students.juniors],
                ['Sophomores', dorm.students.sophomores],
              ]}
              options={{
                legend: 'none',
                chartArea: { width: '75%', height: '80%' },
                backgroundColor: 'transparent',
                pieSliceText: 'label',
                pieSliceTextStyle: { color: 'black', fontSize: 8 },
              }}
            />
          </div>
        </div>
      ) : null}

      <div>
        <strong>Seniors</strong>
        {`: ${dorm.students.seniors}`}
        <br />
      </div>

      <div>
        <strong>Juniors</strong>
        {`: ${dorm.students.juniors}`}
        <br />
      </div>

      <div>
        <strong>Sophomores</strong>
        {`: ${dorm.students.sophomores}`}
        <br />
      </div>
      <div>
        <strong>Capacity</strong>
        {`: ${dorm.capacity}`}
        <br />
      </div>

      <div>
        <strong>Singles</strong>
        {`: ${dorm.number_singles}`}
        <br />
      </div>

      <div>
        <strong>Mean Single Size</strong>
        {`: ${dorm.average_single_area} sq. ft.`}
        <br />
      </div>

      <div>
        <strong>Most Common Single Size</strong>
        {`: ${dorm.mode_single_area} sq. ft.`}
        <br />
      </div>

      <div>
        <strong>Biggest Single</strong>
        {`: ${dorm.biggest_single.number}`}
        <br />
      </div>

      <div>
        <strong>Smallest Single</strong>
        {`: ${dorm.smallest_single.number}`}
        <br />
      </div>

      <div>
        <strong>Doubles</strong>
        {`: ${dorm.number_doubles}`}
        <br />
      </div>

      {dorm.number_doubles > 0 ? (
        <>
          <div>
            <strong>Mean Double Size</strong>
            {`: ${dorm.average_double_area} sq. ft.`}
            <br />
          </div>
          <div>
            <strong>Most Common Double Size</strong>
            {`: ${dorm.mode_double_area} sq. ft.`}
            <br />
          </div>
          <div>
            <strong>Biggest Double</strong>
            {`: ${dorm.biggest_double.number}`}
            <br />
          </div>
          <div>
            <strong>Smallest Double</strong>
            {`: ${dorm.smallest_double.number}`}
            <br />
          </div>
        </>
      ) : null}

      <div>
        <strong>Flexs</strong>
        {`: ${dorm.number_flex}`}
        <br />
      </div>

      <div>
        <strong>Student-bathroom ratio</strong>
        {`: ${dorm.bathroom_ratio.toPrecision(3)}:1`}
        <br />
      </div>
      <div>
        <strong>Common rooms</strong>
        {`: ${dorm.common_room_access}`}
        <br />
      </div>
      <div>
        <strong>Washers</strong>
        {`: ${dorm.number_washers}`}
        <br />
      </div>
      <div>
        <strong>Average Ratings for&nbsp;:</strong>
        {['wifi', 'location', 'loudness', 'satisfaction'].map(attr => {
          if (!dorm[attr]) return null;
          return `${capitalize(attr)}: ${dorm[attr]}`;
        })}
      </div>
    </article>
  );
};

DormtrakFacts.propTypes = {
  dorm: PropTypes.object.isRequired,
};

export default DormtrakFacts;
