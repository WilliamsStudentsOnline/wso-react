// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import PaginationButtons from "../../PaginationButtons";

// Redux/ routing imports
import { connect } from "react-redux";
import { getToken, getCurrUser } from "../../../selectors/auth";

// Additional imports
import {
  getEphmatchProfiles,
  likeEphmatcher,
  unlikeEphmatcher,
  getEphmatchProfile,
} from "../../../api/ephmatch";
import { checkAndHandleError } from "../../../lib/general";
import Ephmatcher from "./Ephmatcher";

const EphmatchHome = ({ token, currUser }) => {
  const perPage = 20; // Number of results per page
  const [page, updatePage] = useState(0);
  const [total, updateTotal] = useState(0);

  const [ephmatchers, updateEphmatchers] = useState([]);

  const loadNextEphmatchers = async (newPage) => {
    const params = {
      limit: perPage,
      offset: newPage * perPage,
    };
    const EphmatchersResponse = await getEphmatchProfiles(token, params);

    if (checkAndHandleError(EphmatchersResponse)) {
      updateEphmatchers(EphmatchersResponse.data.data);
      updateTotal(EphmatchersResponse.data.paginationTotal);
    }
  };

  useEffect(() => {
    loadNextEphmatchers(0);
    // eslint-disable-next-line
  }, []);

  const selectEphmatcher = async (event, index) => {
    // Alternatively, use the classname to determine the method to be called.
    // That way works but is more hacky, and very prone to user editing the code.
    const ephmatcher = ephmatchers[index];
    const target = event.currentTarget;
    let ephmatchersResponse;

    if (ephmatcher.liked) {
      ephmatchersResponse = await unlikeEphmatcher(token, ephmatcher.id);
      target.className = "Ephmatch-select-link";
    } else {
      ephmatchersResponse = await likeEphmatcher(token, ephmatcher.id);
      target.className = "Ephmatch-select-link Ephmatch-selected";
    }

    if (checkAndHandleError(ephmatchersResponse)) {
      const updatedEphmatcher = await getEphmatchProfile(token, ephmatcher.id);

      if (checkAndHandleError(updatedEphmatcher)) {
        ephmatchers.splice(index, 1, updatedEphmatcher.data.data);
      }
    }
  };

  // Handles clicking of pagination buttons
  const clickHandler = (number) => {
    if (number === -1 && page > 0) {
      updatePage(page - 1);
      loadNextEphmatchers(page - 1);
    } else if (number === 1 && total - (page + 1) * perPage > 0) {
      updatePage(page + 1);
      loadNextEphmatchers(page + 1);
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
          <PaginationButtons
            clickHandler={clickHandler}
            page={page}
            total={total}
            perPage={perPage}
          />

          <br />
          {ephmatchers.map((ephmatcher, index) =>
            ephmatcher.userId === currUser.id ? (
              <Ephmatcher
                ephmatcher={ephmatcher.user}
                selectEphmatcher={selectEphmatcher}
                index={index}
                token={token}
                key={ephmatcher.id}
              />
            ) : null
          )}
        </div>
      </section>
    </article>
  );
};

EphmatchHome.propTypes = {
  token: PropTypes.string.isRequired,
  currUser: PropTypes.object.isRequired,
};

EphmatchHome.defaultProps = {};

const mapStateToProps = (state) => ({
  token: getToken(state),
  currUser: getCurrUser(state),
});

export default connect(mapStateToProps)(EphmatchHome);
