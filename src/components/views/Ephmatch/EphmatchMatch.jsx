// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux/routing imports
import { connect } from "react-redux";
import { getToken } from "../../../selectors/auth";

// Additional imports
import { checkAndHandleError } from "../../../lib/general";
import { getEphmatchMatches } from "../../../api/ephmatch";
import Ephmatcher from "./Ephmatcher";

const EphmatchMatch = ({ token }) => {
  const [matches, updateMatches] = useState([]);

  useEffect(() => {
    const loadMatches = async () => {
      const ephmatchersResponse = await getEphmatchMatches(token);
      if (checkAndHandleError(ephmatchersResponse)) {
        updateMatches(ephmatchersResponse.data.data);
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
        <p>These Ephs have matched with you! Start the conversation!</p>
        <div className="ephmatch-results">
          {matches.map((match) => (
            <Ephmatcher
              ephmatcher={match.other}
              ephmatcherProfile={match.other.ephmatchProfile}
              token={token}
              key={match.id}
            />
          ))}
        </div>
      </section>
    );
  };

  return <article className="facebook-results">{renderMatches()}</article>;
};

EphmatchMatch.propTypes = { token: PropTypes.string.isRequired };

EphmatchMatch.defaultProps = {};

const mapStateToProps = (state) => ({
  token: getToken(state),
});

export default connect(mapStateToProps)(EphmatchMatch);
