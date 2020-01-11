// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import PaginationButtons from "../../PaginationButtons";

// Redux/ routing imports
import { connect } from "react-redux";
import { getToken } from "../../../selectors/auth";

// Additional imports
import {
  getEphmatchProfiles,
  likeEphmatcher,
  unlikeEphmatcher,
  getEphmatchProfile,
} from "../../../api/ephmatch";
import { checkAndHandleError } from "../../../lib/general";
import Ephmatcher from "./Ephmatcher";

const EphmatchHome = ({ token }) => {
  const perPage = 20; // Number of results per page
  const [page, updatePage] = useState(0);
  const [total, updateTotal] = useState(0);
  const [ephmatchers, updateEphmatchers] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadNextEphmatchers = async (newPage) => {
      const params = {
        limit: perPage,
        offset: newPage * perPage,
      };
      const EphmatchersResponse = await getEphmatchProfiles(token, params);

      if (checkAndHandleError(EphmatchersResponse) && isMounted) {
        updateEphmatchers(EphmatchersResponse.data.data);
        updateTotal(EphmatchersResponse.data.paginationTotal);
      }
    };
    loadNextEphmatchers(page);

    return () => {
      isMounted = false;
    };
  }, [page, token]);

  const selectEphmatcher = async (event, index) => {
    // Alternatively, use the classname to determine the method to be called.
    // That way works but is more hacky, and very prone to user editing the code.
    const ephmatcher = ephmatchers[index];
    const target = event.currentTarget;
    let ephmatchersResponse;

    if (ephmatcher.liked) {
      ephmatchersResponse = await unlikeEphmatcher(token, ephmatcher.userID);
      target.className = "ephcatch-select-link";
    } else {
      ephmatchersResponse = await likeEphmatcher(token, ephmatcher.userID);
      target.className = "ephcatch-select-link ephcatch-selected";
    }

    if (checkAndHandleError(ephmatchersResponse)) {
      const updatedEphmatcher = await getEphmatchProfile(
        token,
        ephmatcher.userID
      );

      if (checkAndHandleError(updatedEphmatcher)) {
        ephmatchers.splice(index, 1, updatedEphmatcher.data.data);
      }
    }
  };

  // Handles clicking of pagination buttons
  const clickHandler = (number) => {
    if (number === -1 && page > 0) {
      updatePage(page - 1);
    } else if (number === 1 && total - (page + 1) * perPage > 0) {
      updatePage(page + 1);
    }
  };

  // Handles selection of page
  const selectionHandler = (newPage) => {
    updatePage(newPage - 1);
  };

  return (
    <article className="facebook-results">
      <section>
        <div>
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

          {ephmatchers.length > 0 ? (
            <>
              <PaginationButtons
                selectionHandler={selectionHandler}
                clickHandler={clickHandler}
                page={page}
                total={total}
                perPage={perPage}
                showPages
              />
              <div className="ephmatch-results">
                {ephmatchers.map(
                  (ephmatcher, index) =>
                    ephmatcher.user && (
                      <Ephmatcher
                        ephmatcher={ephmatcher.user}
                        ephmatcherProfile={ephmatcher}
                        selectEphmatcher={selectEphmatcher}
                        index={index}
                        token={token}
                        key={ephmatcher.id}
                      />
                    )
                )}
              </div>
              <br />
              <PaginationButtons
                selectionHandler={selectionHandler}
                clickHandler={clickHandler}
                page={page}
                total={total}
                perPage={perPage}
                showPages
              />
            </>
          ) : (
            <h1 className="no-matches-found">
              Invite your friends to join Ephmatch!
            </h1>
          )}
        </div>
      </section>
    </article>
  );
};

EphmatchHome.propTypes = {
  token: PropTypes.string.isRequired,
};

EphmatchHome.defaultProps = {};

const mapStateToProps = (state) => ({
  token: getToken(state),
});

export default connect(mapStateToProps)(EphmatchHome);
