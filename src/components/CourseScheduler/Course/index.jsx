// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// Component imports
import styles from "./Course.module.scss";

// Redux (Selector, Reducer, Actions) imports
import {
  doAddCourse,
  doRemoveCourse,
  doHideCourse,
  doUnhideCourse,
} from "../../../actions/course";
import { getAddedCourses, getHiddenCourses } from "../../../selectors/course";
import { getTimeFormat } from "../../../selectors/schedulerUtils";
import { BORDER_PALETTE } from "../../../constants/constants.json";

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
        {course.instructors
          ? course.instructors.map((instructor, index) => (
              <a
                key={instructor.name}
                href={instructor.url ? instructor.url : undefined}
                className={instructor.url ? undefined : styles.noUrl}
              >
                {index === 0 ? instructor.name : `, ${instructor.name}`}
              </a>
            ))
          : null}
      </span>
    );
  };

  const courseTime = () => {
    let result = " ";

    if (!course.meetings) return "";

    course.meetings.forEach((meeting) => {
      result += `${meeting.days}`;
      result += `${
        twelveHour
          ? dayjs(meeting.start, "HH:mm").format("h:mmA")
          : meeting.start
      } - ${
        twelveHour ? dayjs(meeting.end, "HH:mm").format("h:mmA") : meeting.end
      } `;
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
        <div className={styles.courseButtonsDiv}>
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
      <div className={styles.courseButtonsDiv}>
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
          <i className={`${styles.dreq} ${styles.division}`} key={attr}>
            I
          </i>
        );
      case "div2":
        return (
          <i className={`${styles.dreq} ${styles.division}`} key={attr}>
            II
          </i>
        );
      case "div3":
        return (
          <i className={`${styles.dreq} ${styles.division}`} key={attr}>
            III
          </i>
        );
      case "wac":
        return (
          <i className={`${styles.dreq} ${styles.req}`} key={attr}>
            W
          </i>
        );
      case "dpe":
        return (
          <i className={`${styles.dreq} ${styles.req}`} key={attr}>
            D
          </i>
        );
      case "qfr":
        return (
          <i className={`${styles.dreq} ${styles.req}`} key={attr}>
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
      <div className={styles.disIcons}>
        {Object.keys(course.courseAttributes).map((attr) => {
          if (!course.courseAttributes[attr]) return null;
          return distributionIcon(attr);
        })}
      </div>
    );
  };

  const semesterInNumber = () => {
    switch (course.semester) {
      case "Fall":
        return 1001 + 10 * (course.year % 100);
      case "Winter":
        return 1002 + 10 * (course.year % 100);
      default:
        return 1003 + 10 * (course.year % 100);
    }
  };

  const bookstoreLink = () => {
    const baseBookstoreLink =
      "https://www.bkstr.com/williamsstore/follett-discover-view/booklook?shopBy=discoverViewCourse&bookstoreId=506&divisionDisplayName=";

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

  const clickExpand = () => {
    // Addition of &nbsp; prevents div collapse.
    return (
      <div className={styles.clickExpandMessage}>
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
      className={styles.course}
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
      <div className={styles.courseHeader}>
        <div className={`row ${styles.courseTitle}`}>
          <div className={`row ${styles.title}`}>
            {`${course.department} ${course.number} ${course.titleLong}`}
          </div>
          <div className={`row ${styles.headerInfo}`}>
            <div className="column">{distributionIcons()}</div>
            <div className={`column ${styles.ra}`}>
              {`${course.semester}, ${course.classType}, Section ${course.section}`}
            </div>
          </div>
        </div>
        <div className={`row ${styles.courseSummary}`}>
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

      <div className={styles.courseBody} hidden={bodyHidden}>
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
          {course.enrlPref ? course.enrlPref : "No Enrollment Preferences"}
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

export default connect(mapStateToProps, mapDispatchToProps)(Course);
