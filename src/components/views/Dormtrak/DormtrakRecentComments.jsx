// React imports
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Line, Paragraph, Photo } from "../../Skeleton";
import Button from "../../Components";

// redux imports
import { useAppSelector } from "../../../lib/store";
import { getWSO } from "../../../lib/authSlice";

// Additional imports
import { avatarHelper } from "../../../lib/imageHelper";
import { userTypeStudent } from "../../../constants/general";
import { Link, useNavigate } from "react-router-dom";
import { format } from "timeago.js";

const DormtrakRecentComments = ({
  updateUserReviewID,
  abridged,
  currUser,
  reviews,
}) => {
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();
  const [currReviews, updateCurrReviews] = useState(null);

  useEffect(() => {
    updateCurrReviews(reviews);
  }, [reviews]);

  const deleteHandler = async (reviewID) => {
    // eslint-disable-next-line no-restricted-globals, no-alert
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      await wso.dormtrakService.deleteReview(reviewID);
      updateCurrReviews(currReviews.filter((review) => review.id !== reviewID));
      updateUserReviewID(null);
    } catch (error) {
      // eslint-disable-next-line no-empty
    }
  };

  const editDeleteButtons = (review) => {
    if (currUser.type === userTypeStudent && currUser.id === review.userID) {
      return (
        <p>
          <Button
            onClick={() => navigateTo(`/reviews/edit/${review.id}`)}
            className="inline-button"
          >
            Edit
          </Button>

          <Button
            onClick={() => deleteHandler(review.id)}
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
  const renderAbridgedComment = (review) => {
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
            <Link to={`dormtrak/dorms/${review.dormRoom.dorm.ID}`}>
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
  };

  // Render Full Comment
  const renderFullComment = (review) => {
    return (
      <div className="comment" key={review.id}>
        <p>{review.comment}</p>
        <p className="comment-detail">
          {`posted about ${format(new Date(review.createdTime))}`}
        </p>
        <span className="comment-detail">{editDeleteButtons(review)}</span>
      </div>
    );
  };

  const renderComment = (review) => {
    if (abridged) return renderAbridgedComment(review);

    return renderFullComment(review);
  };

  const fullCommentSkeleton = (key) => {
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

  const abridgedCommentSkeleton = (key) => {
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
    if (!currReviews) {
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

DormtrakRecentComments.propTypes = {
  abridged: PropTypes.bool.isRequired,
  currUser: PropTypes.object.isRequired,
  reviews: PropTypes.arrayOf(PropTypes.object),
  wso: PropTypes.object.isRequired,
  updateUserReviewID: PropTypes.func.isRequired,
};

DormtrakRecentComments.defaultProps = {
  reviews: null,
};

export default DormtrakRecentComments;
