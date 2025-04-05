import {
  SEARCH_COURSE,
  RESET_LOAD,
  LOAD_COURSES,
  LOAD_CATALOG,
  COURSE_ADD,
  COURSE_REMOVE,
  COURSE_HIDE,
  COURSE_UNHIDE,
  TOGGLE_SEM,
  TOGGLE_DIST,
  TOGGLE_DIV,
  TOGGLE_OTHERS,
  TOGGLE_CONFLICT,
  TOGGLE_LEVEL,
  TOGGLE_TYPE,
  TOGGLE_REMOTE,
  TOGGLE_FACTRAK_SCORE_DISPLAY,
  TOGGLE_INCLUDE_FACTRAK_NO_SCORES,
  SET_MIN_FACTRAK_SCORE,
  UPDATE_END,
  UPDATE_START,
  RESET_FILTERS,
  REMOVE_SEMESTER_COURSES,
  LOAD_HISTORICAL_CATALOG_YEAR,
} from "../constants/actionTypes";

import {
  SEMESTERS,
  DISTRIBUTIONS,
  DIVISIONS,
  OTHERS,
  LEVELS,
  CLASS_TYPES,
  REMOTE,
} from "../constants/constants";
import { DEPARTMENT } from "../constants/departments";
import { DEFAULT_SEMESTER_INDEX } from "../lib/scheduler";

const INITIAL_STATE = {};
let INITIAL_CATALOG = [];

// Gets the added courses attributes from LocalStorage and add the relevant courses.
// TODO: binary search?
const parseAddedCourses = () => {
  const addedCourses = localStorage.getItem("added");
  if (addedCourses) {
    const brownies = addedCourses.split(",");
    for (let i = 0; i < brownies.length; i += 1) {
      const bites = brownies[i].split(";");
      bites[1] = parseInt(bites[1], 10);
      brownies[i] = INITIAL_CATALOG.find(
        (course) =>
          bites[0] === course.department && bites[1] === course.peoplesoftNumber
      );
    }
    return brownies.filter((brownie) => brownie);
  }
  return [];
};

// Minute-of-day representation of the time for comparison
const parseTime = (time) => {
  const splitTime = time.split(":");
  return parseInt(splitTime[0], 10) * 60 + parseInt(splitTime[1], 10);
};

const INITIAL_FILTER_STATE = {
  semesters: [false, false, false],
  distributions: [false, false, false],
  divisions: [false, false, false],
  others: [false, false],
  remote: [false, false, false],
  levels: [false, false, false, false, false],
  conflict: [false],
  start: "",
  end: "",
  classTypes: [false, false, false, false, false, false],
  showFactrakScore: true,
  includeFactrakNoScores: true,
  minFactrakScore: 0,
};

const INITIAL_COUNT_STATE = {
  semesters: [0, 0, 0],
  distributions: [0, 0, 0],
  divisions: [0, 0, 0],
  others: [0, 0],
  levels: [0, 0, 0, 0, 0],
  conflict: [0],
  classTypes: [0, 0, 0, 0, 0, 0],
  remote: [0, 0, 0],
  factrak: [0, 0],
};

const DEFAULT_SEMESTER = [false, false, false];
DEFAULT_SEMESTER[DEFAULT_SEMESTER_INDEX] = SEMESTERS[DEFAULT_SEMESTER_INDEX];

Object.assign(INITIAL_FILTER_STATE, {
  semesters: DEFAULT_SEMESTER,
});

Object.assign(INITIAL_STATE, {
  searched: [],
  queried: [],
  loadGroup: 1,
  query: "",
  added: parseAddedCourses(),
  hidden: [],
  filters: INITIAL_FILTER_STATE,
  counts: INITIAL_COUNT_STATE,
  historicalCatalogs: {}, // will be { 2025: [], 2024: [], 2023: [], ... }
});

// Writing this rather than using regex for speed reasons
const occurrences = (string = "", subString = "") => {
  if (!string || !subString) return 0;

  let n = 0;

  for (let pos = 0; pos < string.length; pos += 1) {
    pos = string.indexOf(subString, pos);
    if (pos >= 0) {
      n += 1;
    } else break;
  }
  return n;
};

