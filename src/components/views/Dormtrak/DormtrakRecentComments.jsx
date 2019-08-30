// React imports
import React from "react";
import PropTypes from "prop-types";

import { Link } from "react-router5";

import { avatarHelper } from "../../../lib/imageHelper";

const DormtrakRecentComments = ({ reviews, abridged, currUser }) => {
  const renderComment = (review) => {
    return (
      <div className="comment" key={review.id}>
        {abridged && review.dormRoom ? (
          <div className="comment-image">
            <img
              alt="dorm avatar"
              src={avatarHelper(review.dormRoom.dorm.name)}
            />
          </div>
        ) : null}

        <div className="comment-content">
          {abridged && review.dormRoom ? (
            <h1>
              <Link
                routeName="dormtrak.dorms"
                routeParams={{ dormID: review.dormRoom.dorm.id }}
              >
                {review.dormRoom.dorm.name}
              </Link>
            </h1>
          ) : null}

          <p>{abridged ? review.comment.substring(0, 200) : review.comment}</p>
          <p className="comment-detail">
            {`Posted ${new Date(review.createdTime).toDateString()}`}
          </p>
          <p className="comment-detail">
            {currUser.type === "Student" ||
            (currUser.id === review.userID || currUser.admin) ? (
              <>
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
              </>
            ) : null}
          </p>
        </div>
      </div>
    );
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
