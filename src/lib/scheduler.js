import dayjs from "dayjs";

/**
 * Adds `days` to `date`.
 *
 * @param {Date} date - Date to be converted.
 * @param {number} days - number of days to be added.
 */
export const addDays = (date, days) => {
  date.setDate(date.getDate() + days);
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