const hasFilter = (filter) => {
  for (let i = 0; i < filter.length; i += 1) {
    if (filter[i] !== false) return true;
  }

  return false;
};

const scoreCourses = (param, course) => {
  let score = 1;

  // Allows the user to search by department, number, title, description, and instructors
  let searchArea = (course.titleLong + course.titleShort).toLowerCase();

  if (course.instructors) {
    course.instructors.forEach((instructor) => {
      searchArea += instructor.name.toLowerCase();
    });
  }

  const lowercaseDescription = course.descriptionSearch
    ? course.descriptionSearch.toLowerCase()
    : "";

  const lowercaseCode = (
    course.department +
    course.number +
    DEPARTMENT[course.department]
  ).toLowerCase();

  const queries = param.toLowerCase().split(" ");
  for (const query of queries) {
    if (query !== "") {
      const initialScore = score;
      // Matches in the code are awarded a higher priority than title/instructors, followed by code.
      score += occurrences(lowercaseDescription, query);
      score += 100 * occurrences(searchArea, query);
      score += 10000 * occurrences(lowercaseCode, query);
      if (score === initialScore) return 0;
    }
  }

  return score;
};

// Compare function to order courses by score, then alphatical order of their code
const compareRelevance = (courseA, courseB) => {
  // If there is a hit in the code for both, sort by department and number
  if (courseA.score >= 10000 && courseB.score >= 10000) {
    if (courseA.department > courseB.department) return 1;
    if (courseB.department > courseA.department) return -1;

    if (courseA.number > courseB.number) return 1;
    if (courseB.number > courseA.number) return -1;

    // This should never happen.
    return 0;
  }

  // Otherwise sort them by score
  if (courseA.score > courseB.score) return -1;
  if (courseB.score > courseA.score) return 1;

  return 0;
};

const getCourseDays = (days) => {
  if (days === "M-F") return ["MON", "TUE", "WED", "THU", "FRI"];

  const splitDays = days.split("");
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

  if (course.meetings) {
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
  }

  return result;
};

const checkConflict = (course, addedCourse) => {
  if (course.semester !== addedCourse.semester) return false;

  const parsedSlots = courseTimeParsed(course);
  const parsedAddedSlots = courseTimeParsed(addedCourse);

  // If the start time of any course is in the other, then there is a conflict.
  for (const slot of parsedSlots) {
    for (const addedSlot of parsedAddedSlots) {
      if (slot[0] === addedSlot[0]) {
        if (slot[1] <= addedSlot[1] + addedSlot[2] && slot[1] >= addedSlot[1])
          return true;
        if (addedSlot[1] <= slot[1] + slot[2] && addedSlot[1] >= slot[1])
          return true;
      }
    }
  }

  return false;
};

