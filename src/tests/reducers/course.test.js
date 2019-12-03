import deepFreeze from "deep-freeze";
import courseReducer, { DEFAULT_SEMESTER } from "../../reducers/course";
import {
  SEMESTERS,
  DISTRIBUTIONS,
  DIVISIONS,
  OTHERS,
  LEVELS,
  CLASS_TYPES,
} from "../../constants/constants";
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
} from "../../constants/actionTypes";

jest.mock("axios");

describe("Course reducer", () => {
  const course = {
    year: 2020,
    semester: "Fall",
    courseID: "020209",
    department: "AFR",
    number: 105,
    section: "01",
    peoplesoftNumber: 1089,
    consent: "N",
    gradingBasisDesc: "Pass/Fail Available, Fifth Course Available",
    classType: "Lecture",
    titleLong: "Materials, Meanings, And Messages In The Arts Of Africa",
    titleShort: "African Art Survey",
    instructors: [{ id: 0, name: "Michelle M. Apotsos" }],
    meetings: [
      { days: "MW", start: "11:00", end: "12:15", facility: "Lawrence 231" },
    ],
    courseAttributes: {
      div1: false,
      div2: true,
      div3: false,
      dpe: true,
      qfr: false,
      wac: false,
      passFail: true,
      fifthCourse: true,
    },
    classFormat: "",
    classReqEval:
      "Three 2-page response papers, class journal on WCMA objects lab, midterm exam and final exam",
    extraInfo: "",
    prereqs: "None",
    departmentNotes: "",
    descriptionSearch:
      "This course introduces students to the wealth, power, and diversity of expressive forms..",
    enrolmentPreferences: "Art History and African Studies majors",
    crossListing: ["AFR 105", "ARTH 104"],
    components: ["Lecture"],
  };

  const otherCourse = {
    year: 2020,
    semester: "Fall",
    courseID: "020941",
    department: "AMST",
    number: 126,
    section: "01",
    peoplesoftNumber: 1697,
    consent: "N",
    gradingBasisDesc: "No Pass/Fail and No Fifth Course",
    classType: "Seminar",
    titleLong: "Black Literature Matters",
    titleShort: "Black Literature Matters",
    instructors: [{ id: 0, name: "Kimberly S. Love" }],
    meetings: [
      {
        days: "TR",
        start: "08:30",
        end: "09:45",
        facility: "Hopkins Hall 400 (Rogers Room)",
      },
    ],
    courseAttributes: {
      div1: false,
      div2: true,
      div3: false,
      dpe: true,
      qfr: false,
      wac: true,
      passFail: false,
      fifthCourse: false,
    },
    classFormat: "",
    classReqEval:
      "Four papers totaling at least 20 pages, active class participation, class presentation",
    extraInfo: "",
    prereqs: "None",
    departmentNotes: "",
    descriptionSearch:
      "Black literature remains central to struggles for freedom and equality across the African ...",
    enrolmentPreferences:
      "First-year students who have not taken or placed out of a 100-level English course; Africana Studies concentrators; American Studies majors",
    crossListing: ["AFR 126", "AMST 126", "ENGL 126"],
    components: ["Seminar"],
  };

  it("resets loads", () => {
    const action = {
      type: RESET_LOAD,
    };

    const previousState = { loadGroup: 5, error: null };
    const expectedNewState = { loadGroup: 1, error: null };

    deepFreeze(previousState);
    const changedState = courseReducer(previousState, action);

    expect(changedState).toEqual(expectedNewState);
  });

  it("loads courses", () => {
    const index = 3;

    const action = {
      type: LOAD_COURSES,
      newLoadGroup: index,
    };

    const previousState = { loadGroup: 1, error: null };
    const expectedNewState = { loadGroup: 3, error: null };

    deepFreeze(previousState);
    const changedState = courseReducer(previousState, action);

    expect(changedState).toEqual(expectedNewState);
  });

  it("add courses", () => {
    const action = {
      type: COURSE_ADD,
      course,
    };

    const previousState = { added: [], error: null };
    const expectedNewState = { added: [course], error: null };

    deepFreeze(previousState);
    const changedState = courseReducer(previousState, action);

    expect(changedState).toEqual(expectedNewState);
  });

  it("removes courses", () => {
    const action = {
      type: COURSE_REMOVE,
      course,
    };

    const previousState = { added: [course], error: null };
    const expectedNewState = { added: [], error: null };

    deepFreeze(previousState);
    const changedState = courseReducer(previousState, action);

    expect(changedState).toEqual(expectedNewState);
  });

  it("hide courses", () => {
    const action = {
      type: COURSE_HIDE,
      course,
    };

    const previousState = { hidden: [], error: null };
    const expectedNewState = { hidden: [course], error: null };

    deepFreeze(previousState);
    const changedState = courseReducer(previousState, action);

    expect(changedState).toEqual(expectedNewState);
  });

  it("unhides courses", () => {
    const action = {
      type: COURSE_UNHIDE,
      course,
    };

    const previousState = { hidden: [course], error: null };
    const expectedNewState = { hidden: [], error: null };

    deepFreeze(previousState);
    const changedState = courseReducer(previousState, action);

    expect(changedState).toEqual(expectedNewState);
  });

  it("searches courses", () => {
    const param = "AFR105";
    const filters = {
      semesters: [false, false, false],
      distributions: [false, false, false],
      divisions: [false, false, false],
      others: [false, false],
      levels: [false, false, false, false, false],
      conflict: [false],
      start: "",
      end: "",
      classTypes: [false, false, false, false, false, false],
    };
    const counts = {
      semesters: [0, 0, 0],
      distributions: [0, 0, 0],
      divisions: [0, 0, 0],
      others: [0, 0],
      levels: [0, 0, 0, 0, 0],
      conflict: [0],
      classTypes: [0, 0, 0, 0, 0, 0],
    };

    const loadAction = {
      type: LOAD_CATALOG,
      catalog: {
        courses: [course, otherCourse],
      },
    };
    const action = {
      type: SEARCH_COURSE,
      param,
    };

    const previousState = {
      filters,
      searched: null,
      query: "",
      error: null,
      loadGroup: 1,
      counts,
      queried: [],
    };
    const expectedNewState = {
      filters,
      searched: [Object.assign({}, course, { score: 10001 })],
      query: param,
      error: null,
      loadGroup: 1,
      counts: {
        semesters: [1, 0, 0],
        distributions: [1, 0, 0],
        divisions: [0, 1, 0],
        others: [1, 1],
        levels: [0, 1, 0, 0, 0],
        conflict: [1],
        classTypes: [1, 0, 0, 0, 0, 0],
      },
      queried: [Object.assign({}, course, { score: 10001 })],
    };

    deepFreeze(previousState);

    const loadedState = courseReducer(previousState, loadAction);
    const changedState = courseReducer(loadedState, action);
    expect(changedState).toEqual(expectedNewState);
  });

  it("toggles conflict", () => {
    const action = {
      type: TOGGLE_CONFLICT,
    };

    const previousState = { filters: { conflict: [true] }, error: null };
    const expectedNewState = { filters: { conflict: [false] }, error: null };

    deepFreeze(previousState);
    const changedState = courseReducer(previousState, action);

    expect(changedState).toEqual(expectedNewState);
  });

  it("toggles semester", () => {
    const index = 1;

    const action = {
      type: TOGGLE_SEM,
      index,
    };

    const previousState = {
      filters: { semesters: [false, false, false] },
      error: null,
    };
    const expectedNewState = {
      filters: { semesters: [false, SEMESTERS[1], false] },
      error: null,
    };

    deepFreeze(previousState);
    const changedState = courseReducer(previousState, action);

    expect(changedState).toEqual(expectedNewState);
  });

  it("toggles distribution", () => {
    const index = 1;

    const action = {
      type: TOGGLE_DIST,
      index,
    };

    const previousState = {
      filters: { distributions: [false, false, false] },
      error: null,
    };
    const expectedNewState = {
      filters: { distributions: [false, DISTRIBUTIONS[1], false] },
      error: null,
    };

    deepFreeze(previousState);
    const changedState = courseReducer(previousState, action);

    expect(changedState).toEqual(expectedNewState);
  });

  it("toggles division", () => {
    const index = 1;

    const action = {
      type: TOGGLE_DIV,
      index,
    };

    const previousState = {
      filters: { divisions: [false, false, false] },
      error: null,
    };
    const expectedNewState = {
      filters: { divisions: [false, DIVISIONS[1], false] },
      error: null,
    };

    deepFreeze(previousState);
    const changedState = courseReducer(previousState, action);

    expect(changedState).toEqual(expectedNewState);
  });

  it("toggles type", () => {
    const index = 1;

    const action = {
      type: TOGGLE_TYPE,
      index,
    };

    const previousState = {
      filters: { classTypes: [false, false, false, false, false, false] },
      error: null,
    };
    const expectedNewState = {
      filters: {
        classTypes: [false, CLASS_TYPES[1], false, false, false, false],
      },
      error: null,
    };

    deepFreeze(previousState);
    const changedState = courseReducer(previousState, action);

    expect(changedState).toEqual(expectedNewState);
  });

  it("toggles others", () => {
    const index = 1;

    const action = {
      type: TOGGLE_OTHERS,
      index,
    };

    const previousState = { filters: { others: [false, false] }, error: null };
    const expectedNewState = {
      filters: { others: [false, OTHERS[1]] },
      error: null,
    };

    deepFreeze(previousState);
    const changedState = courseReducer(previousState, action);
    expect(changedState).toEqual(expectedNewState);
  });

  it("toggles level", () => {
    const index = 1;

    const action = {
      type: TOGGLE_LEVEL,
      index,
    };

    const previousState = {
      filters: { levels: [false, false, false, false, false] },
      error: null,
    };
    const expectedNewState = {
      filters: { levels: [false, LEVELS[1], false, false, false] },
      error: null,
    };

    deepFreeze(previousState);
    const changedState = courseReducer(previousState, action);
    expect(changedState).toEqual(expectedNewState);
  });

  it("updates start time", () => {
    const time = "14:30";

    const action = {
      type: UPDATE_START,
      time,
    };

    const previousState = { filters: { start: "" }, error: null };
    const expectedNewState = { filters: { start: time }, error: null };

    deepFreeze(previousState);
    const changedState = courseReducer(previousState, action);
    expect(changedState).toEqual(expectedNewState);
  });

  it("updates end time", () => {
    const time = "15:35";

    const action = {
      type: UPDATE_END,
      time,
    };

    const previousState = { filters: { end: "" }, error: null };
    const expectedNewState = { filters: { end: time }, error: null };

    deepFreeze(previousState);
    const changedState = courseReducer(previousState, action);
    expect(changedState).toEqual(expectedNewState);
  });

  it("reset filters", () => {
    const action = {
      type: RESET_FILTERS,
    };

    const previousState = { filters: { end: "previous" }, error: null };
    const expectedNewState = {
      filters: {
        semesters: DEFAULT_SEMESTER,
        distributions: [false, false, false],
        divisions: [false, false, false],
        others: [false, false],
        levels: [false, false, false, false, false],
        conflict: [false],
        start: "",
        end: "",
        classTypes: [false, false, false, false, false, false],
      },
      error: null,
    };

    deepFreeze(previousState);
    const changedState = courseReducer(previousState, action);
    expect(changedState).toEqual(expectedNewState);
  });

  it("removes semester courses", () => {
    const action = {
      type: REMOVE_SEMESTER_COURSES,
      semester: "Fall",
    };

    const previousState = { added: [course], error: null };
    const expectedNewState = {
      added: [],
      error: null,
    };

    deepFreeze(previousState);
    const changedState = courseReducer(previousState, action);
    expect(changedState).toEqual(expectedNewState);
  });
});
