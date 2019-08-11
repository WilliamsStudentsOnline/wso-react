// React imports
import React from "react";
import PropTypes from "prop-types";

const DormtrakRecentComments = ({ reviews, abridged, currUser }) => {
  const renderComment = (review) => {
    return (
      <div className="comment" key={review.id}>
        {abridged && review.dorm ? (
          <div className="comment-image">
            <img
              alt="dorm avatar"
              src={`${process.env.PUBLIC_URL}/avatars/${review.dorm.name}.png`}
            />
          </div>
        ) : null}

        <div className="comment-content">
          {abridged && review.dorm ? (
            <h1>
              <a href={`/dormtrak/dorms/${review.dorm.id}`}>
                {review.dorm.name}
              </a>
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
  currUser: PropTypes.object.isRequired,
};

DormtrakRecentComments.defaultProps = {
  reviews: [],
};

export default DormtrakRecentComments;
