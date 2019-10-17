// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux/routing imports
import { connect } from "react-redux";
import { getToken } from "../../../selectors/auth";

// Additional imports
import { checkAndHandleError } from "../../../lib/general";
import { getEphcatchMatches } from "../../../api/ephcatch";
import Ephcatcher from "./Ephcatcher";

const EphcatchMatch = ({ token }) => {
  const [matches, updateMatches] = useState([]);

  useEffect(() => {
    const loadMatches = async () => {
      const ephcatchersResponse = await getEphcatchMatches(token);
      if (checkAndHandleError(ephcatchersResponse)) {
        updateMatches(ephcatchersResponse.data.data);
      }
    };

    loadMatches();
  }, [token]);

  const renderMatches = () => {
    if (matches.length === 0)
      return <h1 className="no-matches-found">No matches.</h1>;

    return (
      <section>
        <h3>Matches</h3>

        <div className="grid-wrap">
          {matches.map((match) => (
            <Ephcatcher ephcatcher={match} token={token} />
          ))}
        </div>
      </section>
    );
  };

  return <article className="facebook-results">{renderMatches()}</article>;
};

EphcatchMatch.propTypes = { token: PropTypes.string.isRequired };

EphcatchMatch.defaultProps = {};

const mapStateToProps = (state) => ({
  token: getToken(state),
});

export default connect(mapStateToProps)(EphcatchMatch);
