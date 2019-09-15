// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DormtrakRanking from "./DormtrakRanking";
import DormtrakRecentComments from "./DormtrakRecentComments";

// Redux imports
import { connect } from "react-redux";
import { getToken, getCurrUser } from "../../../selectors/auth";

// Additional imports
import { checkAndHandleError } from "../../../lib/general";
import { getDormtrakDormReviews } from "../../../api/dormtrak";
import { Link } from "react-router5";

const DormtrakHome = ({ currUser, token }) => {
  const [reviews, updateReviews] = useState([]);

  useEffect(() => {
    const loadReviews = async () => {
      const queryParams = {
        limit: 10,
        preload: ["dormRoom", "dorm"],
        commented: true,
      };
      const dormReviewResponse = await getDormtrakDormReviews(
        token,
        queryParams
      );

      if (checkAndHandleError(dormReviewResponse)) {
        updateReviews(dormReviewResponse.data.data);
      }
    };

    loadReviews();
  }, [token]);

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

          <p>
            <strong>
              To fill out the survey, click{" "}
              {/* @TODO: does new review automatically know what dorm to fill in? */}
              <Link routeName="dormtrak.newReview">here</Link>
            </strong>
            .
          </p>
        </section>
        <section>
          {
            <DormtrakRecentComments
              abridged
              currUser={currUser}
              reviews={reviews}
            />
          }
        </section>
      </article>
    </div>
  );
};

DormtrakHome.propTypes = {
  currUser: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
};

DormtrakHome.defaultProps = {};

const mapStateToProps = (state) => ({
  token: getToken(state),
  currUser: getCurrUser(state),
});

export default connect(mapStateToProps)(DormtrakHome);
