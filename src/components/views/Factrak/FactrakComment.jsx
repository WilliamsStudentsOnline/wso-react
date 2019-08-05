// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getCurrUser } from "../../../selectors/auth";

// External Imports
import axios from "axios";

// @TODO: investigate survey deficit
const FactrakComment = ({ comment, showProf, abridged, currUser }) => {
  const [agrees, setAgrees] = useState(comment.agrees);
  const [disagrees, setDisagrees] = useState(comment.disagrees);
  const [flagged, setFlagged] = useState(comment.flagged);

  const agreeCount = () => {
    if (abridged) return null;
    return (
      <h1>
        <span id={`${comment.id}agree-count`}>{agrees}</span>
        {` agree, `}
        <span id={`${comment.id}disagree-count`}>{disagrees}</span>
        {` disagree`}
        {/* Mark this comment as flagged if it is. The span is always here,
            but it is only filled when it is actually flagged */}
        <span
          id={`${comment.id}flagged`}
          className="factrak-flag"
          title="Flagged for moderator attention"
        >
          {flagged ? <>&#10071;</> : null}
        </span>
      </h1>
    );
  };
  // @TODO: write this algorithm properly
  // const timeAgoInWords = (time) => {
  //   return new Date(time).toDateString();
  // };

  const commentDetail = () => {
    return (
      <p className="comment-detail">
        {currUser.id === comment.userID ? (
          <>
            <a href={`/factrak/surveys/${comment.id}/edit`}>Edit</a>
            &nbsp;|&nbsp;
            <a
              data-confirm="Are you sure you want to destroy your review?"
              rel="nofollow"
              data-method="delete"
              href={`/factrak/surveys/${comment.id}`}
            >
              Delete
            </a>
          </>
        ) : (
          `posted ${/* @TODO timeAgoInWords(comment.created_at) */ 1}.`
        )}
      </p>
    );
  };

  const clickHandler = (direction) => {
    axios({
      method: "post",
      url: `/factrak/agreements?agrees=${direction}&amp;factrak_survey_id=${comment.id}`,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    }).then((response) => {
      setAgrees(response.data.agrees);
      setDisagrees(response.data.disagrees);
    });
  };

  const flagHandler = () => {
    axios({
      url: `/factrak/flag/?id=${comment.id}`,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    }).then((response) => {
      setFlagged(response.data.flagged);
    });
  };

  const wouldTakeAnother = () => {
    if (comment.wouldTakeAnother === null) return null;
    if (comment.wouldTakeAnother)
      return (
        <>
          <br />I would take another course with this professor
        </>
      );
    return (
      <>
        <br />I would
        <b>&nbsp;not&nbsp;</b>
        take another course with this professor
      </>
    );
  };

  const wouldRecommend = () => {
    if (comment.wouldRecommendCourse === null) return null;
    if (comment.wouldRecommendCourse)
      return (
        <>
          <br />I would recommend this course to a friend
        </>
      );
    return (
      <>
        <br />I would
        <b>&nbsp;not&nbsp;</b>
        recommend this course to a friend
      </>
    );
  };

  const agree = () => {
    if (comment.userID === currUser.id) return null;
    return (
      <>
        <button
          type="button"
          className="inline-button"
          onClick={() => clickHandler(1)}
        >
          Agree
        </button>
        &ensp;
        <button
          type="button"
          className="inline-button"
          onClick={() => clickHandler(0)}
        >
          Disagree
        </button>
        {!abridged && !flagged ? (
          <span id="flag<%= comment.id %>">
            <button
              type="button"
              className="inline-button"
              onClick={flagHandler}
            >
              {" Flag for moderator attention"}
            </button>
          </span>
        ) : null}
      </>
    );
  };

  const commentText = () => {
    let truncatedComment = comment.comment;
    if (comment.comment.length > 145)
      truncatedComment = comment.comment.substring(0, 145);
    if (abridged) {
      return (
        <div className="comment-text">
          {truncatedComment}
          {comment.comment.length > 145 ? (
            <div>
              <a href={`/factrak/professors/${comment.professorID}`}>
                ...See More
              </a>
            </div>
          ) : null}
        </div>
      );
    }
    return (
      <div className="comment-text">
        {comment.comment}
        <br />
        {wouldTakeAnother()}
        {wouldRecommend()}
        <br />
        {agree()}
      </div>
    );
  };

  return (
    <div id={`comment${comment.id}`} className="comment">
      <div className="comment-content">
        <h1>
          {showProf ? (
            <a href={`/factrak/professors/${comment.professorID}`}>
              {`${comment.professorID} | `}
            </a>
          ) : null}
          <a href={`/factrak/courses/${comment.courseID}`}>
            {/* @TODO comment.course.name */}
            {comment.courseID}
          </a>
        </h1>

        {agreeCount()}
        {currUser.factrakSurveyDeficit === 0 ||
        comment.userID === currUser.id ? (
          commentText()
        ) : (
          <div className="blurred">Please do your Factrak surveys.</div>
        )}

        {commentDetail()}
      </div>
    </div>
  );
};

FactrakComment.propTypes = {
  showProf: PropTypes.bool.isRequired,
  abridged: PropTypes.bool.isRequired,
  comment: PropTypes.object.isRequired,
  currUser: PropTypes.object,
};

FactrakComment.defaultProps = {
  currUser: {},
};

const mapStateToProps = (state) => ({
  currUser: getCurrUser(state),
});

export default connect(mapStateToProps)(FactrakComment);
