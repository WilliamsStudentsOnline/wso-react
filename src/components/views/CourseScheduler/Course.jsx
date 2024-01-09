// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// Component imports
import "../../stylesheets/Course.css";

// Redux (Selector, Reducer, Actions) imports
import {
  doAddCourse,
  doRemoveCourse,
  doHideCourse,
  doUnhideCourse,
} from "../../../actions/course";
import { getAddedCourses, getHiddenCourses } from "../../../selectors/course";
import { getTimeFormat } from "../../../selectors/schedulerUtils";
import { BORDER_PALETTE } from "../../../constants/constants";
import { Link } from "react-router-dom";

// External imports
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

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

  const addedIds = added.map((addedCourse) => addedCourse.peoplesoftNumber);
  const addIndex = addedIds.indexOf(course.peoplesoftNumber);
  const isAdded = addIndex !== -1;

  const isHidden = hidden.indexOf(course) !== -1;

  const instructors = () => {
    return (
      <span>
        {course.instructors?.map((instructor, index) => {
          if (!instructor.id) {
            return (
              <span className="no-url" key={instructor.name}>
                {index === 0 ? instructor.name : `, ${instructor.name}`}
              </span>
            );
          }

          return (
            <Link
              to={`/factrak/professors/${instructor.id}`}
              key={instructor.name}
            >
              {index === 0 ? instructor.name : `, ${instructor.name}`}
            </Link>
          );
        })}
      </span>
    );
  };

  const courseTime = () => {
    if (!course.meetings) return "";

    let result = " ";

    course.meetings.forEach((meeting) => {
      result += `${meeting.days}`;
      if (meeting.start && meeting.end) {
        result += `${
          twelveHour
            ? dayjs(meeting.start, "HH:mm").format("h:mmA")
            : meeting.start
        } - ${
          twelveHour ? dayjs(meeting.end, "HH:mm").format("h:mmA") : meeting.end
        } `;
      }

      result += `${meeting.facility}`;
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
      case "fifthCourse":
        return null;
      case "passFail":
        return null;
      default:
        return <i key="nodist" />;
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

  // this function name is a little misleading, this now returns a UUID for Follett links
  const semesterInNumber = () => {
    // NOTE: this is currently only stable for 2024 Spring (!!)
    // this controls the termID flag in the HTTP request, which Follett changed recently and may change again
    const yearVal = 100082572;
    return yearVal;
  };

  const bookstoreLink = () => {
    const baseBookstoreLink =
      "https://www.bkstr.com/williamsstore/course-materials-results?shopBy=course&divisionDisplayName=&bookstoreId=506&programID=912";

    return (
      <a
        href={`${baseBookstoreLink}&termId=${semesterInNumber()}&departmentDisplayName=${
          course.department
        }&courseDisplayName=${course.number}&sectionDisplayName=${
          course.section
        }`}
        style={{ color: "rebeccapurple" }}
      >
        View Course Book Information
      </a>
    );
  };

  const catalogLink = () => {
    const baseCatalogLink = "https://catalog.williams.edu";

    return (
      <a
        href={`${baseCatalogLink}/${course.department}/detail/?strm=${course.semID}&cn=${course.number}&crsid=${course.courseID}&req_year=0`}
        style={{ color: "rebeccapurple" }}
      >
        View Catalog Information
      </a>
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

  const courseBodyClick = (event) => {
    event.stopPropagation();
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
              {`${course.semester}, ${course.classType}, Section ${course.section}, ${course.sectionType}`}
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

      <div
        className="course-body"
        hidden={bodyHidden}
        onClick={courseBodyClick}
        role="presentation"
      >
        {catalogLink()}
        <br />
        <br />
        {bookstoreLink()}
        <br />
        <br />
        {crossListing()}
        <p className="course-description">{course.descriptionSearch}</p>
        <p className="course-format">
          <strong>Class Format:&nbsp;</strong>

          {course.classFormat}
        </p>

        <p className="course-enroll-pref">
          <strong>Enrollment Preferences:&nbsp;</strong>
          {course.enrolmentPreferences ?? "No Enrollment Preferences"}
        </p>

        <p className="pass-fail">
          <strong>{course.gradingBasisDesc}</strong>
        </p>

        <p className="course-peoplesoft">
          <strong>Peoplesoft Number:&nbsp;</strong>
          {course.peoplesoftNumber}
        </p>

        {course.extraInfo && (
          <p className="extra-information">
            <strong>Extra Information:&nbsp;</strong>
            {course.extraInfo}
          </p>
        )}
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

export default connect(mapStateToProps, mapDispatchToProps)(Course);
