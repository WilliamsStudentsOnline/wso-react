// React imports
import React from 'react';
import PropTypes from 'prop-types';
import DormtrakLayout from './DormtrakLayout';

const DormtrakNeighborhood = ({
  neighborhood,
  neighborhoods,
  authToken,
  notice,
  warning,
  currentUser,
}) => {
  return (
    <DormtrakLayout
      neighborhoods={neighborhoods}
      authToken={authToken}
      notice={notice}
      warning={warning}
      currentUser={currentUser}
    >
      <article className="facebook-results">
        <section>
          <table>
            <thead>
              <tr>
                <th>Building</th>
                <th>Singles</th>
                <th>Doubles</th>
                <th>Flexes</th>
                <th>Seniors</th>
                <th>Juniors</th>
                <th>Sophomores</th>
              </tr>
            </thead>
            <tbody>
              {neighborhood.dorms.map(dorm => (
                <tr key={dorm.id}>
                  <td>
                    <a href={`/dormtrak/dorms/${dorm.name}`}>{dorm.name}</a>
                  </td>
                  <td>{dorm.number_singles}</td>
                  <td>{dorm.number_doubles}</td>
                  <td>{dorm.number_flex}</td>
                  <td>{dorm.students.seniors}</td>
                  <td>{dorm.students.juniors}</td>
                  <td>{dorm.students.sophomores}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </article>
    </DormtrakLayout>
  );
};

DormtrakNeighborhood.propTypes = {
  neighborhood: PropTypes.object.isRequired,
  authToken: PropTypes.string.isRequired,
  neighborhoods: PropTypes.arrayOf(PropTypes.object).isRequired,
  notice: PropTypes.string,
  warning: PropTypes.string,
  currentUser: PropTypes.object,
};

DormtrakNeighborhood.defaultProps = {
  currentUser: {},
  notice: '',
  warning: '',
};

export default DormtrakNeighborhood;
