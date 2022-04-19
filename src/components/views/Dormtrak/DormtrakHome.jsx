// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DormtrakRanking from "./DormtrakRanking";
import DormtrakRecentComments from "./DormtrakRecentComments";
import Button from "../../Components";

// Redux imports
import { connect } from "react-redux";
import { getWSO, getCurrUser } from "../../../selectors/auth";
import { actions } from "redux-router5";

// Additional imports
import { Link } from "react-router5";

const DormtrakHome = ({ currUser, navigateTo, wso }) => {
  const [reviews, updateReviews] = useState(null);
  const [userReviewID, updateUserReviewID] = useState(null);
  useEffect(() => {
    let isMounted = true;
    const loadReviews = async () => {
      const reviewQueryParams = {
        limit: 10,
        preload: ["dormRoom", "dorm"],
        commented: true,
      };
      const currentUserReviewQueryParams = {
        userID: currUser.id,
        dormRoomID: currUser.dormRoomID,
      };
      try {
        const dormReviewResponse = await wso.dormtrakService.listReviews(
          reviewQueryParams
        );
        const currentUserReviewResponse = await wso.dormtrakService.listReviews(
          currentUserReviewQueryParams
        );
        if (isMounted) {
          updateReviews(dormReviewResponse.data);
          if (currentUserReviewResponse.data.length > 0) {
            updateUserReviewID(currentUserReviewResponse.data[0].id);
          } else {
            updateUserReviewID(null);
          }
        }
      } catch (error) {
        navigateTo("error", { error });
      }
    };

    loadReviews();

    return () => {
      isMounted = false;
    };
  }, [navigateTo, wso]);

  const deleteHandler = async (reviewID) => {
    // eslint-disable-next-line no-restricted-globals, no-alert
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      await wso.dormtrakService.deleteReview(reviewID);
      updateReviews(reviews.filter((review) => review.id !== reviewID));
      updateUserReviewID(null);
    } catch (error) {
      // eslint-disable-next-line no-empty
    }
  };

  // Link to survey.
  const surveyLink = () => {
    if (currUser.dormRoomID) {
      return userReviewID ? (
        <p>
          <Button
            onClick={() =>
              navigateTo("dormtrak.editReview", {
                reviewID: userReviewID,
              })
            }
            className="inline-button"
          >
            Edit
          </Button>

          <Button
            onClick={() => deleteHandler(userReviewID)}
            className="inline-button"
          >
            Delete
          </Button>
        </p>
      ) : (
        <Link routeName="dormtrak.newReview">
          <button type="button">Review Dorm Room</button>
        </Link>
      );
    }
    return (
      <p>
        <strong>
          You are unable to review a dorm room right now as there is no room
          under your name. Try again later.
        </strong>
      </p>
    );
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
            updateUserReviewID={updateUserReviewID}
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
