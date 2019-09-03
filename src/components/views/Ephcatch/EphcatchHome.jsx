// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { getToken } from "../../../selectors/auth";
import {
  getEphcatchers,
  likeEphcatcher,
  unlikeEphcatcher,
  getEphcatcher,
} from "../../../api/ephcatch";

import { checkAndHandleError } from "../../../lib/general";

const EphcatchHome = ({ token }) => {
  const perPage = 20; // Number of results per page
  const [page, updatePage] = useState(0);
  const [total, updateTotal] = useState(0);

  const [ephcatchers, updateEphcatchers] = useState([]);

  const loadNextEphcatchers = async (newPage) => {
    const params = {
      limit: perPage,
      offset: newPage * perPage,
    };
    const ephcatchersResponse = await getEphcatchers(token, params);

    if (checkAndHandleError(ephcatchersResponse)) {
      updateEphcatchers(ephcatchersResponse.data.data);
      updateTotal(ephcatchersResponse.data.paginationTotal);
    }
  };

  useEffect(() => {
    loadNextEphcatchers(0);
  }, []);

  const selectEphcatcher = async (event, index) => {
    // Alternatively, use the classname to determine the method to be called.
    // That way works but is more hacky, and very prone to user editing the code.
    const ephcatcher = ephcatchers[index];
    const target = event.currentTarget;
    let ephcatchersResponse;

    if (ephcatcher.liked) {
      ephcatchersResponse = await unlikeEphcatcher(token, ephcatcher.id);
      target.className = "ephcatch-select-link";
    } else {
      ephcatchersResponse = await likeEphcatcher(token, ephcatcher.id);
      target.className = "ephcatch-select-link ephcatch-selected";
    }

    if (checkAndHandleError(ephcatchersResponse)) {
      const updatedEphcatcher = await getEphcatcher(token, ephcatcher.id);

      if (checkAndHandleError(updatedEphcatcher)) {
        ephcatchers.splice(index, 1, updatedEphcatcher.data.data);
      }
    }
  };

  const clickHandler = (number) => {
    if (number === -1 && page > 0) {
      updatePage(page - 1);
      loadNextEphcatchers(page - 1);
    } else if (number === 1 && total - (page + 1) * perPage > 0) {
      updatePage(page + 1);
      loadNextEphcatchers(page + 1);
    }
  };

  return (
    <article className="facebook-results">
      <section>
        <div className="grid-wrap">
          <p>
            Select as many people as you want by clicking on their profile. You
            can also come back later and modify your selections. To check if you
            have matches, click &ldquo;Matches&rdquo; above or refresh the page.
            Have fun, and good luck!
            <br />
            <strong>Note:</strong>
            &nbsp;You can&apos;t see yourself in the list below, but everyone
            else can.
          </p>
          <br />
          <div>
            {/* @TODO: nicer buttons */}
            <button
              type="button"
              onClick={() => clickHandler(-1)}
              disabled={page === 0}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => clickHandler(1)}
              disabled={total - (page + 1) * perPage <= 0}
            >
              Next
            </button>
          </div>
          <br />
          {ephcatchers.map((ephcatcher, index) => (
            <aside
              key={ephcatcher.id}
              className={
                ephcatcher.liked
                  ? "ephcatch-select-link ephcatch-selected"
                  : "ephcatch-select-link"
              }
              onClick={(event) => selectEphcatcher(event, index)}
              role="presentation"
            >
              <div className="third">
                <div className="profile-photo">
                  <img alt="profile" src={`/pic/${ephcatcher.unixID}`} />
                </div>
              </div>
              <div className="two-thirds">
                <h4>{ephcatcher.name}</h4>
              </div>
            </aside>
          ))}
        </div>
      </section>
    </article>
  );
};

EphcatchHome.propTypes = {
  token: PropTypes.string.isRequired,
};

EphcatchHome.defaultProps = {};

const mapStateToProps = (state) => ({
  token: getToken(state),
});

export default connect(mapStateToProps)(EphcatchHome);
