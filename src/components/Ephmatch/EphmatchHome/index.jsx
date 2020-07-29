// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux/ routing imports
import { connect } from "react-redux";
import { getWSO } from "../../../selectors/auth";
import { actions } from "redux-router5";

// Additional imports
import Ephmatcher from "../Ephmatcher";
import styles from "./EphmatchHome.module.scss";
import { EuiButtonIcon } from "@elastic/eui";

const EphmatchHome = ({ navigateTo, wso }) => {
  const perPage = 1; // Number of results per page
  const [page, updatePage] = useState(0);
  const [total, updateTotal] = useState(0);
  const [ephmatcher, updateEphmatcher] = useState(null);
  // const [sort, updateSort] = useState("recommended");

  useEffect(() => {
    let isMounted = true;

    const loadNextEphmatchers = async (newPage) => {
      const params = {
        limit: 1,
        offset: newPage * perPage,
        preload: ["tags", "liked", "matched"],
        sort: "recommended",
      };

      try {
        const ephmatchersResponse = await wso.ephmatchService.listProfiles(
          params
        );

        if (isMounted && ephmatchersResponse?.data?.length > 0) {
          updateEphmatcher(ephmatchersResponse.data[0]);
          updateTotal(ephmatchersResponse.paginationTotal);
        }
      } catch {
        navigateTo("500");
      }
    };

    loadNextEphmatchers(page);

    return () => {
      isMounted = false;
    };
  }, [navigateTo, page, wso]);

  const selectEphmatcher = async (event) => {
    // Alternatively, use the classname to determine the method to be called.
    // That way works but is more hacky.
    const target = event.currentTarget;

    try {
      if (ephmatcher.liked) {
        await wso.ephmatchService.unlikeProfile(ephmatcher.userID);
        target.className = "ephmatch-select-link";
      } else {
        await wso.ephmatchService.likeProfile(ephmatcher.userID);
        target.className = "ephmatch-select-link ephmatch-selected";
      }
      const updatedEphmatcher = await wso.ephmatchService.getProfile(
        ephmatcher.userID
      );

      updateEphmatcher(updatedEphmatcher.data);

      // ephmatchers.splice(index, 1, updatedEphmatcher.data);
    } catch {
      navigateTo("500");
    }
  };

  // Handles clicking of pagination buttons
  const clickHandler = (number) => {
    if (number === -1 && page > 0) {
      updatePage(page - 1);
    } else if (number === 1 && total - (page + 1) * perPage > 0) {
      updatePage(page + 1);
    }
    window.scrollTo(0, 0);
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageContent}>
        <EuiButtonIcon
          onClick={() => clickHandler(-1)}
          iconType="arrowLeft"
          aria-label="Previous"
          disabled={page === 0}
          iconSize="xxl"
        />
        <div className={styles.info}>
          {ephmatcher ? (
            <Ephmatcher
              wso={wso}
              ephmatcher={ephmatcher.user}
              ephmatcherProfile={ephmatcher}
              selectEphmatcher={selectEphmatcher}
              index={0}
              matched={ephmatcher.matched}
              key={ephmatcher.id}
            />
          ) : (
            <h1 className="no-matches-found">
              Invite your friends to join Ephmatch!
            </h1>
          )}
        </div>
        <EuiButtonIcon
          onClick={() => clickHandler(1)}
          iconType="arrowRight"
          aria-label="Next"
          disabled={total - (page + 1) <= 0}
          iconSize="xxl"
        />
      </div>
    </div>
  );
};

EphmatchHome.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  wso: PropTypes.object.isRequired,
};

EphmatchHome.defaultProps = {};

const mapStateToProps = (state) => ({
  wso: getWSO(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EphmatchHome);