const applyFilters = (state, queried, filters) => {
  const {
    semesters,
    levels,
    distributions,
    divisions,
    others,
    classTypes,
    conflict,
    remote,
    includeFactrakNoScores,
    minFactrakScore,
  } = filters;

  const result = [];

  for (let j = 0; j < queried.length; j += 1) {
    const course = queried[j];

    // Semester filtering
    if (hasFilter(semesters) && semesters.indexOf(course.semester) === -1)
      continue;

    // Level filtering
    if (
      hasFilter(levels) &&
      levels.indexOf(Math.floor(course.number / 100)) === -1
    )
      continue;

    let check = false;
    // Remote filtering
    if (hasFilter(remote)) {
      for (let i = 0; i < remote.length; i += 1) {
        if (remote[i] && course.sectionType === remote[i]) check = true;
      }
      if (!check) continue;
    }

    // Distribution filtering
    if (hasFilter(distributions)) {
      check = false;
      for (let i = 0; i < distributions.length; i += 1) {
        if (distributions[i] && course.courseAttributes[distributions[i]])
          check = true;
      }
      if (!check) continue;
    }

    // Division filtering
    if (hasFilter(divisions)) {
      check = false;
      for (let i = 0; i < divisions.length; i += 1) {
        if (divisions[i] && course.courseAttributes[divisions[i]]) check = true;
      }
      if (!check) continue;
    }
    // Attribute filtering
    if (hasFilter(others)) {
      check = false;
      for (let i = 0; i < others.length; i += 1) {
        if (others[i] && course.courseAttributes[others[i]]) check = true;
      }
      if (!check) continue;
    }

    // Type filtering
    if (hasFilter(classTypes) && classTypes.indexOf(course.classType) === -1)
      continue;

    // Time filtering
    if (course.meetings) {
      check = false;
      if (state.filters.start) {
        const start = state.filters.start;
        for (const meeting of course.meetings) {
          if (meeting.start < start) {
            check = true;
            break;
          }
        }
      }
      if (check) continue;

      check = false;
      if (state.filters.end) {
        const end = state.filters.end;
        for (const meeting of course.meetings) {
          if (meeting.end > end) {
            check = true;
            break;
          }
        }
      }

      if (check) continue;
    }

    if (conflict[0]) {
      let hasConflict = false;
      if (state.added) {
        for (const addedCourse of state.added) {
          if (checkConflict(course, addedCourse)) {
            hasConflict = true;
            break;
          }
        }
      }

      if (hasConflict) continue;
    }

    if (course.factrakScore) {
      // don't use factrak filters without factrak scope
      if (!includeFactrakNoScores && course.factrakScore === -1) continue;

      if (
        minFactrakScore > 0 &&
        course.factrakScore < minFactrakScore / 100 &&
        course.factrakScore >= 0
      ) {
        continue;
      }
    } else if (!includeFactrakNoScores) continue; // edge case!

    result.push(course);
  }

  return result;
};

const findCount = (
  state,
  original = Object.assign(...state.counts),
  filter,
  constants
) => {
  const filters = JSON.parse(JSON.stringify(state.filters));

  return original[filter].map((_, index) => {
    const oldFilter = filters[filter].slice();

    for (let i = 0; i < filters[filter].length; i += 1) {
      filters[filter][i] = false;
    }

    filters[filter][index] = constants[index];
    const result = applyFilters(state, state.queried, filters);
    filters[filter] = oldFilter;

    return result.length;
  });
};

const updateCounts = (state) => {
  const newCounts = { ...state.counts };

  const getCountWithTempFactrakFilters = (
    tempIncludeNoScores,
    tempMinScore
  ) => {
    const tempFilters = { ...state.filters };

    tempFilters.includeFactrakNoScores = tempIncludeNoScores;
    tempFilters.minFactrakScore = tempMinScore;

    return applyFilters(state, state.queried, tempFilters).length;
  };

  const countWithNoScores = getCountWithTempFactrakFilters(true, 0);
  const countWithoutNoScores = getCountWithTempFactrakFilters(false, 0);

  const noScoresCount = countWithNoScores - countWithoutNoScores;
  const minScoreCount = getCountWithTempFactrakFilters(
    false,
    state.filters.minFactrakScore
  );

  newCounts.factrak = [noScoresCount, minScoreCount];

  newCounts.semesters = findCount(state, newCounts, "semesters", SEMESTERS);
  newCounts.distributions = findCount(
    state,
    newCounts,
    "distributions",
    DISTRIBUTIONS
  );
  newCounts.divisions = findCount(state, newCounts, "divisions", DIVISIONS);
  newCounts.others = findCount(state, newCounts, "others", OTHERS);
  newCounts.levels = findCount(state, newCounts, "levels", LEVELS);
  newCounts.conflict = findCount(state, newCounts, "conflict", [true]);
  newCounts.classTypes = findCount(state, newCounts, "classTypes", CLASS_TYPES);
  newCounts.remote = findCount(state, newCounts, "remote", REMOTE);
  // --- End Standard Counts ---

  return newCounts; // Return the updated counts object
};

const updateScores = (param) => {
  // Assign scores based on current search parameters
  for (let i = 0; i < INITIAL_CATALOG.length; i += 1) {
    INITIAL_CATALOG[i] = {
      ...INITIAL_CATALOG[i],
      score: scoreCourses(param, INITIAL_CATALOG[i]),
    };
  }

  return INITIAL_CATALOG;
};

