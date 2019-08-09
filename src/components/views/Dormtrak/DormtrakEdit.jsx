// React imports
import React from "react";
import PropTypes from "prop-types";
import DormtrakReviewForm from "./DormtrakReviewForm";
import DormtrakLayout from "./DormtrakLayout";

const DormtrakEdit = ({
  authToken,
  dorm,
  review,
  room,
  neighborhoods,
  currentUser,
  notice,
  warning,
}) => {
  return (
    <DormtrakLayout
      neighborhoods={neighborhoods}
      authToken={authToken}
      notice={notice}
      warning={warning}
      currentUser={currentUser}
    >
      <div className="article">
        <section>
          <article>
            <h3>{`Editing review for ${dorm.name} ${room.number}`}</h3>
            <a
              data-confirm="Are you sure you want to delete your review?"
              rel="nofollow"
              data-method="delete"
              href={`/dormtrak/reviews/${review.id}`}
            >
              Delete review
            </a>
            <br />
            <br />

            <DormtrakReviewForm
              authToken={authToken}
              dorm={dorm}
              review={review}
              room={room}
              edit
            />
          </article>
        </section>
      </div>
    </DormtrakLayout>
  );
};

DormtrakEdit.propTypes = {
  authToken: PropTypes.string.isRequired,
  review: PropTypes.object.isRequired,
  dorm: PropTypes.object.isRequired,
  room: PropTypes.object.isRequired,
  neighborhoods: PropTypes.arrayOf(PropTypes.object).isRequired,
  notice: PropTypes.string,
  warning: PropTypes.string,
  currentUser: PropTypes.object,
};

DormtrakEdit.defaultProps = {
  currentUser: {},
  notice: "",
  warning: "",
};

export default DormtrakEdit;
