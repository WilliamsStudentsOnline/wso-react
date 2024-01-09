import dayjs from "dayjs";
import { DATES } from "../constants/constants";

/**
 * Adds `days` to `date`.
 *
 * @param {Date} date - Date to be converted.
 * @param {number} days - number of days to be added.
 */
export const addDays = (date, days) => {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + days);
  return newDate;
};

/**
 * Converts `dateString` into "YYYY-MM-DD" format.
 *
 * **Example**:
 * "20200908" -> "2020-09-08"
 *
 * @param {string} date - Date String to be converted.
 * @return {string} `dateString` in "YYYY-MM-DD" format.
 */
export const gcalFormattedDate = (dateString) => {
  return dayjs(dateString).format("YYYY-MM-DD");
};

/**
 * Returns a date string equivalent to `dateString` converted
 * up to the next date that is in `daysOfWeekAllowed`. Does
 * nothing if `dateString` has the correct day of week.
 *
 * @param {string} dateString - Date String to be converted.
 * @param {number[]} daysOfWeekAllowed - Days of week allowed for rounding
 *                                       0 represents Sunday, 1 represents
 *                                       Monday, and so on.
 *
 * @return {string} Rounded date string in "YYYYMMDD" format.
 */
export const nextDateWithDay = (dateString, daysOfWeekAllowed) => {
  let date = dayjs(dateString);

  if (daysOfWeekAllowed.length === 0) return dateString;
  if (!daysOfWeekAllowed.every((d) => d >= 0 && d < 7)) {
    throw new Error(`Invalid days of week (${daysOfWeekAllowed}) passed in.`);
  }

  while (!daysOfWeekAllowed.includes(date.day())) {
    date = date.add(1, "day");
  }

  return date.format("YYYYMMDD");
};

export const toDayArray = (days) => {
  if (days === "M-F") return [1, 2, 3, 4, 5];

  return days.split("").map((day) => {
    switch (day) {
      case "M":
        return 1;
      case "T":
        return 2;
      case "W":
        return 3;
      case "R":
        return 4;
      case "F":
        return 5;
      default:
        return 0;
    }
  });
};

export const dayConversionGCal = (days) => {
  if (days === "M-F") return "MO,TU,WE,TH,FR";

  const result = [];

  days.split("").forEach((day) => {
    switch (day) {
      case "M":
        result.push("MO");
        break;
      case "T":
        result.push("TU");
        break;
      case "W":
        result.push("WE");
        break;
      case "R":
        result.push("TH");
        break;
      case "F":
        result.push("FR");
        break;
      default:
        break;
    }
  });

  return result.join(",");
};

/* 
  Returns default semester based on date. 
  
  Academic year Period: SEMESTER TO SHOW

  1. Start of Fall Semester - 2 Weeks before Spring Preregistration: FALL (0)
  2. 2 Weeks before Spring Pre-registration to Winter Registration: SPRING (2)
  3. Winter Registration to the beginning of Winter Study: WINTER (1)
  4. 1 week before Winter ends to 2 Weeks before Fall Pre-registration: SPRING (2)
  5. 2 Weeks before Fall Pre-registration to next year: FALL (0)
*/
const getDefaultSemesterIndex = () => {
  let result = 0;

  const now = new Date();
  // Check if Winter (Period 3, above)
  if (
    new Date(gcalFormattedDate(DATES.PREREG.WINTER)) < now &&
    now < new Date(gcalFormattedDate(DATES.Winter.START))
  ) {
    result = 1;
  } else if (
    // Check if Spring (Periods 2 and 4, above)
    addDays(new Date(gcalFormattedDate(DATES.PREREG.SPRING)), -14) < now &&
    now < addDays(new Date(gcalFormattedDate(DATES.PREREG.FALL)), -14)
  ) {
    result = 2;
  } else {
    result = 0;
  }

  return result;
};

export const DEFAULT_SEMESTER_INDEX = getDefaultSemesterIndex();