const applySearchCourse = (state, param = state.query) => {
  // Update scores only if search query is changed.
  let queried = state.queried;
  if (param !== state.query) {
    queried = updateScores(param);
    queried = queried
      .filter((course) => {
        return course.score && course.score > 0;
      })
      .sort(compareRelevance);
  }

  const newState = {
    ...state,
    searched: applyFilters(state, queried, state.filters),
    queried,
    query: param,
  };

  return { ...newState, counts: updateCounts(newState) };
};

const applyResetLoad = (state) => {
  return { ...state, loadGroup: 1 };
};

const applyLoadCourses = (state, action) => {
  return { ...state, loadGroup: action.newLoadGroup };
};

const applyAddCourse = (state, action) => {
  let addedCourses = localStorage.getItem("added");
  if (!addedCourses) {
    addedCourses = `${action.course.department};${action.course.peoplesoftNumber}`;
  } else {
    const brownie = addedCourses.split(",");
    const index = brownie.indexOf(
      `${action.course.department};${action.course.peoplesoftNumber}`
    );

    if (index === -1) {
      addedCourses += `,${action.course.department};${action.course.peoplesoftNumber}`;
    }
  }

  localStorage.setItem("added", addedCourses);

  // Update state
  return { ...state, added: [...state.added, action.course] };
};

const applyRemoveCourse = (state, action) => {
  // Update LocalStorage
  let addedCourses = localStorage.getItem("added");
  if (!addedCourses) addedCourses = "";

  const brownie = addedCourses.split(",");
  let index = brownie.indexOf(
    `${action.course.department};${action.course.peoplesoftNumber}`
  );

  // While loop to fix previous errors that may have resulted in more than one
  // of the same course added.
  while (index !== -1) {
    brownie.splice(index, 1);
    index = brownie.indexOf(
      `${action.course.department};${action.course.peoplesoftNumber}`
    );
  }

  localStorage.setItem("added", brownie.join(","));

  // Update State
  return {
    ...state,
    added: state.added.filter(
      (course) => course.peoplesoftNumber !== action.course.peoplesoftNumber
    ),
  };
};

const applyHideCourse = (state, action) => {
  return { ...state, hidden: [...state.hidden, action.course] };
};

const applyUnhideCourse = (state, action) => {
  return {
    ...state,
    hidden: state.hidden.filter((course) => course !== action.course),
  };
};

const toggleConf = (state) => {
  return {
    ...state,
    filters: { ...state.filters, conflict: [!state.filters.conflict[0]] },
  };
};
const toggleSem = (state, action) => {
  const final = state.filters.semesters.slice();

  if (final[action.index]) final[action.index] = false;
  else final[action.index] = SEMESTERS[action.index];

  return { ...state, filters: { ...state.filters, semesters: final } };
};
const toggleDist = (state, action) => {
  const final = state.filters.distributions.slice();

  if (final[action.index]) final[action.index] = false;
  else final[action.index] = DISTRIBUTIONS[action.index];

  return { ...state, filters: { ...state.filters, distributions: final } };
};
const toggleDiv = (state, action) => {
  const final = state.filters.divisions.slice();

  if (final[action.index]) final[action.index] = false;
  else final[action.index] = DIVISIONS[action.index];

  return { ...state, filters: { ...state.filters, divisions: final } };
};
const toggleOthers = (state, action) => {
  const final = state.filters.others.slice();

  if (final[action.index]) final[action.index] = false;
  else final[action.index] = OTHERS[action.index];
  return { ...state, filters: { ...state.filters, others: final } };
};
const toggleLevel = (state, action) => {
  const final = state.filters.levels.slice();

  if (final[action.index] !== false) final[action.index] = false;
  else final[action.index] = LEVELS[action.index];

  return { ...state, filters: { ...state.filters, levels: final } };
};

const toggleType = (state, action) => {
  const final = state.filters.classTypes.slice();

  if (final[action.index] !== false) final[action.index] = false;
  else final[action.index] = CLASS_TYPES[action.index];

  return { ...state, filters: { ...state.filters, classTypes: final } };
};

const toggleFactrakDisplay = (state, action) => {
  return {
    ...state,
    filters: {
      ...state.filters,
      showFactrakScore: !state.filters.showFactrakScore,
    },
  };
};

