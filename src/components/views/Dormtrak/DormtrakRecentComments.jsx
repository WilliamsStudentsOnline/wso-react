// React imports
import React from "react";
import PropTypes from "prop-types";

// Additional imports
import { Link } from "react-router5";
import { avatarHelper } from "../../../lib/imageHelper";
import { format } from "timeago.js";
import { userTypeStudent } from "../../../constants/general";

const DormtrakRecentComments = ({ reviews, abridged, currUser }) => {
  // Renders the Edit/Delete buttons
  const editDeleteButtons = (review) => {
    if (
      currUser.type === userTypeStudent &&
      (currUser.id === review.userID || currUser.admin)
    ) {
      return (
        <p className="comment-detail">
          <Link
            routeName="dormtrak.editReview"
            routeParams={{ reviewID: review.id }}
          >
            edit
          </Link>
          &nbsp;|&nbsp;
          <a
            data-confirm="Are you sure you want to delete your review?"
            rel="nofollow"
            data-method="delete"
            href={`/dormtrak/reviews/${review.id}`}
          >
            delete
          </a>
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
            <Link
              routeName="dormtrak.dorms"
              routeParams={{ dormID: review.dormRoom.dorm.id }}
            >
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
        <p className="comment-detail">{editDeleteButtons(review)}</p>
      </div>
    );
  };

  // Render comment
  const renderComment = (review) => {
    if (abridged) {
      return renderAbridgedComment(review);
    }

    return renderFullComment(review);
  };
  return (
    <>
      <h3>Recent Comments</h3>
      <br />
      {reviews.map((review) => renderComment(review))}
    </>
  );
};

DormtrakRecentComments.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.object),
  abridged: PropTypes.bool.isRequired,
  currUser: PropTypes.object.isRequired,
};

DormtrakRecentComments.defaultProps = {
  reviews: [],
};

export default DormtrakRecentComments;
