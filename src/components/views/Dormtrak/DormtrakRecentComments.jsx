// React imports
import React from "react";
import PropTypes from "prop-types";
import { Paragraph, Line, Photo } from "../../Skeleton";

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
        <span className="comment-detail">{editDeleteButtons(review)}</span>
      </div>
    );
  };

  // Render comment
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
    if (!reviews) {
      if (abridged)
        return [...Array(15)].map((_, i) => abridgedCommentSkeleton(i));
      return [...Array(15)].map((_, i) => fullCommentSkeleton(i));
    }

    if (reviews.length > 0)
      return reviews.map((review) => renderComment(review));

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
  reviews: PropTypes.arrayOf(PropTypes.object),
  abridged: PropTypes.bool.isRequired,
  currUser: PropTypes.object.isRequired,
};

DormtrakRecentComments.defaultProps = {
  reviews: null,
};

export default DormtrakRecentComments;
