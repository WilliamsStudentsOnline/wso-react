import Cookies from 'universal-cookie';
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
  UPDATE_END,
  UPDATE_START,
  RESET_FILTERS,
  REMOVE_SEMESTER_COURSES,
} from '../constants/actionTypes';

import {
  SEMESTERS,
  DISTRIBUTIONS,
  DIVISIONS,
  OTHERS,
  LEVELS,
  CLASS_TYPES,
  DATES,
} from '../constants/constants.json';
import { DEPARTMENT } from '../constants/departments.json';

const INITIAL_STATE = {};
let INITIAL_CATALOG = [];
const cookies = new Cookies();

const parseAddedCourses = () => {
  const cookie = cookies.get('added', { doNotParse: true });
  if (cookie) {
    const brownies = cookie.split(',');
    return INITIAL_CATALOG.filter(course => {
      let check = false;
      brownies.forEach(brownie => {
        const bites = brownie.split(';');
        if (
          bites[0] === course.department &&
          bites[1] === course.peoplesoft_number
        ) {
          check = true;
        }
      });

      return check;
    });
  }
  return [];
};

// Minute-of-day representation of the time for comparison
const parseTime = time => {
  const splitTime = time.split(':');
  return parseInt(splitTime[0], 10) * 60 + parseInt(splitTime[1], 10);
};

const INITIAL_FILTER_STATE = {
  semesters: [false, false, false],
  distributions: [false, false, false],
  divisions: [false, false, false],
  others: [false, false],
  levels: [false, false, false, false, false],
  conflict: [false],
  start: '',
  end: '',
  classTypes: [false, false, false, false, false, false],
};

const INITIAL_COUNT_STATE = {
  semesters: [0, 0, 0],
  distributions: [0, 0, 0],
  divisions: [0, 0, 0],
  others: [0, 0],
  levels: [0, 0, 0, 0, 0],
  conflict: [0],
  classTypes: [0, 0, 0, 0, 0, 0],
};

// Set default semester based on date.
const DEFAULT_SEMESTER = [false, false, false];
const now = new Date();
if (now < new Date(DATES.Winter.START_GCAL.slice(0, -1))) {
  DEFAULT_SEMESTER[0] = SEMESTERS[0];
} else if (now > new Date(DATES.Spring.START_GCAL.slice(0, -1))) {
  DEFAULT_SEMESTER[2] = SEMESTERS[2];
} else {
  DEFAULT_SEMESTER[1] = SEMESTERS[1];
}

Object.assign(INITIAL_FILTER_STATE, {
  semesters: DEFAULT_SEMESTER,
});

Object.assign(INITIAL_STATE, {
  searched: [],
  queried: [],
  loadGroup: 1,
  query: '',
  added: parseAddedCourses(),
  hidden: [],
  filters: INITIAL_FILTER_STATE,
  counts: INITIAL_COUNT_STATE,
});

// Writing this rather than using regex for speed reasons
const occurrences = (string = '', subString = '') => {
  if (!string) return 0;
  if (!subString) return 0;

  let n = 0;

  // TODO: write a better loop?
  for (let pos = 0; pos < string.length; pos += 1) {
    pos = string.indexOf(subString, pos);
    if (pos >= 0) {
      n += 1;
    } else break;
  }
  return n;
};

const hasFilter = filter => {
  for (let i = 0; i < filter.length; i += 1) {
    if (filter[i] !== false) return true;
  }

  return false;
};