const toggleIncludeFactrakNoScores = (state, action) => {
  return {
    ...state,
    filters: {
      ...state.filters,
      includeFactrakNoScores: !state.filters.includeFactrakNoScores,
    },
  };
};

const setMinFactrakScore = (state, action) => {
  return {
    ...state,
    filters: {
      ...state.filters,
      minFactrakScore: parseInt(action.score, 10) || 0,
    },
  };
};

const updateStart = (state, action) => {
  return { ...state, filters: { ...state.filters, start: action.time } };
};

const updateEnd = (state, action) => {
  return { ...state, filters: { ...state.filters, end: action.time } };
};

const resetFilters = (state) => {
  return { ...state, filters: INITIAL_FILTER_STATE };
};

// Removes all courses from the current semester.
const removeSemesterCourses = (state, action) => {
  // Get all added semesters, remove all belonging to current semester, and update local storage
  const filteredAdded = state.added.filter(
    (course) => course.semester !== action.semester
  );

  localStorage.setItem(
    "added",
    filteredAdded
      .map((course) => `${course.department};${course.peoplesoftNumber}`)
      .join(",")
  );

  return { ...state, added: filteredAdded };
};

const applyLoadCatalog = (state, catalog) => {
  INITIAL_CATALOG = catalog.courses;

  Object.assign(INITIAL_STATE, {
    queried: INITIAL_CATALOG,
    added: parseAddedCourses(),
    crossListings: catalog.crossListings,
    updateTime: catalog.updateTime,
  });

  return { ...state, ...applySearchCourse(INITIAL_STATE) };
};

const applyLoadHistoricalCatalogYear = (state, action) => {
  const { year, catalog } = action;
  return {
    ...state,
    historicalCatalogs: {
      ...state.historicalCatalogs,
      [year]: catalog.courses,
    },
  };
};

const toggleRemote = (state, action) => {
  const final = state.filters.remote.slice();

  if (final[action.index] !== false) final[action.index] = false;
  else final[action.index] = REMOTE[action.index];

  return { ...state, filters: { ...state.filters, remote: final } };
};

const courseReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case COURSE_ADD:
      return applyAddCourse(state, action);
    case COURSE_HIDE:
      if (state.hidden.indexOf(action.course) === -1)
        return applyHideCourse(state, action);
      break;
    case COURSE_REMOVE:
      return applyRemoveCourse(state, action);
    case COURSE_UNHIDE:
      if (state.hidden.indexOf(action.course) !== -1)
        return applyUnhideCourse(state, action);
      break;
    case LOAD_CATALOG:
      return applyLoadCatalog(state, action.catalog);
    case LOAD_HISTORICAL_CATALOG_YEAR:
      return applyLoadHistoricalCatalogYear(state, action);
    case LOAD_COURSES:
      return applyLoadCourses(state, action);
    case RESET_FILTERS:
      return resetFilters(state);
    case RESET_LOAD:
      return applyResetLoad(state);
    case REMOVE_SEMESTER_COURSES:
      return removeSemesterCourses(state, action);
    case SEARCH_COURSE:
      return applySearchCourse(state, action.param);
    case TOGGLE_CONFLICT:
      return toggleConf(state, action);
    case TOGGLE_DIST:
      return toggleDist(state, action);
    case TOGGLE_DIV:
      return toggleDiv(state, action);
    case TOGGLE_LEVEL:
      return toggleLevel(state, action);
    case TOGGLE_OTHERS:
      return toggleOthers(state, action);
    case TOGGLE_REMOTE:
      return toggleRemote(state, action);
    case TOGGLE_SEM:
      return toggleSem(state, action);
    case TOGGLE_TYPE:
      return toggleType(state, action);
    case TOGGLE_FACTRAK_SCORE_DISPLAY:
      return toggleFactrakDisplay(state, action);
    case TOGGLE_INCLUDE_FACTRAK_NO_SCORES:
      return toggleIncludeFactrakNoScores(state, action);
    case SET_MIN_FACTRAK_SCORE:
      return setMinFactrakScore(state, action);
    case UPDATE_END:
      return updateEnd(state, action);
    case UPDATE_START:
      return updateStart(state, action);
    default:
      return state;
  }

  return state;
};

export { DEFAULT_SEMESTER };
export default courseReducer;
