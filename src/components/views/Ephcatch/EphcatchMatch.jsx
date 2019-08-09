// React imports
import React from "react";
import PropTypes from "prop-types";
import EphcatchLayout from "./EphcatchLayout";

const EphcatchMatch = ({ matches, currentUser, warning, notice }) => {
  const renderMatches = () => {
    if (matches.length === 0)
      return <h1 className="no-matches-found">No matches.</h1>;

    return (
      <>
        <h3>Matches</h3>

        <div className="grid-wrap">
          {matches.map((match) => (
            <aside>
              <div className="third">
                <div className="profile-photo">
                  <img alt="match" src={`/pic/${match.unix_id}`} />
                </div>
              </div>
              <div className="two-third">
                <h4>{match.name}</h4>

                {match.unix_id && match.email ? (
                  <ul>
                    <li className="list-headers">UNIX</li>
                    <li className="list-contents">{match.unix_id}</li>
                  </ul>
                ) : null}
              </div>
            </aside>
          ))}
        </div>
      </>
    );
  };

  return (
    <EphcatchLayout currentUser={currentUser} warning={warning} notice={notice}>
      <article className="facebook-results">
        <section>{renderMatches()}</section>
      </article>
    </EphcatchLayout>
  );
};

EphcatchMatch.propTypes = {
  matches: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentUser: PropTypes.object.isRequired,
  notice: PropTypes.string,
  warning: PropTypes.string,
};

EphcatchMatch.defaultProps = {
  notice: "",
  warning: "",
};

export default EphcatchMatch;
