import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useAppDispatch, useAppSelector } from "../lib/store";
import { getAddedCourses } from "../selectors/course";
import { doLoadCatalog } from "../actions/course";
import { CURRENT_TERM_SEMESTER_INDEX } from "../lib/scheduler";
import { SEMESTERS } from "../constants/constants";

dayjs.extend(customParseFormat);

type Meeting = {
  days?: string;
  start?: string;
  end?: string;
  facility?: string;
};

type ScheduleCourse = {
  department?: string;
  number?: string | number;
  titleLong?: string;
  titleShort?: string;
  semester?: string;
  peoplesoftNumber?: number;
  meetings?: Meeting[] | null;
};

type TodaySlot = {
  key: string;
  start: string;
  end: string;
  startLabel: string;
  endLabel: string;
  code: string;
  title: string;
  place: string;
};

const DAY_LETTERS = ["", "M", "T", "W", "R", "F"] as const;

const meetingOnDay = (days: string | undefined, dayLetter: string) => {
  if (!days || days === "FORG") return false;
  if (days === "M-F") return true;
  return days.includes(dayLetter);
};

const formatTime = (hhmm?: string) => {
  if (!hhmm) return "";
  const parsed = dayjs(hhmm, "HH:mm");
  return parsed.isValid() ? parsed.format("h:mm A") : hhmm;
};

const buildTodaySlots = (courses: ScheduleCourse[], dayLetter: string) => {
  const slots: TodaySlot[] = [];
  courses.forEach((course) => {
    const code = `${course.department ?? ""} ${course.number ?? ""}`.trim();
    const title = course.titleShort || course.titleLong || "";
    (course.meetings || []).forEach((meeting, idx) => {
      if (!meetingOnDay(meeting.days, dayLetter)) return;
      if (!meeting.start) return;
      slots.push({
        key: `${course.peoplesoftNumber ?? code}-${idx}-${meeting.start}`,
        start: meeting.start,
        end: meeting.end || meeting.start,
        startLabel: formatTime(meeting.start),
        endLabel: formatTime(meeting.end),
        code,
        title,
        place: meeting.facility || "",
      });
    });
  });
  slots.sort((a, b) => a.start.localeCompare(b.start));
  return slots;
};

/** Compact "today" view of Course Scheduler added courses. */
const HomepageSchedule = () => {
  const dispatch = useAppDispatch();
  const added = useAppSelector(getAddedCourses) as ScheduleCourse[];
  const [loadingCatalog, setLoadingCatalog] = useState(false);

  useEffect(() => {
    if (added.length > 0) return undefined;
    if (!localStorage.getItem("added")) return undefined;

    let cancelled = false;
    setLoadingCatalog(true);
    fetch("/courses.json", {
      headers: { "X-Requested-With": "XMLHttpRequest" },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        if (!cancelled) dispatch(doLoadCatalog(data));
      })
      .catch(() => {
        /* empty schedule is fine */
      })
      .finally(() => {
        if (!cancelled) setLoadingCatalog(false);
      });

    return () => {
      cancelled = true;
    };
  }, [added.length, dispatch]);

  // Calendar "in session now" — not the scheduler's prereg default.
  const semester = SEMESTERS[CURRENT_TERM_SEMESTER_INDEX];
  const today = new Date();
  const dayLetter = DAY_LETTERS[today.getDay()] || "";
  const semesterCourses = useMemo(
    () => added.filter((c) => c.semester === semester),
    [added, semester]
  );

  const slots = useMemo(
    () => (dayLetter ? buildTodaySlots(semesterCourses, dayLetter) : []),
    [semesterCourses, dayLetter]
  );

  const hasCourses = semesterCourses.length > 0;
  const showOpen = !loadingCatalog && !hasCourses;

  const emptyMessage = (() => {
    if (loadingCatalog) return "Loading schedule…";
    if (!hasCourses) return "No courses in your schedule yet.";
    if (!dayLetter) return "No weekday classes today.";
    if (slots.length === 0) return "No classes in your schedule today.";
    return null;
  })();

  return (
    <div className="home-schedule">
      <h3 className="home-schedule-heading">Today</h3>
      {emptyMessage ? (
        <div className="home-schedule-empty">
          <span>{emptyMessage}</span>
          {showOpen ? (
            <>
              {" "}
              <Link className="home-schedule-open" to="/schedulecourses">
                Open →
              </Link>
            </>
          ) : null}
        </div>
      ) : (
        <div className="home-schedule-list">
          {slots.map((slot) => (
            <div key={slot.key} className="home-schedule-item">
              <div className="home-schedule-time">
                {slot.startLabel}
                {slot.endLabel ? `–${slot.endLabel}` : ""}
              </div>
              <div className="home-schedule-course">
                <span className="home-schedule-code">{slot.code}</span>
                {slot.title ? (
                  <span className="home-schedule-title">{slot.title}</span>
                ) : null}
                {slot.place ? (
                  <span className="home-schedule-place">{slot.place}</span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomepageSchedule;
