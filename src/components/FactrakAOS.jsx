// React imports
import React from 'react';
import PropTypes from 'prop-types';
import FactrakLayout from './FactrakLayout';

const FactrakAOS = ({
  areaOfStudy,
  professors,
  currentUser,
  authToken,
  notice,
  warning,
}) => {
  const aos = areaOfStudy;
  const profs = professors;

  const sortedCourses = aos.courses.sort((a, b) => {
    if (a.number < b.number) return -1;
    if (a.number > b.number) return 1;
    return 0;
  });

  return (
    <FactrakLayout
      currentUser={currentUser}
      authToken={authToken}
      notice={notice}
      warning={warning}
    >
      <article className="factrak-home">
        <section className="margin-vertical-small">
          <h3>{aos.name}</h3>
          {profs.length > 0 ? (
            <>
              <br />
              <h4>{`Professors in ${aos.name}`}</h4>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Title</th>
                    <th className="unix-column">Unix</th>
                  </tr>
                </thead>
                <tbody>
                  {profs.map(prof => (
                    <tr key={prof.unix_id}>
                      <td>
                        <a href={`/factrak/professors/${prof.id}`}>
                          {prof.name}
                        </a>
                      </td>

                      <td>{prof.title}</td>
                      <td>{prof.unix_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : null}
        </section>

        <section className="margin-vertical-small">
          <h4>Courses</h4>
          <table>
            <thead>
              <tr>
                <th className="col-20">Course</th>
                <th className="col-80">Professors</th>
              </tr>
            </thead>
            <tbody>
              {sortedCourses.map(course => (
                <tr key={course.name}>
                  <td className="col-20">
                    <a href={`/factrak/courses/${course.id}`}>{course.name}</a>
                  </td>
                  <td className="col-80">
                    {course.professors.map(prof => {
                      return (
                        <a
                          href={`/factrak/courses/${course.id}?prof=${prof.id}`}
                        >
                          {prof.name}
                        </a>
                      );
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </article>
    </FactrakLayout>
  );
};

FactrakAOS.propTypes = {
  areaOfStudy: PropTypes.string.isRequired,
  professors: PropTypes.string.isRequired,
  currentUser: PropTypes.object,
  authToken: PropTypes.string.isRequired,
  notice: PropTypes.string,
  warning: PropTypes.string,
};

FactrakAOS.defaultProps = {
  notice: '',
  warning: '',
  currentUser: {},
};

export default FactrakAOS;