const scoreCourses = (state, param, course) => {
  let score = 1;

  // Allows the user to search by department, number, title, description, and instructors
  let searchArea = (course.title_long + course.title_short).toLowerCase();

  course.instructors.forEach(instructor => {
    searchArea += instructor.name.toLowerCase();
  });

  const lowercaseDescription = course.description_search
    ? course.description_search.toLowerCase()
    : '';

  const lowercaseCode = (
    course.department +
    course.number +
    DEPARTMENT[course.department]
  ).toLowerCase();

  const queries = param.toLowerCase().split(' ');
  for (const query of queries) {
    if (query !== '') {
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

const getCourseDays = days => {
  if (days === 'M-F') return ['MON', 'TUE', 'WED', 'THU', 'FRI'];

  const splitDays = days.split('');
  const result = [];

  for (const day of splitDays) {
    switch (day) {
      case 'M':
        result.push('MON');
        break;
      case 'T':
        result.push('TUE');
        break;
      case 'W':
        result.push('WED');
        break;
      case 'R':
        result.push('THU');
        break;
      case 'F':
        result.push('FRI');
        break;
      default:
        break;
    }
  }

  return result;
};

const courseTimeParsed = course => {
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
    // Distribution filtering
    if (hasFilter(distributions)) {
      for (let i = 0; i < distributions.length; i += 1) {
        if (distributions[i] && course.attributes[distributions[i]])
          check = true;
      }
      if (!check) continue;
    }

    // Division filtering
    if (hasFilter(divisions)) {
      check = false;
      for (let i = 0; i < divisions.length; i += 1) {
        if (divisions[i] && course.attributes[divisions[i]]) check = true;
      }
      if (!check) continue;
    }
    // Attribute filtering
    if (hasFilter(others)) {
      check = false;
      for (let i = 0; i < others.length; i += 1) {
        if (
          others[i] &&
          !(
            course.grading_basis === others[i] || course.grading_basis === 'OPT'
          )
        )
          check = true;
      }
      if (!check) continue;
    }

    // Type filtering
    if (hasFilter(classTypes) && classTypes.indexOf(course.class_type) === -1)
      continue;

    // Time filtering
    if (state.filters.start) {
      const start = parseTime(state.filters.start);
      for (const meeting of course.meetings) {
        if (parseTime(meeting.start) < start) continue;
      }
    }

    if (state.filters.end) {
      const end = parseTime(state.filters.end);
      for (const meeting of course.meetings) {
        if (parseTime(meeting.end) > end) continue;
      }
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

    result.push(course);
  }

  return result;
};

const findCount = (
  state,
  original = Object.assign({}, state.counts),
  filter,
  constants
) => {
  const filters = JSON.parse(JSON.stringify(state.filters));

  return original[filter].map((value, index) => {
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

const updateCounts = state => {
  const newCounts = Object.assign({}, state.counts);

  newCounts.semesters = findCount(state, newCounts, 'semesters', SEMESTERS);
  newCounts.distributions = findCount(
    state,
    newCounts,
    'distributions',
    DISTRIBUTIONS
  );
  newCounts.divisions = findCount(state, newCounts, 'divisions', DIVISIONS);
  newCounts.others = findCount(state, newCounts, 'others', OTHERS);
  newCounts.levels = findCount(state, newCounts, 'levels', LEVELS);
  newCounts.conflict = findCount(state, newCounts, 'conflict', [true]);
  newCounts.classTypes = findCount(state, newCounts, 'classTypes', CLASS_TYPES);

  return newCounts;
};

const updateScores = (state, param) => {
  // Assign scores based on current search parameters
  for (let i = 0; i < INITIAL_CATALOG.length; i += 1) {
    INITIAL_CATALOG[i] = Object.assign({}, INITIAL_CATALOG[i], {
      score: scoreCourses(state, param, INITIAL_CATALOG[i]),
    });
  }

  return INITIAL_CATALOG;
};

const applySearchCourse = (state, param = state.query) => {
  // Update scores only if search query is changed.
  let queried = state.queried;
  if (param !== state.query) {
    queried = updateScores(state, param);
    queried = queried
      .filter(course => {
        return course.score && course.score > 0;
      })
      .sort(compareRelevance);
  }

  const newState = Object.assign({}, state, {
    searched: applyFilters(state, queried, state.filters),
    queried,
    query: param,
  });

  return Object.assign({}, newState, {
    counts: updateCounts(newState),
  });
};

const applyResetLoad = state => {
  return Object.assign({}, state, {
    loadGroup: 1,
  });
};

const applyLoadCourses = (state, action) => {
  return Object.assign({}, state, {
    loadGroup: action.newLoadGroup,
  });
};

const applyAddCourse = (state, action) => {
  const cookie = cookies.get('added', { doNotParse: true });
  // cookies store the department and peoplesoft number for unique identification of the course
  // section and department it belongs too.
  cookies.set(
    'added',
    cookie
      ? `${action.course.department};${action.course.peoplesoft_number},${cookie}`
      : `${action.course.department};${action.course.peoplesoft_number}`,
    {
      path: '/',
      expires: new Date('December 31, 9999 11:00:00'),
    }
  );

  // Update state
  return Object.assign({}, state, {
    added: [...state.added, action.course],
  });
};

const applyRemoveCourse = (state, action) => {
  // Update cookie
  const cookie = cookies.get('added', { doNotParse: true });
  const brownie = cookie.split(',');
  const index = brownie.indexOf(
    `${action.course.department};${action.course.course_id}`
  );
  if (index !== -1) brownie.splice(index, 1);
  cookies.set('added', brownie.join(','), {
    path: '/',
    expires: new Date('December 31, 9999 11:00:00'),
  });

  // Update State
  return Object.assign({}, state, {
    added: state.added.filter(course => course !== action.course),
  });
};

const applyHideCourse = (state, action) => {
  return Object.assign({}, state, {
    hidden: [...state.hidden, action.course],
  });
};

const applyUnhideCourse = (state, action) => {
  return Object.assign({}, state, {
    hidden: state.hidden.filter(course => course !== action.course),
  });
};

const toggleConf = state => {
  return Object.assign({}, state, {
    filters: Object.assign({}, state.filters, {
      conflict: [!state.filters.conflict[0]],
    }),
  });
};
const toggleSem = (state, action) => {
  const final = state.filters.semesters.slice();

  if (final[action.index]) final[action.index] = false;
  else final[action.index] = SEMESTERS[action.index];

  return Object.assign({}, state, {
    filters: Object.assign({}, state.filters, {
      semesters: final,
    }),
  });
};
const toggleDist = (state, action) => {
  const final = state.filters.distributions.slice();

  if (final[action.index]) final[action.index] = false;
  else final[action.index] = DISTRIBUTIONS[action.index];

  return Object.assign({}, state, {
    filters: Object.assign({}, state.filters, {
      distributions: final,
    }),
  });
};
const toggleDiv = (state, action) => {
  const final = state.filters.divisions.slice();

  if (final[action.index]) final[action.index] = false;
  else final[action.index] = DIVISIONS[action.index];

  return Object.assign({}, state, {
    filters: Object.assign({}, state.filters, {
      divisions: final,
    }),
  });
};
const toggleOthers = (state, action) => {
  const final = state.filters.others.slice();

  if (final[action.index]) final[action.index] = false;
  else final[action.index] = OTHERS[action.index];
  return Object.assign({}, state, {
    filters: Object.assign({}, state.filters, {
      others: final,
    }),
  });
};
const toggleLevel = (state, action) => {
  const final = state.filters.levels.slice();

  if (final[action.index] !== false) final[action.index] = false;
  else final[action.index] = LEVELS[action.index];

  return Object.assign({}, state, {
    filters: Object.assign({}, state.filters, {
      levels: final,
    }),
  });
};

const toggleType = (state, action) => {
  const final = state.filters.classTypes.slice();

  if (final[action.index] !== false) final[action.index] = false;
  else final[action.index] = CLASS_TYPES[action.index];

  return Object.assign({}, state, {
    filters: Object.assign({}, state.filters, {
      classTypes: final,
    }),
  });
};

const updateStart = (state, action) => {
  return Object.assign({}, state, {
    filters: Object.assign({}, state.filters, {
      start: action.time,
    }),
  });
};

const updateEnd = (state, action) => {
  return Object.assign({}, state, {
    filters: Object.assign({}, state.filters, {
      end: action.time,
    }),
  });
};

const resetFilters = state => {
  return Object.assign({}, state, {
    filters: INITIAL_FILTER_STATE,
  });
};

// Removes all courses from the current semester.
const removeSemesterCourses = (state, action) => {
  // Get all added semesters, remove all belonging to current semester, and update cookies
  const filteredAdded = state.added.filter(
    course => course.semester !== action.semester
  );
  cookies.set(
    'added',
    filteredAdded
      .map(course => `${course.department};${course.peoplesoft_number}`)
      .join(','),
    {
      path: '/',
      expires: new Date('December 31, 9999 11:00:00'),
    }
  );

  return Object.assign({}, state, {
    added: filteredAdded,
  });
};

const applyLoadCatalog = (state, catalog) => {
  INITIAL_CATALOG = catalog;

  Object.assign(INITIAL_STATE, {
    queried: INITIAL_CATALOG,
    added: parseAddedCourses(),
  });

  Object.assign(INITIAL_STATE, applySearchCourse(INITIAL_STATE));

  return state;
};

const courseReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOAD_CATALOG:
      return applyLoadCatalog(state, action.catalog);
    case SEARCH_COURSE:
      return applySearchCourse(state, action.param);
    case RESET_LOAD:
      return applyResetLoad(state);
    case LOAD_COURSES:
      return applyLoadCourses(state, action);
    case COURSE_ADD:
      return applyAddCourse(state, action);
    case COURSE_REMOVE:
      return applyRemoveCourse(state, action);
    case COURSE_HIDE:
      if (state.hidden.indexOf(action.course) === -1)
        return applyHideCourse(state, action);
      break;
    case COURSE_UNHIDE:
      if (state.hidden.indexOf(action.course) !== -1)
        return applyUnhideCourse(state, action);
      break;
    case TOGGLE_CONFLICT:
      return toggleConf(state, action);
    case TOGGLE_SEM:
      return toggleSem(state, action);
    case TOGGLE_DIST:
      return toggleDist(state, action);
    case TOGGLE_DIV:
      return toggleDiv(state, action);
    case TOGGLE_OTHERS:
      return toggleOthers(state, action);
    case TOGGLE_LEVEL:
      return toggleLevel(state, action);
    case TOGGLE_TYPE:
      return toggleType(state, action);
    case UPDATE_START:
      return updateStart(state, action);
    case UPDATE_END:
      return updateEnd(state, action);
    case RESET_FILTERS:
      return resetFilters(state);
    case REMOVE_SEMESTER_COURSES:
      return removeSemesterCourses(state, action);
    default:
      return state;
  }

  return state;
};

export default courseReducer;
