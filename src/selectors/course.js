const isNotHidden = (hiddenCourses) => (course) =>
  hiddenCourses.indexOf(course) === -1;
const getFilters = ({ courseState }) => courseState.filters;
const getAddedCourses = ({ courseState }) => courseState.added;
const getHiddenCourses = ({ courseState }) => courseState.hidden;
const getUnhiddenCourses = ({ courseState }) => {
  if (!courseState.added) return [];
  if (!courseState.hidden) return courseState.added;
  return courseState.added.filter(isNotHidden(courseState.hidden));
};

const getCatalogUpdateTime = ({ courseState }) => {
  return courseState.updateTime;
};

const getSearchedCourses = ({ courseState }) => courseState.searched;

const getLoadedCourses = ({ courseState }) => {
  const { loadGroup } = courseState;

  if (courseState.searched.length > loadGroup * 50)
    return courseState.searched.slice(0, loadGroup * 50);
  return courseState.searched;
};

const getStartTimes = ({ courseState }) => courseState.startTimes;
const getEndTimes = ({ courseState }) => courseState.endTimes;
const getCounts = ({ courseState }) => courseState.counts;
const getQuery = ({ courseState }) => courseState.query;

const getShowFactrakScore = ({ courseState }) =>
  courseState.filters.showFactrakScore;
const getIncludeFactrakNoScores = ({ courseState }) =>
  courseState.filters.includeFactrakNoScores;
const getMinFactrakScore = ({ courseState }) =>
  courseState.filters.minFactrakScore;

export {
  getAddedCourses,
  getHiddenCourses,
  getUnhiddenCourses,
  getSearchedCourses,
  getLoadedCourses,
  getStartTimes,
  getEndTimes,
  getFilters,
  getCounts,
  getQuery,
  getCatalogUpdateTime,
  getShowFactrakScore,
  getIncludeFactrakNoScores,
  getMinFactrakScore,
};
