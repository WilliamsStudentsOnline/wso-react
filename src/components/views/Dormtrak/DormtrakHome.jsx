// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DormtrakRanking from "./DormtrakRanking";
import DormtrakRecentComments from "./DormtrakRecentComments";

// Redux imports
import { connect } from "react-redux";
import { getAPI, getCurrUser } from "../../../selectors/auth";

// Additional imports
import { Link } from "react-router5";

const DormtrakHome = ({ api, currUser }) => {
  const [reviews, updateReviews] = useState(null);

  useEffect(() => {
    const loadReviews = async () => {
      const queryParams = {
        limit: 10,
        preload: ["dormRoom", "dorm"],
        commented: true,
      };
      try {
        const dormReviewResponse = await api.dormtrakService.listDormtrakDormReviews(
          queryParams
        );
        updateReviews(dormReviewResponse.data);
      } catch {
        // eslint-disable-next-line no-empty
      }
    };

    loadReviews();
  }, [api]);

  // Link to survey.
  const surveyLink = () => {
    if (currUser.dormRoomID) {
      return (
        <p>
          <strong>
            To fill out the survey, click{" "}
            <Link routeName="dormtrak.newReview">here</Link>
          </strong>
          .
        </p>
      );
    }
    return null;
  };

  return (
    <div className="container">
      <aside className="sidebar">
        <DormtrakRanking />
      </aside>

      <article className="main">
        <section className="lead">
          <h3>Welcome to Dormtrak</h3>
          <p>
            Dormtrak is a system where students can
            <Link routeName="dormtrak.policy">&nbsp;anonymously&nbsp;</Link>
            share their thoughts about dorm buildings and rooms, as well as find
            out everything there is to know about housing at Williams. Much of
            our information is pulled from surveys that students fill out, so by
            filling out the survey for your building, you help all of us make
            the most informed decision we can about where to live.
          </p>
          {surveyLink()}
        </section>
        <section>
          <DormtrakRecentComments
            abridged
            currUser={currUser}
            reviews={reviews}
          />
        </section>
      </article>
    </div>
  );
};

DormtrakHome.propTypes = {
  api: PropTypes.object.isRequired,
  currUser: PropTypes.object.isRequired,
};

DormtrakHome.defaultProps = {};

const mapStateToProps = (state) => ({
  api: getAPI(state),
  currUser: getCurrUser(state),
});

export default connect(mapStateToProps)(DormtrakHome);
