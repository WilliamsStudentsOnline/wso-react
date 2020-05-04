// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import PaginationButtons from "../../PaginationButtons";
import Select from "../../Select";

// Redux/ routing imports
import { connect } from "react-redux";
import { getAPI } from "../../../selectors/auth";

// Additional imports
import Ephmatcher from "./Ephmatcher";

const EphmatchHome = ({ api }) => {
  const perPage = 20; // Number of results per page
  const [page, updatePage] = useState(0);
  const [total, updateTotal] = useState(0);
  const [ephmatchers, updateEphmatchers] = useState([]);
  const [sort, updateSort] = useState("new"); // TODO(CORONA): was "alphabetical" but changing to create surge of craziness for classes cancelled

  useEffect(() => {
    let isMounted = true;

    const loadNextEphmatchers = async (newPage) => {
      const params = {
        limit: perPage,
        offset: newPage * perPage,
        preload: ["tags"],
        sort,
      };

      try {
        const ephmatchersResponse = await api.ephmatchService.getEphmatchProfiles(
          params
        );

        if (isMounted) {
          updateEphmatchers(ephmatchersResponse.data);
          updateTotal(ephmatchersResponse.paginationTotal);
        }
      } catch {
        // eslint-disable-next-line no-empty
      }
    };

    loadNextEphmatchers(page);

    return () => {
      isMounted = false;
    };
  }, [api, page, sort]);

  const selectEphmatcher = async (event, index) => {
    // Alternatively, use the classname to determine the method to be called.
    // That way works but is more hacky.
    const ephmatcher = ephmatchers[index];
    const target = event.currentTarget;

    try {
      if (ephmatcher.liked) {
        await api.ephmatchService.unlikeEphmatcher(ephmatcher.userID);
        target.className = "ephmatch-select-link";
      } else {
        await api.ephmatchService.likeEphmatcher(ephmatcher.userID);
        target.className = "ephmatch-select-link ephmatch-selected";
      }
      const updatedEphmatcher = await api.ephmatchService.getEphmatchProfile(
        ephmatcher.userID
      );

      ephmatchers.splice(index, 1, updatedEphmatcher.data);
    } catch {
      // eslint-disable-next-line
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
              <div className="added-sort">
                <strong>Sort By:</strong>
                <Select
                  onChange={(event) => {
                    updateSort(event.target.value);
                  }}
                  options={["Newest First", "Alphabetical (A-Z)"]}
                  value={sort}
                  valueList={["new", "alphabetical"]}
                  style={{
                    display: "inline",
                    margin: "5px 0px 5px 20px",
                    padding: "4px",
                  }}
                />
              </div>
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
                        api={api}
                        ephmatcher={ephmatcher.user}
                        ephmatcherProfile={ephmatcher}
                        selectEphmatcher={selectEphmatcher}
                        index={index}
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
  api: PropTypes.object.isRequired,
};

EphmatchHome.defaultProps = {};

const mapStateToProps = (state) => ({
  api: getAPI(state),
});

export default connect(mapStateToProps)(EphmatchHome);
