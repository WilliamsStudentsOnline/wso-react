// React imports
import React from "react";
import PropTypes from "prop-types";

const DormtrakSearch = ({ dorms }) => {
  return (
    <article className="facebook-results">
      <section>
        {dorms.length === 0 ? (
          <>
            <br />
            <h1 className="no-matches-found">No matches were found.</h1>
          </>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Building</th>
                <th>Neighborhood</th>
              </tr>
            </thead>
            <tbody>
              {dorms.map((dorm) => (
                <tr key={dorm.id}>
                  <td>
                    <a href={`/dormtrak/dorms/${dorm.name}`}>{dorm.name}</a>
                  </td>

                  <td>
                    <a href={`/dormtrak/hoods/${dorm.neighborhood_name}`}>
                      {dorm.neighborhood_name}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </article>
  );
};

DormtrakSearch.propTypes = {
  dorms: PropTypes.arrayOf(PropTypes.object).isRequired,
};

DormtrakSearch.defaultProps = {};

export default DormtrakSearch;
