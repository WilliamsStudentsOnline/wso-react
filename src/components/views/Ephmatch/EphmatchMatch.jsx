// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux/routing imports
import { connect } from "react-redux";
import { getWSO } from "../../../selectors/auth";
import { useNavigate } from "react-router-dom";

// Additional imports
import Ephmatcher from "./Ephmatcher";

const EphmatchMatch = ({ wso }) => {
  const navigateTo = useNavigate();
  const [matches, updateMatches] = useState([]);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const ephmatchersResponse = await wso.ephmatchService.listMatches();
        updateMatches(ephmatchersResponse.data);
      } catch (error) {
        navigateTo("/error", { replace: true, state: { error } });
      }
    };

    loadMatches();
  }, [wso]);

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
  wso: PropTypes.object.isRequired,
};

EphmatchMatch.defaultProps = {};

const mapStateToProps = (state) => ({
  wso: getWSO(state),
});

export default connect(mapStateToProps)(EphmatchMatch);
