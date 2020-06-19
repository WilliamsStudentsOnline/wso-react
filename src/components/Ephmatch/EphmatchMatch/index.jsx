// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux/routing imports
import { connect } from "react-redux";
import { getWSO } from "../../../selectors/auth";
import { actions } from "redux-router5";

// Additional imports
import Ephmatcher from "../Ephmatcher";

const EphmatchMatch = ({ navigateTo, wso }) => {
  const [matches, updateMatches] = useState([]);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const ephmatchersResponse = await wso.ephmatchService.listMatches();
        updateMatches(ephmatchersResponse.data);
      } catch {
        navigateTo("500");
      }
    };

    loadMatches();
  }, [navigateTo, wso]);

  const renderMatches = () => {
    if (matches.length === 0)
      return <h1 className="no-matches-found">No matches.</h1>;

    return (
      <section>
        <h3>Matches</h3>
        <p>These Ephs have matched with you! Start the conversation!</p>
        <br />
        <div className="ephmatch-results">
          {matches.map((match) => (
            <Ephmatcher
              ephmatcher={match.matchedUser}
              ephmatcherProfile={match.matchedUser.ephmatchProfile}
              matched
              key={match.id}
              wso={wso}
            />
          ))}
        </div>
      </section>
    );
  };

  return <article className="facebook-results">{renderMatches()}</article>;
};

EphmatchMatch.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  wso: PropTypes.object.isRequired,
};

EphmatchMatch.defaultProps = {};

const mapStateToProps = (state) => ({
  wso: getWSO(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EphmatchMatch);
