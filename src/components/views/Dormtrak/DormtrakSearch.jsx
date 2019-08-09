// React imports
import React from "react";
import PropTypes from "prop-types";
import DormtrakLayout from "./DormtrakLayout";

const DormtrakSearch = ({
  dorms,
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
    </DormtrakLayout>
  );
};

DormtrakSearch.propTypes = {
  dorms: PropTypes.arrayOf(PropTypes.object).isRequired,
  authToken: PropTypes.string.isRequired,
  neighborhoods: PropTypes.arrayOf(PropTypes.object).isRequired,
  notice: PropTypes.string,
  warning: PropTypes.string,
  currentUser: PropTypes.object,
};

DormtrakSearch.defaultProps = {
  notice: "",
  warning: "",
  currentUser: {},
};

export default DormtrakSearch;
