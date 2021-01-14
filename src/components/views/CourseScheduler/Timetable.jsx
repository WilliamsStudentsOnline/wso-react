// React imports
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// External imports
import domtoimage from "dom-to-image";
import {
  dayConversionGCal,
  gcalFormattedDate,
  nextDateWithDay,
  toDayArray,
} from "../../../lib/scheduler";

// Component imports
import Schedule from "./Schedule";
import Course from "./Course";
import "../../stylesheets/Timetable.css";
import Select from "../../Select";

// Redux (Selector, Reducer, Actions) imports
import { getAddedCourses, getHiddenCourses } from "../../../selectors/course";
import {
  getGAPI,
  getSemester,
  getTimeFormat,
  getOrientation,
  // getSignInStatus,
} from "../../../selectors/schedulerUtils";
import { doRemoveSemesterCourses } from "../../../actions/course";
import {
  addNotif,
  changeSem,
  changeTimeFormat,
  changeOrientation,
  // updateSignIn,
} from "../../../actions/schedulerUtils";
import { FAILURE, SUCCESS } from "../../../constants/actionTypes";
import { DATES, SEMESTERS } from "../../../constants/constants.json";

const Timetable = ({
  added,
  gapi,
  notifAdd,
  semChange,
  currSem,
  twelveHour,
  timeFormatChange,
  horizontal,
  orientationToggle,
  removeSemesterCourses,
  hidden,
}) => {
  const [sortOrder, updateSortOrder] = useState("Alphabetical(A-Z)");
  const [isSignedIn, updateSignIn] = useState(false);
  const [calendarEvents, updateCalendarEvents] = useState([]);

  useEffect(() => {
    if (gapi?.auth2.getAuthInstance()) {
      updateSignIn(gapi.auth2.getAuthInstance().isSignedIn.get());
    }
  }, [gapi]);

  const courseShortTitle = (course) => {
    return course.department + course.number;
  };

  // Defines sorting orders
  const sortOrders = {
    "Alphabetical(A-Z)": (courses) =>
      courses.concat().sort((a, b) => {
        return courseShortTitle(a).localeCompare(courseShortTitle(b));
      }),
    "Reverse Alphabetical (Z-A)": (courses) =>
      courses.concat().sort((a, b) => {
        return courseShortTitle(b).localeCompare(courseShortTitle(a));
      }),
    "Earliest Added First": (courses) => courses,
    "Latest Added First": (courses) => courses.concat().reverse(),
  };

  const semAdded = added.filter(
    (course) => course.semester === SEMESTERS[currSem]
  );

  // Only export the courses that are visible and of the current semester. Gives more convenince since
  // the user does not need to remove extra courses before exporting.
  const semAddedVisible = semAdded.filter(
    (course) => hidden.indexOf(course) === -1
  );

  const courseString = (course) => {
    return `${course.department} ${course.number} ${course.titleLong}`;
  };

  const exportImage = () => {
    // Select the correct component based on the current mode.
    const schedule = horizontal
      ? document.querySelector(".schedule-horizontal")
      : document.querySelector(".schedule-vertical");

    // Good to get the correct width because the library defaults can be wonky
    const scheduleWidth = horizontal
      ? document.querySelector(".day-horizontal").offsetWidth
      : document.querySelector(".schedule-vertical").offsetWidth;

    domtoimage
      .toPng(schedule, {
        style: {
          margin: 0,
          overflow: "visible visible",
          width: scheduleWidth,
        },
      })
      .then((dataUrl) => {
        window.open().document.write(`<img src="${dataUrl}" />`);
      });
  };

  const exportICS = () => {
    let calendar =
      "BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\n";
    const timeZone = "TZID=America/New_York:";

    for (const course of semAddedVisible) {
      if (course.meetings === null) {
        // this course hasn't set any meeting times, skipping it
        continue;
      }
      for (const meeting of course.meetings) {
        const meetingStartDate = nextDateWithDay(
          DATES[course.semester].START,
          toDayArray(meeting.days)
        );

        let result = "BEGIN:VEVENT\n";
        result += `SUMMARY:${courseString(course)}\n`;
        result += `RRULE:FREQ=WEEKLY;UNTIL=${
          DATES[course.semester].END
        }T000000Z;BYDAY=${dayConversionGCal(meeting.days)}`;
        result += `DTSTART;${timeZone}${meetingStartDate}T${meeting.start.replace(
          ":",
          ""
        )}00\n`;
        result += `DTEND;${timeZone}${meetingStartDate}T${meeting.end.replace(
          ":",
          ""
        )}00\n`;
        result += `LOCATION:${meeting.facil}\n`;
        result += `DESCRIPTION:${course.descriptionSearch}\n`;
        result += "END:VEVENT\n";
        calendar += result;
      }
    }
    calendar += "END:VCALENDAR";

    const uriContent = `data:text/calendar;charset=utf-8,${encodeURIComponent(
      calendar
    )}`;
    const link = document.createElement("a");
    link.href = uriContent;
    link.download = "WSO_export.ics";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const createGCalEvent = (course, meeting) => {
    const gcalStartDate = gcalFormattedDate(
      nextDateWithDay(DATES[course.semester].START, toDayArray(meeting.days))
    );

    const event = {
      summary: courseString(course),
      location: meeting.facil,
      description: course.descriptionSearch,
      start: {
        dateTime: `${gcalStartDate}T${meeting.start}:00`,
        timeZone: "America/New_York",
      },
      end: {
        dateTime: `${gcalStartDate}T${meeting.end}:00`,
        timeZone: "America/New_York",
      },
      recurrence: [
        `RRULE:FREQ=WEEKLY;UNTIL=${
          DATES[course.semester].END
        }T000000Z;BYDAY=${dayConversionGCal(meeting.days)}`,
      ],
    };

    return {
      request: {
        calendarId: "primary",
        resource: event,
      },
      course,
    };
  };

  const performAPIRequests = (events) => {
    const calEvents = events ?? calendarEvents;

    for (const { request, course } of calEvents) {
      gapi.client.calendar.events.insert(request).execute((response) => {
        if (!response.error) {
          notifAdd({
            notifType: SUCCESS,
            title: "Success!",
            body: `Sucessfully exported ${courseString(
              course
            )} to Google Calendar!`,
          });
        }
      });
    }
    // ? what if only one request fails?
    updateCalendarEvents([]);
  };

  const exportCalendar = async () => {
    const events = [];
    for (const course of semAddedVisible) {
      if (course.meetings === null) {
        // this course hasn't set any meeting times, skipping it
        continue;
      }
      for (const meeting of course.meetings) {
        events.push(createGCalEvent(course, meeting));
      }
    }

    if (!isSignedIn) {
      try {
        await gapi.auth2.getAuthInstance().signIn();
        updateSignIn(true);
      } catch (error) {
        notifAdd({
          type: FAILURE,
          title: "Failed to authenticate Google calendar.",
        });

        return;
      }
    }

    performAPIRequests(events);
  };

  const addedComponent = () => {
    return (
      <div className="added">
        <div className="added-courses">
          <span>Added Courses:</span>
          <div className="added-sort">
            Sort By:
            <Select
              onChange={(event) => {
                updateSortOrder(event.target.value);
              }}
              options={Object.keys(sortOrders)}
              value={sortOrder}
              valueList={Object.keys(sortOrders)}
              style={{
                display: "inline",
                margin: "5px 0px 5px 20px",
                padding: "4px",
              }}
            />
          </div>
        </div>

        {sortOrders[sortOrder](semAdded || []).map((course) => (
          <Course
            course={course}
            key={course.department + course.peoplesoftNumber}
            location="timetable"
          />
        ))}
      </div>
    );
  };

  // Checks if there are components (e.g. corresponding lab session) that the user might have
  // forgotten to add
  const courseWarnings = () => {
    const errorCourses = [];

    for (const course of semAdded) {
      const components = course.components.slice();

      for (const otherCourse of semAdded) {
        if (otherCourse.courseID === course.courseID) {
          const componentIndex = components.indexOf(otherCourse.classType);

          if (componentIndex !== -1) components.splice(componentIndex, 1);
        }

        if (components.length === 0) break;
      }

      if (components.length !== 0) {
        for (const component of components)
          errorCourses.push(
            `${component} session for ${course.department} ${course.number}!`
          );
      }
    }

    if (errorCourses.length < 1) return null;

    return (
      <div className="course-warnings">
        <div className="course-warnings-header">JUST A NOTE!</div>
        Remember to include the following:
        <ol>
          {errorCourses.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ol>
      </div>
    );
  };

  const helpMessage = () => {
    return (
      <div className="help-message">
        <div className="help-header">No courses added!</div>
        <div className="help-body">
          Add courses to your timetable by heading to the Catalog and searching
          for them!
        </div>
      </div>
    );
  };

  const semester = () => {
    const semesterStudy = ["Fall Semester", "Winter Study", "Spring Semester"];
    if (currSem < 3 && currSem >= 0) return semesterStudy[currSem];
    return "Unknown";
  };

  return (
    <div className="timetable">
      <div className="timetable-header row">
        <div className="column">
          <span>
            <button
              onClick={() => semChange(currSem - 1)}
              disabled={currSem <= 0}
              className="change-semester-button"
              type="button"
            >
              <i className="material-icons">keyboard_arrow_left</i>
            </button>
            {`${semester()} Timetable`}
            <button
              onClick={() => semChange(currSem + 1)}
              disabled={currSem >= 2}
              className="change-semester-button"
              type="button"
            >
              <i className="material-icons">keyboard_arrow_right</i>
            </button>
          </span>
        </div>
      </div>
      <Schedule />
      <div className="export-options">
        <button onClick={exportImage} type="button">
          <i className="material-icons">photo</i>
          <span>Export to .png</span>
        </button>
        <button
          className={gapi ? "" : "unselectable"}
          onClick={exportCalendar}
          disabled={!gapi}
          type="button"
        >
          <i className="material-icons">today</i>
          <span>Export to GCal</span>
        </button>
        <button onClick={exportICS} type="button">
          <i className="material-icons">calendar_today</i>
          <span>Export to .ics</span>
        </button>
        <button onClick={() => timeFormatChange(!twelveHour)} type="button">
          <i className="material-icons">access_time</i>
          <span>{twelveHour ? "12-Hour Time" : "24-Hour Time"}</span>
        </button>
        <button onClick={() => orientationToggle(!horizontal)} type="button">
          <i className="material-icons">
            {horizontal ? "crop_landscape" : "crop_portrait"}
          </i>
          <span>{horizontal ? "Horizontal" : "Vertical"}</span>
        </button>
        <button
          onClick={() => removeSemesterCourses(SEMESTERS[currSem])}
          type="button"
        >
          <i className="material-icons">delete_sweep</i>
          <span>Remove All</span>
        </button>
      </div>

      {courseWarnings()}
      {semAdded.length > 0 ? addedComponent() : helpMessage()}
    </div>
  );
};

Timetable.propTypes = {
  added: PropTypes.arrayOf(PropTypes.object),
  notifAdd: PropTypes.func.isRequired,
  semChange: PropTypes.func.isRequired,
  timeFormatChange: PropTypes.func.isRequired,
  currSem: PropTypes.number.isRequired,
  gapi: PropTypes.object,
  twelveHour: PropTypes.bool.isRequired,
  horizontal: PropTypes.bool.isRequired,
  orientationToggle: PropTypes.func.isRequired,
  removeSemesterCourses: PropTypes.func.isRequired,
  hidden: PropTypes.arrayOf(PropTypes.object),
};

Timetable.defaultProps = {
  gapi: null,
  added: [],
  hidden: [],
};

const mapStateToProps = (state) => ({
  added: getAddedCourses(state),
  gapi: getGAPI(state),
  currSem: getSemester(state),
  twelveHour: getTimeFormat(state),
  horizontal: getOrientation(state),
  hidden: getHiddenCourses(state),
});

const mapDispatchToProps = (dispatch) => ({
  notifAdd: (notification) => dispatch(addNotif(notification)),
  semChange: (newSem) => dispatch(changeSem(newSem)),
  timeFormatChange: (twelveHour) => dispatch(changeTimeFormat(twelveHour)),
  orientationToggle: (horizontal) => dispatch(changeOrientation(horizontal)),
  removeSemesterCourses: (semester) =>
    dispatch(doRemoveSemesterCourses(semester)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Timetable);
