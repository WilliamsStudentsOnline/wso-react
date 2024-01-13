// React imports
import React, { useEffect, useState } from "react";
import { Line, Paragraph, Photo } from "../../Skeleton";
import { Button } from "../../Components";

// redux imports
import { useAppSelector } from "../../../lib/store";
import { getCurrUser, getWSO } from "../../../lib/authSlice";

// Additional imports
import { avatarHelper } from "../../../lib/imageHelper";
import { userTypeStudent } from "../../../constants/general";
import { Link, useNavigate } from "react-router-dom";
import { format } from "timeago.js";
import { ModelsDormtrakReview } from "wso-api-client/lib/services/types";

const DormtrakRecentComments = ({
  abridged,
  reviews,
  updateUserReviewID = undefined,
}: {
  updateUserReviewID?: React.Dispatch<React.SetStateAction<number | undefined>>;
  abridged: boolean;
  reviews: ModelsDormtrakReview[];
}) => {
  const wso = useAppSelector(getWSO);
  const currUser = useAppSelector(getCurrUser);
  const navigateTo = useNavigate();
  const [currReviews, updateCurrReviews] = useState<ModelsDormtrakReview[]>([]);

  useEffect(() => {
    updateCurrReviews(reviews);
  }, [reviews]);

  const deleteHandler = async (reviewID: number) => {
    // eslint-disable-next-line no-restricted-globals, no-alert
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      await wso.dormtrakService.deleteReview(reviewID);
      updateCurrReviews(currReviews.filter((review) => review.id !== reviewID));

      if (updateUserReviewID) {
        updateUserReviewID(undefined);
      }
    } catch (error) {
      // eslint-disable-next-line no-empty
    }
  };

  const editDeleteButtons = (review: ModelsDormtrakReview) => {
    if (currUser?.type === userTypeStudent && currUser.id === review.userID) {
      return (
        <p>
          <Button
            onClick={() => navigateTo(`/dormtrak/reviews/edit/${review.id}`)}
            className="inline-button"
          >
            Edit
          </Button>

          <Button
            // We need to fix the API so it never returns undefined ids
            onClick={() => (review.id ? deleteHandler(review.id) : null)}
            className="inline-button"
          >
            Delete
          </Button>
        </p>
      );
    }
    return null;
  };

  // Renders an abridged comment
  const renderAbridgedComment = (review: ModelsDormtrakReview) => {
    if (
      review.dormRoom?.dorm?.name &&
      review.dormRoom.dorm.id &&
      review.comment &&
      review.createdTime
    )
      return (
        <div className="comment" key={review.id}>
          <div className="comment-image">
            <img
              alt="dorm avatar"
              src={avatarHelper(review.dormRoom.dorm.name)}
            />
          </div>

          <div className="comment-content">
            <h1>
              <Link to={`/dormtrak/dorms/${review.dormRoom.dorm.id}`}>
                {review.dormRoom.dorm.name}
              </Link>
            </h1>

            <p>{review.comment.substring(0, 200)}</p>
            <p className="comment-detail">
              {`Posted ${format(new Date(review.createdTime))}`}
            </p>
            {editDeleteButtons(review)}
          </div>
        </div>
      );
    return null;
  };

  // Render Full Comment
  const renderFullComment = (review: ModelsDormtrakReview) => {
    if (review.createdTime) {
      return (
        <div className="comment" key={review.id}>
          <p>{review.comment}</p>
          <p className="comment-detail">
            {`posted about ${format(new Date(review.createdTime))}`}
          </p>
          <span className="comment-detail">{editDeleteButtons(review)}</span>
        </div>
      );
    }
    return null;
  };

  const renderComment = (review: ModelsDormtrakReview) => {
    if (abridged) return renderAbridgedComment(review);

    return renderFullComment(review);
  };

  const fullCommentSkeleton = (key: React.Key) => {
    return (
      <div className="comment" key={key}>
        <Paragraph numRows={4} />
        <br />
        <div className="comment-detail">
          <Line width="30%" />
        </div>
      </div>
    );
  };

  const abridgedCommentSkeleton = (key: React.Key) => {
    return (
      <div className="comment" key={key}>
        <div className="comment-image">
          <Photo width="6em" height="2em" />
        </div>

        <div className="comment-content">
          <h1>
            <Line width="25%" />
          </h1>

          <Paragraph numRows={1} />
          <Line width="28%" />
        </div>
      </div>
    );
  };

  const renderCommentList = () => {
    if (currReviews.length === 0) {
      if (abridged)
        return [...Array(15)].map((_, i) => abridgedCommentSkeleton(i));
      return [...Array(15)].map((_, i) => fullCommentSkeleton(i));
    }

    if (currReviews.length > 0)
      return currReviews.map((review) => renderComment(review));

    return "None Yet.";
  };

  return (
    <>
      <h3>Recent Comments</h3>
      <br />
      {renderCommentList()}
    </>
  );
};

export default DormtrakRecentComments;
