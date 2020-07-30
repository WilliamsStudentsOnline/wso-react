// React imports
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Line, Paragraph, Photo } from "../../common/Skeleton";
import Button from "../../common/Button";

// Additional imports
import { connect } from "react-redux";
import { getWSO } from "../../../selectors/auth";
import { userTypeStudent } from "../../../constants/general";
import { Link } from "react-router5";
import { actions } from "redux-router5";
import { format } from "timeago.js";

import styles from "./DormtrakRecentComments.module.scss";

const DormtrakRecentComments = ({
  wso,
  abridged,
  currUser,
  navigateTo,
  reviews,
}) => {
  const [currReviews, updateCurrReviews] = useState(null);
  // const [expanded, updateExpanded] = useState(false);

  useEffect(() => {
    updateCurrReviews(reviews);
  }, [reviews]);

  // useEffect(() => {
  //   updateExpanded(!expanded);
  // });

  const deleteHandler = async (reviewID) => {
    // eslint-disable-next-line no-restricted-globals, no-alert
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      await wso.dormtrakService.deleteReview(reviewID);
      updateCurrReviews(currReviews.filter((review) => review.id !== reviewID));
    } catch (error) {
      // eslint-disable-next-line no-empty
    }
  };

  const editDeleteButtons = (review) => {
    if (currUser.type === userTypeStudent && currUser.id === review.userID) {
      return (
        <p className="comment-detail">
          <Button
            onClick={() =>
              navigateTo("dormtrak.editReview", {
                reviewID: review.id,
              })
            }
            className="inlineButton"
          >
            Edit
          </Button>

          <Button
            onClick={() => deleteHandler(review.id)}
            className="inlineButton"
          >
            Delete
          </Button>
        </p>
      );
    }
    return null;
  };

  // Render Full Comment
  const renderFullComment = (review) => {
    return (
      <div className={styles.comment} key={review.id}>
        <p>{review.comment}</p>
        <p className={styles.commentDate}>
          {`posted about ${format(new Date(review.createdTime))}`}
        </p>
        <span className={styles.commentContent}>
          {editDeleteButtons(review)}
        </span>
      </div>
    );
  };

  // Expands Review from Abridged -> Full Depending on State
  // const seeMore = (review) => {
  //   const linkName = expanded ? "see less..." : "see more...";

  //   const link = <div>
  //   <Link
  //     onClick={() => {
  //       updateExpanded(!expanded);
  //     }}
  //     className={styles.seeMore}
  //   >
  //     {linkName}
  //   </Link>
  // </div>

  //   if (!expanded) {
  //     return (
  //       renderFullComment(review),
  //       { link },
  //     )
  //   }
  //   return (
  //     renderAbridgedComment(review);
  //     { link };
  //   );
  // };

  // Renders an abridged comment
  const renderAbridgedComment = (review) => {
    return (
      <div className={styles.comment} key={review.id}>
        <div>
          <Link
            routeName="dormtrak.dorms"
            routeParams={{ dormID: review.dormRoom.dorm.id }}
          >
            <h1 className={styles.commentTitle}>
              {review.dormRoom.dorm.name} -{" "}
              {review.dormRoom.dorm.neighborhood.name}
            </h1>
          </Link>
        </div>

        {/* see more function */}
        <div className={styles.commentContent}>
          <div>
            <span>{review.comment.substring(0, 200)} </span>
            <span className={styles.seeMore}>see more...</span>
          </div>
          <p className={styles.commentDate}>
            {`Posted ${format(new Date(review.createdTime))}`}
          </p>
          {editDeleteButtons(review)}
        </div>
      </div>
    );
  };

  const renderComment = (review) => {
    if (abridged) return renderAbridgedComment(review);

    return renderFullComment(review);
  };

  const fullCommentSkeleton = (key) => {
    return (
      <div className={styles.comment} key={key}>
        <Paragraph numRows={4} />
        <br />
        <div className={styles.commentContent}>
          <Line width="30%" />
        </div>
      </div>
    );
  };

  const abridgedCommentSkeleton = (key) => {
    return (
      <div className={styles.comment} key={key}>
        <div className={styles.commentImage}>
          <Photo width="6em" height="2em" />
        </div>

        <div className={styles.commentContent}>
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
    <section className={styles.container}>
      <h3>Recent Reviews</h3>
      <br />
      {renderCommentList()}
    </section>
  );
};

DormtrakRecentComments.propTypes = {
  abridged: PropTypes.bool.isRequired,
  currUser: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  reviews: PropTypes.arrayOf(PropTypes.object),
  wso: PropTypes.object.isRequired,
};

DormtrakRecentComments.defaultProps = {
  reviews: null,
};

const mapStateToProps = (state) => ({
  wso: getWSO(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DormtrakRecentComments);
