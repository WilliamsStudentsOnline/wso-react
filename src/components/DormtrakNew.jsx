// React imports
import React from 'react';
import PropTypes from 'prop-types';
import DormtrakReviewForm from './DormtrakReviewForm';
import DormtrakLayout from './DormtrakLayout';

const DormtrakNew = ({
  authToken,
  dorm,
  review,
  room,
  neighborhoods,
  notice,
  warning,
  currentUser,
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
            <h3>
              Review for
              {dorm.name}
            </h3>
            <DormtrakReviewForm
              authToken={authToken}
              dorm={dorm}
              review={review}
              room={room}
              edit={false}
            />
          </article>
        </section>
      </div>
    </DormtrakLayout>
  );
};

DormtrakNew.propTypes = {
  authToken: PropTypes.string.isRequired,
  review: PropTypes.object,
  dorm: PropTypes.object.isRequired,
  room: PropTypes.object,
  neighborhoods: PropTypes.arrayOf(PropTypes.object).isRequired,
  notice: PropTypes.string,
  warning: PropTypes.string,
  currentUser: PropTypes.object,
};

DormtrakNew.defaultProps = {
  review: {},
  room: {},
  currentUser: {},
  notice: '',
  warning: '',
};

export default DormtrakNew;
