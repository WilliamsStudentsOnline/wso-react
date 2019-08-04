// React imports
import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// Component imports
import "./stylesheets/Schedule.css";

// Redux (Selector, Reducer, Actions) imports
import { getUnhiddenCourses, getAddedCourses } from "../selectors/course";
import {
  getSemester,
  getTimeFormat,
  getOrientation,
} from "../selectors/schedulerUtils";
import {
  PALETTE,
  BORDER_PALETTE,
  SEMESTERS,
} from "../constants/constants.json";

// External imports
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const Schedule = ({ added, unhidden, currSem, twelveHour, horizontal }) => {
  const days = ["MON", "TUE", "WED", "THU", "FRI"];
  const filtered = unhidden.filter(
    (course) => course.semester === SEMESTERS[currSem]
  );
  const startHour = 8;
  let endHour = 16;

  // Detect if there are classes that end after 4pm, and adjust schedule length accordingly.
  for (let i = 0; i < filtered.length; i += 1) {
    if (endHour === 22) break;
    for (let j = 0; j < filtered[i].meetings.length; j += 1) {
      if (filtered[i].meetings[j].end > "16:00") {
        endHour = 22;
        break;
      }
    }
  }

  // Accounting for day title + number of hours + border width.
  const rowWidth = 50 + (endHour - startHour) * 80 + 4;

  const hours = [];
  for (let i = startHour; i < endHour; i += 1) {
    hours.push(i);
  }
  const courseDay = {
    MON: [[]],
    TUE: [[]],
    WED: [[]],
    THU: [[]],
    FRI: [[]],
  };

  const padZero = (number, numWidth) => {
    const width = numWidth - number.toString().length;

    if (width > 0) {
      return new Array(width + 1).join("0") + number;
    }

    return number.toString();
  };

  const stringTime = (meeting) => {
    if (twelveHour) {
      return `${dayjs(meeting.start, "HH:mm").format("h:mmA")}\n-\n${dayjs(
        meeting.end,
        "HH:mm"
      ).format("h:mmA")}`;
    }
    return `${meeting.start}-${meeting.end}`;
  };

  const HourTitles = (hour, index) => {
    if (horizontal) {
      if (twelveHour) {
        return (
          <div className="hour-title-horizontal" key={index}>
            {hour % 12 === 0 ? 12 : hour % 12} {hour >= 12 ? "PM" : "AM"}
          </div>
        );
      }
      return (
        <div className="hour-title-horizontal" key={index}>
          {`${padZero(hour, 2)}00`}
        </div>
      );
    }

    if (twelveHour) {
      return (
        <div className="hour-title-vertical" key={index}>
          {hour % 12 === 0 ? 12 : hour % 12} {hour >= 12 ? "PM" : "AM"}
        </div>
      );
    }
    return (
      <div className="hour-title-vertical" key={index}>
        {`${padZero(hour, 2)}00`}
      </div>
    );
  };

  const CourseSlot = (slot, i) => {
    if (slot.length === 0) return null;

    const [start, end, course, meeting] = slot;
    const index = added.indexOf(course);

    if (horizontal) {
      const offset = `${((start - 8 * 60) * 80) / 60}px`;
      const dimension = `${(end * 80) / 60}px`;
      return (
        <div
          className="course-slot"
          style={{
            left: offset,
            width: dimension,
            // Colors the various courses with an individual color for identification.
            backgroundColor: PALETTE[index % PALETTE.length],
            borderColor: BORDER_PALETTE[index % BORDER_PALETTE.length],
          }}
          key={i}
        >
          <div className="course-slot-title">{`${course.department} ${course.number}`}</div>
          <div>{course.classType}</div>
          <div>{`${stringTime(meeting)} ${meeting.facility}`}</div>
        </div>
      );
    }

    const offset = `${((start - 8 * 60) * 70) / 60}px`;
    const dimension = `${(end * 70) / 60}px`;

    return (
      <div
        className="course-slot"
        style={{
          top: offset,
          height: dimension,
          width: "97%",
          backgroundColor: PALETTE[index % PALETTE.length],
          borderColor: BORDER_PALETTE[index % BORDER_PALETTE.length],
        }}
        key={i}
      >
        <div className="course-slot-title">{`${course.department} ${course.number}`}</div>
        <div>{course.classType}</div>
        <div>{`${stringTime(meeting)} ${meeting.facil || ""}`}</div>
      </div>
    );
  };

  const DayCourseComponent = (row, index) => {
    if (horizontal) {
      return (
        <div className="course-containers-horizontal row" key={index}>
          {[...Array(endHour - startHour)].map((hour, ind) => {
            return (
              <div
                className={
                  ind % 2 === 0
                    ? "hour-in-days-horizontal"
                    : "hour-in-days-horizontal-odd"
                }
                key={ind} // eslint-disable-line react/no-array-index-key
              />
            );
          })}
          {row.map((slot, slotIndex) => {
            return CourseSlot(slot, slotIndex);
          })}
        </div>
      );
    }
    return (
      <div className="course-containers column" key={index}>
        {[...Array(endHour - startHour)].map((hour, ind) => {
          return (
            <div
              className={
                ind % 2 === 0
                  ? "hour-in-days-vertical"
                  : "hour-in-days-vertical-odd"
              }
              key={ind} // eslint-disable-line react/no-array-index-key
            />
          );
        })}
        {row.map((slot, slotIndex) => {
          return CourseSlot(slot, slotIndex);
        })}
      </div>
    );
  };

  const DayComponent = (day, index) => {
    if (horizontal) {
      return (
        <li
          className="day-horizontal row"
          key={index}
          style={{ width: rowWidth }}
        >
          <div className="day-title-horizontal">
            <span>{day}</span>
          </div>
          <div className="column course-day-horizontal">
            {(courseDay[day] || []).map((row, rowIndex) =>
              DayCourseComponent(row, rowIndex)
            )}
          </div>
        </li>
      );
    }

    return (
      <div className="day-vertical column" key={index}>
        <div className="day-title-vertical">
          <span>{day}</span>
        </div>
        <div className="row course-day-vertical">
          {(courseDay[day] || []).map((row, rowIndex) =>
            DayCourseComponent(row, rowIndex)
          )}
        </div>
      </div>
    );
  };

  // Minute-of-day representation of time.
  const parseTime = (time) => {
    const splitTime = time.split(":");
    return parseInt(splitTime[0], 10) * 60 + parseInt(splitTime[1], 10);
  };

  const getCourseDays = (daysOfCourse) => {
    if (daysOfCourse === "M-F") return ["MON", "TUE", "WED", "THU", "FRI"];

    const splitDays = daysOfCourse.split("");
    const result = [];

    for (const day of splitDays) {
      switch (day) {
        case "M":
          result.push("MON");
          break;
        case "T":
          result.push("TUE");
          break;
        case "W":
          result.push("WED");
          break;
        case "R":
          result.push("THU");
          break;
        case "F":
          result.push("FRI");
          break;
        default:
          break;
      }
    }

    return result;
  };

  const courseTimeParsed = (course) => {
    const result = [];

    for (const meeting of course.meetings) {
      const courseDays = getCourseDays(meeting.days);
      for (const day of courseDays) {
        const slot = [
          day,
          parseTime(meeting.start),
          parseTime(meeting.end) - parseTime(meeting.start),
          meeting,
        ];
        result.push(slot);
      }
    }
    return result;
  };

  const checkConflict = (slot, otherSlot) => {
    if (slot[0] <= otherSlot[0] + otherSlot[1] && slot[0] >= otherSlot[0])
      return true;
    if (otherSlot[0] <= slot[0] + slot[1] && otherSlot[0] >= slot[0])
      return true;

    return false;
  };

  const addSlot = (slot, course) => {
    const [day, start, end, meeting] = slot;

    for (const dayRow of courseDay[day]) {
      let conflictPresent = false;

      for (const otherSlot of dayRow) {
        if (checkConflict([start, end], otherSlot)) {
          conflictPresent = true;
          break;
        }
      }

      if (!conflictPresent) {
        dayRow.push([start, end, course, meeting]);
        return;
      }
    }

    courseDay[day].push([[start, end, course, meeting]]);
  };

  for (const course of filtered) {
    const parsedSlots = courseTimeParsed(course);

    for (const slot of parsedSlots) {
      addSlot(slot, course);
    }
  }

  if (horizontal) {
    return (
      <div className="schedule-horizontal">
        <div className="hour-labels-horizontal" style={{ width: rowWidth }}>
          <div className="buffer-horizontal">&nbsp;</div>
          {hours.map((hour, index) => HourTitles(hour, index))}
        </div>
        <div className="days-container-horizontal">
          {days.map((day, index) => DayComponent(day, index))}
        </div>
      </div>
    );
  }

  return (
    <div className="schedule-vertical row">
      <div className="column hour-labels-vertical">
        <div className="buffer-vertical">&nbsp;</div>
        {hours.map((hour, index) => HourTitles(hour, index))}
      </div>
      <div className="column days-container-vertical">
        <div className="row day-container-vertical">
          {days.map((day, index) => DayComponent(day, index))}
        </div>
      </div>
    </div>
  );
};

Schedule.propTypes = {
  added: PropTypes.arrayOf(PropTypes.object),
  unhidden: PropTypes.arrayOf(PropTypes.object),
  currSem: PropTypes.number.isRequired,
  twelveHour: PropTypes.bool.isRequired,
  horizontal: PropTypes.bool.isRequired,
};

Schedule.defaultProps = {
  added: [],
  unhidden: [],
};

const mapStateToProps = (state) => ({
  added: getAddedCourses(state),
  unhidden: getUnhiddenCourses(state),
  currSem: getSemester(state),
  twelveHour: getTimeFormat(state),
  horizontal: getOrientation(state),
});

export default connect(
  mapStateToProps,
  null
)(Schedule);
