// React imports
import React from "react";
import PropTypes from "prop-types";

const FactrakSearch = ({ profs, courses }) => {
  const profList = profs;
  const courseList = courses.sort((a, b) => {
    if (a.number < b.number) return -1;
    if (a.number > b.number) return 1;
    return 0;
  });

  const professorDisplay = () => {
    if (!profList || profList.length === 0) return null;
    return (
      <section className="margin-vertical-small">
        <br />
        <h4>Professors</h4>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th className="unix-column">Unix</th>
              <th>Office</th>
            </tr>
          </thead>
          <tbody>
            {profList.map((prof) => {
              // Doesn't check for existence of professor in LDAP.
              return (
                <tr key={prof.name}>
                  <td>
                    <a href={`/factrak/professors/${prof.id}`}>{prof.name}</a>
                  </td>
                  <td>{prof.unix_id || ""}</td>
                  <td>{prof.room || ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    );
  };
  const courseDisplay = () => {
    if (!courseList || courseList.length === 0) return null;
    return (
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
            {courseList.map((course) => {
              return (
                <tr key={course.id}>
                  <td className="col-20">
                    <a href={`/factrak/courses/${course.id}`}>{course.name}</a>{" "}
                  </td>
                  <td className="col-80">
                    {course.professors.map((prof) => (
                      <a
                        key={`${course.id}?prof=${prof.id}`}
                        href={`/factrak/courses/${course.id}?prof=${prof.id}`}
                      >
                        {prof.name}
                      </a>
                    ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    );
  };
  return (
    <article className="factrak-home">
      {professorDisplay()}
      {courseDisplay()}
    </article>
  );
};

FactrakSearch.propTypes = {
  profs: PropTypes.arrayOf(PropTypes.object).isRequired,
  courses: PropTypes.arrayOf(PropTypes.object).isRequired,
};

FactrakSearch.defaultProps = {};

export default FactrakSearch;
