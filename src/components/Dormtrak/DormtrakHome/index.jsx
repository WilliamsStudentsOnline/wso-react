// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DormtrakRanking from "../DormtrakRanking";
import DormtrakRecentComments from "../DormtrakRecentComments";

// Redux imports
import { connect } from "react-redux";
import { getWSO, getCurrUser } from "../../../selectors/auth";
import { actions } from "redux-router5";

// Additional imports
import styles from "./DormtrakHome.module.scss";

const DormtrakHome = ({ currUser, navigateTo, wso }) => {
  const [reviews, updateReviews] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadReviews = async () => {
      const queryParams = {
        limit: 10,
        preload: ["dormRoom", "dorm", "neighborhood"],
        commented: true,
      };
      try {
        const dormReviewResponse = await wso.dormtrakService.listReviews(
          queryParams
        );
        if (isMounted) {
          updateReviews(dormReviewResponse.data);
        }
      } catch {
        navigateTo("500");
      }
    };

    loadReviews();

    return () => {
      isMounted = false;
    };
  }, [navigateTo, wso]);

  return (
    <div className={styles.container}>
      <div>
        <DormtrakRecentComments
          className={styles.recentComments}
          abridged
          currUser={currUser}
          reviews={reviews}
        />
      </div>

      <div>
        <DormtrakRanking className={styles.rankings} />
      </div>
    </div>
  );
};

DormtrakHome.propTypes = {
  currUser: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  wso: PropTypes.object.isRequired,
};

DormtrakHome.defaultProps = {};

const mapStateToProps = (state) => ({
  currUser: getCurrUser(state),
  wso: getWSO(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DormtrakHome);
