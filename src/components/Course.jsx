// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// Component imports
import "./stylesheets/Course.css";

// Redux (Selector, Reducer, Actions) imports
import {
  doAddCourse,
  doRemoveCourse,
  doHideCourse,
  doUnhideCourse,
} from "../actions/course";
import { getAddedCourses, getHiddenCourses } from "../selectors/course";
import { getTimeFormat } from "../selectors/utils";
import { BORDER_PALETTE } from "../constants/constants.json";

const Course = ({
  added,
  hidden,
  course,
  location,
  onAdd,
  onRemove,
  onHide,
  onUnhide,
  twelveHour,
}) => {
  // State of body visibiity
  const [bodyHidden, setHidden] = useState(true);

  const addIndex = added.indexOf(course);
  const isAdded = addIndex !== -1;
  const isHidden = hidden.indexOf(course) !== -1;

  const instructors = () => {
    return (
      <span>
        {course.instructors.map((instructor, index) => (
          <a
            key={instructor.name}
            href={instructor.url ? instructor.url : undefined}
            className={instructor.url ? undefined : "no-url"}
          >
            {index === 0 ? instructor.name : `, ${instructor.name}`}
          </a>
        ))}
      </span>
    );
  };

  const courseTime = () => {
    let result = " ";

    if (!course.meetings) return "";

    course.meetings.forEach((meeting) => {
      result += `${meeting.days}`;
      result += `${twelveHour ? meeting.start12 : meeting.start} - ${
        twelveHour ? meeting.end12 : meeting.end
      } `;
      result += `${meeting.facil}`;
    });

    return result;
  };

  const toggleBody = (event) => {
    if (event.target.localName === "button" || event.target.localName === "a")
      return;

    setHidden(!bodyHidden);
  };

  const courseButtons = () => {
    if (location === "timetable")
      return (
        <div className="course-buttons">
          <button
            onClick={(e) => {
              // Prevents the button from expanding or contracting the component.
              e.stopPropagation();
              onRemove(course);
            }}
            type="button"
          >
            <i className="material-icons">delete_forever</i>
            <span>Remove</span>
          </button>
          <button
            onClick={(e) => {
              // Prevents the button from expanding or contracting the component.
              e.stopPropagation();
              return isHidden ? onUnhide(course) : onHide(course);
            }}
            type="button"
          >
            <i className="material-icons">
              {isHidden ? "visibility_off" : "visibility"}
            </i>
            <span>{isHidden ? "Hidden" : "Visible"}</span>
          </button>
        </div>
      );

    return (
      <div className="course-buttons">
        <button
          onClick={(e) => {
            // Prevents the button from expanding or contracting the component.
            e.stopPropagation();
            return isAdded ? onRemove(course) : onAdd(course);
          }}
          type="button"
        >
          <i className="material-icons">
            {isAdded ? "event_busy" : "event_available"}
          </i>
          <span>{isAdded ? "Remove" : "Add"}</span>
        </button>
      </div>
    );
  };

  const distributionIcon = (attr) => {
    switch (attr) {
      case "div1":
        return (
          <i className="dreq d1" key={attr}>
            I
          </i>
        );
      case "div2":
        return (
          <i className="dreq d2" key={attr}>
            II
          </i>
        );
      case "div3":
        return (
          <i className="dreq d3" key={attr}>
            III
          </i>
        );
      case "wac":
        return (
          <i className="dreq wi" key={attr}>
            W
          </i>
        );
      case "dpe":
        return (
          <i className="dreq dpe" key={attr}>
            D
          </i>
        );
      case "qfr":
        return (
          <i className="dreq qfr" key={attr}>
            Q
          </i>
        );
      default:
        return <i />;
    }
  };

  const distributionIcons = () => {
    return (
      <div className="dis-icons">
        {Object.keys(course.courseAttributes).map((attr) => {
          if (!course.courseAttributes[attr]) return null;
          return distributionIcon(attr);
        })}
      </div>
    );
  };

  const clickExpand = () => {
    // Addition of &nbsp; prevents div collapse.
    return (
      <div className="click-expand-message">
        {bodyHidden ? (
          <i className="material-icons">expand_more</i>
        ) : (
          <i className="material-icons">expand_less</i>
        )}
        <span>&nbsp;</span>
      </div>
    );
  };

  const crossListing = () => {
    if (course.crossListing.length > 1)
      return (
        <p className="cross-listing">
          <strong>Cross-Listed As:&nbsp;</strong>
          {course.crossListing.join(", ")}
        </p>
      );
    return null;
  };

  return (
    <div
      className="course"
      style={
        isAdded
          ? {
              borderLeft: `5px solid ${
                BORDER_PALETTE[addIndex % BORDER_PALETTE.length]
              }`,
            }
          : {}
      }
      onClick={toggleBody}
      role="presentation"
    >
      <div className="course-header">
        <div className="row course-title">
          <div className="row title">
            {`${course.department} ${course.number} ${course.titleLong}`}
          </div>
          <div className="row header-info">
            <div className="column">{distributionIcons()}</div>
            <div className="column ra">
              {`${course.semester}, ${course.classType}, Section ${course.section}`}
            </div>
          </div>
        </div>
        <div className="row course-summary">
          <div className="column">
            <div className="row">
              <span>{instructors()}</span>
              &emsp;
              <span>{courseTime()}</span>
            </div>
            <div className="row">
              <p>
                <strong className="course-prereqs">
                  Pre-Requisites:&nbsp;
                </strong>
                {course.prereqs}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="course-body" hidden={bodyHidden}>
        {crossListing()}
        <p className="course-description">{course.descriptionSearch}</p>
        <p className="course-format">
          <strong>Class Format:&nbsp;</strong>

          {course.classFormat}
        </p>

        <p className="course-enroll-pref">
          <strong>Enrollment Preferences:&nbsp;</strong>
          {course.enrlPref}
        </p>

        <p className="pass-fail">
          <strong>{course.gradingBasisDesc}</strong>
        </p>

        <p className="course-peoplesoft">
          <strong>Peoplesoft Number:&nbsp;</strong>
          {course.peoplesoftNumber}
        </p>

        {course.extraInfo ? (
          <p className="extra-information">
            <strong>Extra Information:&nbsp;</strong>
            {course.extraInfo}
          </p>
        ) : null}
      </div>

      {courseButtons()}
      {clickExpand()}
    </div>
  );
};

Course.propTypes = {
  added: PropTypes.arrayOf(PropTypes.object).isRequired,
  hidden: PropTypes.arrayOf(PropTypes.object).isRequired,
  twelveHour: PropTypes.bool.isRequired,
  onAdd: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onUnhide: PropTypes.func.isRequired,
  location: PropTypes.string,
  course: PropTypes.object.isRequired,
};

Course.defaultProps = {
  location: "",
};

const mapStateToProps = (state) => ({
  hidden: getHiddenCourses(state),
  added: getAddedCourses(state),
  twelveHour: getTimeFormat(state),
});

const mapDispatchToProps = (dispatch) => ({
  onAdd: (course) => dispatch(doAddCourse(course)),
  onRemove: (course) => dispatch(doRemoveCourse(course)),
  onHide: (course) => dispatch(doHideCourse(course)),
  onUnhide: (course) => dispatch(doUnhideCourse(course)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Course);
