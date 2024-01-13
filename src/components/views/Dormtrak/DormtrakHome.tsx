// React imports
import React, { useState, useEffect } from "react";
import DormtrakRanking from "./DormtrakRanking";
import DormtrakRecentComments from "./DormtrakRecentComments";
import { Button } from "../../Components";

// Redux imports
import { useAppSelector } from "../../../lib/store";
import { getWSO, getCurrUser } from "../../../lib/authSlice";

// Additional imports
import { Link, useNavigate } from "react-router-dom";
import { ModelsDormtrakReview } from "wso-api-client/lib/services/types";

const DormtrakHome = () => {
  const currUser = useAppSelector(getCurrUser);
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();

  const [reviews, updateReviews] = useState<ModelsDormtrakReview[]>([]);
  const [userReviewID, updateUserReviewID] = useState<number | undefined>(
    undefined
  );
  useEffect(() => {
    let isMounted = true;
    const loadReviews = async () => {
      const reviewQueryParams = {
        limit: 10,
        preload: ["dormRoom", "dorm"],
        commented: true,
      };
      const currentUserReviewQueryParams = {
        userID: currUser?.id,
        dormRoomID: currUser?.dormRoomID,
      };
      try {
        const dormReviewResponse = await wso.dormtrakService.listReviews(
          reviewQueryParams
        );
        const currentUserReviewResponse = await wso.dormtrakService.listReviews(
          currentUserReviewQueryParams
        );
        if (isMounted) {
          updateReviews(dormReviewResponse.data ?? []);
          if (
            currentUserReviewResponse.data?.length &&
            currentUserReviewResponse.data.length > 0
          ) {
            updateUserReviewID(currentUserReviewResponse.data[0].id);
          } else {
            updateUserReviewID(undefined);
          }
        }
      } catch (error) {
        navigateTo("/error", { replace: true, state: error });
      }
    };

    loadReviews();

    return () => {
      isMounted = false;
    };
  }, [wso]);

  const deleteHandler = async (reviewID: number) => {
    // eslint-disable-next-line no-restricted-globals, no-alert
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      await wso.dormtrakService.deleteReview(reviewID);
      updateReviews(reviews.filter((review) => review.id !== reviewID));
      updateUserReviewID(undefined);
    } catch (error) {
      // eslint-disable-next-line no-empty
    }
  };

  // Link to survey.
  const surveyLink = () => {
    if (currUser?.dormRoomID) {
      return userReviewID ? (
        <p>
          <Button
            onClick={() => navigateTo(`/dormtrak/reviews/edit/${userReviewID}`)}
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
        <Link to="/dormtrak/reviews/new">
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
            <Link to="/dormtrak/policy">&nbsp;anonymously&nbsp;</Link>
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
            reviews={reviews}
          />
        </section>
      </article>
    </div>
  );
};

export default DormtrakHome;
