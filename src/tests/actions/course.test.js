import {
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
  doUpdateEnd,
  doUpdateStart,
  doToggleType,
  doResetFilters,
  doRemoveSemesterCourses,
  doLoadCatalog,
} from "../../actions/course";
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
} from "../../constants/actionTypes";

describe("course action", () => {
  it("adds course", () => {
    const course = { title: "course" };

    const expectedAction = {
      type: COURSE_ADD,
      course,
    };
    const action = doAddCourse(course);

    expect(action).toEqual(expectedAction);
  });

  it("removes course", () => {
    const course = { title: "course" };

    const expectedAction = {
      type: COURSE_REMOVE,
      course,
    };
    const action = doRemoveCourse(course);

    expect(action).toEqual(expectedAction);
  });

  it("hides course", () => {
    const course = { title: "course" };

    const expectedAction = {
      type: COURSE_HIDE,
      course,
    };
    const action = doHideCourse(course);

    expect(action).toEqual(expectedAction);
  });

  it("unhides course", () => {
    const course = { title: "course" };

    const expectedAction = {
      type: COURSE_UNHIDE,
      course,
    };
    const action = doUnhideCourse(course);

    expect(action).toEqual(expectedAction);
  });

  it("searches course", () => {
    const param = "param";
    const expectedAction = {
      type: SEARCH_COURSE,
      param,
    };
    const action = doSearchCourse(param);

    expect(action).toEqual(expectedAction);
  });

  it("loads courses", () => {
    const newLoadGroup = 2;

    const expectedAction = {
      type: LOAD_COURSES,
      newLoadGroup,
    };
    const action = doLoadCourses(newLoadGroup);

    expect(action).toEqual(expectedAction);
  });

  it("resets loading", () => {
    const expectedAction = {
      type: RESET_LOAD,
    };
    const action = doResetLoad();

    expect(action).toEqual(expectedAction);
  });

  it("toggles semester", () => {
    const index = 1;

    const expectedAction = {
      type: TOGGLE_SEM,
      index,
    };
    const action = doToggleSem(index);

    expect(action).toEqual(expectedAction);
  });

  it("toggles distributions", () => {
    const index = 1;

    const expectedAction = {
      type: TOGGLE_DIST,
      index,
    };
    const action = doToggleDist(index);

    expect(action).toEqual(expectedAction);
  });

  it("toggles divisions", () => {
    const index = 1;

    const expectedAction = {
      type: TOGGLE_DIV,
      index,
    };
    const action = doToggleDiv(index);

    expect(action).toEqual(expectedAction);
  });

  it("toggles others", () => {
    const index = 1;

    const expectedAction = {
      type: TOGGLE_OTHERS,
      index,
    };
    const action = doToggleOthers(index);

    expect(action).toEqual(expectedAction);
  });

  it("toggles conflict", () => {
    const expectedAction = {
      type: TOGGLE_CONFLICT,
    };
    const action = doToggleConflict();

    expect(action).toEqual(expectedAction);
  });

  it("resets filters", () => {
    const expectedAction = {
      type: RESET_FILTERS,
    };
    const action = doResetFilters();

    expect(action).toEqual(expectedAction);
  });

  it("removes semester courses", () => {
    const expectedAction = {
      type: REMOVE_SEMESTER_COURSES,
    };
    const action = doRemoveSemesterCourses();

    expect(action).toEqual(expectedAction);
  });

  it("toggles level", () => {
    const index = 1;

    const expectedAction = {
      type: TOGGLE_LEVEL,
      index,
    };
    const action = doToggleLevel(index);

    expect(action).toEqual(expectedAction);
  });

  it("toggles type", () => {
    const index = 1;

    const expectedAction = {
      type: TOGGLE_TYPE,
      index,
    };
    const action = doToggleType(index);

    expect(action).toEqual(expectedAction);
  });

  it("updates start time", () => {
    const time = "14:10";

    const expectedAction = {
      type: UPDATE_START,
      time,
    };
    const action = doUpdateStart(time);

    expect(action).toEqual(expectedAction);
  });

  it("updates end time", () => {
    const time = "15:35";

    const expectedAction = {
      type: UPDATE_END,
      time,
    };
    const action = doUpdateEnd(time);

    expect(action).toEqual(expectedAction);
  });

  it("loads catalog", () => {
    const catalog = [{ name: "course" }];
    const expectedAction = {
      type: LOAD_CATALOG,
      catalog,
    };
    const action = doLoadCatalog(catalog);

    expect(action).toEqual(expectedAction);
  });
});
