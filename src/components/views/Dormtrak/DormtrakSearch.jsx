// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux/ Routing imports
import { connect } from "react-redux";
import { getWSO } from "../../../selectors/auth";
import { Link, useSearchParams } from "react-router-dom";

const DormtrakSearch = ({ wso }) => {
  const [searchParams] = useSearchParams();

  const [dorms, updateDorms] = useState(null);

  useEffect(() => {
    const loadDorms = async () => {
      const queryParams = {
        q: searchParams?.get("q"),
        preload: ["neighborhood"],
      };

      try {
        const dormsResponse = await wso.dormtrakService.listDorms(queryParams);
        updateDorms(dormsResponse.data.sort((a, b) => a.name > b.name));
      } catch {
        updateDorms([]);
      }
    };

    loadDorms();
  }, [wso, searchParams?.get("q")]);

  return (
    <article className="facebook-results">
      <section>
        {!dorms || dorms.length === 0 ? (
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
                    <Link to={`/dormtrak/dorms/${dorm.id}`}>{dorm.name}</Link>
                  </td>

                  <td>
                    <Link
                      to={`/dormtrak/neighborhoods/${dorm.neighborhood.id}`}
                    >
                      {dorm.neighborhood.name}
                    </Link>
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
  wso: PropTypes.object.isRequired,
};

DormtrakSearch.defaultProps = {};

const mapStateToProps = () => {
  return (state) => ({
    wso: getWSO(state),
  });
};

export default connect(mapStateToProps)(DormtrakSearch);
