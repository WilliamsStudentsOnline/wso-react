// React imports
import React from "react";
import PropTypes from "prop-types";

const DormtrakRecentComments = ({ reviews, abridged, currentUser }) => {
  const renderComment = (review) => {
    return (
      <div className="comment" key={review.id}>
        {abridged ? (
          <div className="comment-image">
            <img alt="dorm" src={`/assets/avatars/${review.dorm.name}.png`} />
          </div>
        ) : null}

        <div className="comment-content">
          {abridged ? (
            <h1>
              <a href={`/dormtrak/dorms/${review.dorm.name}`}>
                {review.dorm.name}
              </a>
            </h1>
          ) : null}

          <p>{abridged ? review.comment.substring(0, 200) : review.comment}</p>
          <p className="comment-detail">
            {`Posted ${new Date(review.created_at).toDateString()}`}
          </p>
          <p className="comment-detail">
            {currentUser.type === "Student" ||
            (currentUser.id === review.user_id || currentUser.admin) ? (
              <>
                <a href={`/dormtrak/reviews/${review.id}/edit`}>edit</a>
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
  currentUser: PropTypes.object.isRequired,
};

DormtrakRecentComments.defaultProps = {
  reviews: [],
};

export default DormtrakRecentComments;
