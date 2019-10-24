import {
  COURSE_ADD,
  COURSE_REMOVE,
  COURSE_HIDE,
  COURSE_UNHIDE,
  SEARCH_COURSE,
  LOAD_COURSES,
  RESET_LOAD,
  TOGGLE_SEM,
  TOGGLE_DIST,
  TOGGLE_DIV,
  TOGGLE_OTHERS,
  TOGGLE_CONFLICT,
  TOGGLE_LEVEL,
  TOGGLE_TYPE,
  UPDATE_START,
  UPDATE_END,
  RESET_FILTERS,
  REMOVE_SEMESTER_COURSES,
  LOAD_CATALOG,
} from "../constants/actionTypes";

const doAddCourse = (course) => ({
  type: COURSE_ADD,
  course,
});

const doRemoveCourse = (course) => ({
  type: COURSE_REMOVE,
  course,
});

const doHideCourse = (course) => ({
  type: COURSE_HIDE,
  course,
});

const doUnhideCourse = (course) => ({
  type: COURSE_UNHIDE,
  course,
});

const doSearchCourse = (param = undefined) => ({
  type: SEARCH_COURSE,
  param,
});

const doLoadCourses = (newLoadGroup) => ({
  type: LOAD_COURSES,
  newLoadGroup,
});

const doLoadCatalog = (catalog) => ({
  type: LOAD_CATALOG,
  catalog,
});

const doResetLoad = () => ({
  type: RESET_LOAD,
});

const doToggleSem = (index) => ({
  type: TOGGLE_SEM,
  index,
});

const doToggleDist = (index) => ({
  type: TOGGLE_DIST,
  index,
});

const doToggleDiv = (index) => ({
  type: TOGGLE_DIV,
  index,
});

const doToggleOthers = (index) => ({
  type: TOGGLE_OTHERS,
  index,
});

const doToggleConflict = () => ({
  type: TOGGLE_CONFLICT,
});

const doToggleLevel = (index) => ({
  type: TOGGLE_LEVEL,
  index,
});

const doToggleType = (index) => ({
  type: TOGGLE_TYPE,
  index,
});

const doUpdateStart = (time) => ({
  type: UPDATE_START,
  time,
});

const doUpdateEnd = (time) => ({
  type: UPDATE_END,
  time,
});

const doResetFilters = () => ({
  type: RESET_FILTERS,
});

const doRemoveSemesterCourses = (semester) => ({
  type: REMOVE_SEMESTER_COURSES,
  semester,
});

export {
  doAddCourse,
  doRemoveCourse,
  doHideCourse,
  doUnhideCourse,
  doSearchCourse,
  doLoadCourses,
  doResetLoad,
  doToggleConflict,
  doToggleDist,
  doToggleDiv,
  doToggleLevel,
  doToggleOthers,
  doToggleSem,
  doToggleType,
  doUpdateEnd,
  doUpdateStart,
  doResetFilters,
  doRemoveSemesterCourses,
  doLoadCatalog,
};
