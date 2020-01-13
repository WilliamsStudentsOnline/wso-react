// React imports
import React from "react";
import PropTypes from "prop-types";

// Redux/routing imports
import { connect } from "react-redux";
import { getToken } from "../../../selectors/auth";

// Additional imports
import Ephcatcher from "./Ephcatcher";

const EphcatchMatch = ({ token, matches }) => {
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

EphcatchMatch.propTypes = {
  token: PropTypes.string.isRequired,
  matches: PropTypes.arrayOf(PropTypes.object),
};

EphcatchMatch.defaultProps = { matches: [] };

const mapStateToProps = (state) => ({
  token: getToken(state),
});

export default connect(mapStateToProps)(EphcatchMatch);
