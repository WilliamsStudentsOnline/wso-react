import {
  getAddedCourses,
  getHiddenCourses,
  getUnhiddenCourses,
  getSearchedCourses,
  getLoadedCourses,
  getStartTimes,
  getEndTimes,
  getFilters,
} from "../../selectors/course";

describe("Course Selector", () => {
  const course1 = {
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

  const course2 = {
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

  const course3 = {
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

  const INITIAL_STATE = {
    courseState: {
      added: [course1, course3],
      hidden: [course3],
      loadGroup: 1,
      searched: [course1, course2, course3],
      queried: [course1, course2, course3],
      startTimes: ["08:30", "11:00"],
      endTimes: ["09:45", "12:15"],
      filters: {
        semesters: [false, false, false],
        distributions: [false, false, false],
        divisions: [false, false, false],
        others: [false, false],
        levels: [false, false, false, false, false],
        conflict: [true],
        start: "",
        end: "",
      },
    },
  };

  const INITIAL_STATE_2 = {
    courseState: {
      added: [course1, course3],
      hidden: [course3],
      loadGroup: 1,
      searched: [course1, course2, course3],
      queried: [course1, course2, course3],
      startTimes: ["08:30", "11:00"],
      endTimes: ["09:45", "12:15"],
      filters: {
        semesters: [false, false, false],
        distributions: [false, false, false],
        divisions: [false, false, false],
        others: [false, false],
        levels: [false, false, false, false, false],
        conflict: [false],
        start: "",
        end: "",
      },
    },
  };

  it("retrieves filters", () => {
    const expectedFilters = {
      semesters: [false, false, false],
      distributions: [false, false, false],
      divisions: [false, false, false],
      others: [false, false],
      levels: [false, false, false, false, false],
      conflict: [true],
      start: "",
      end: "",
    };
    const filters = getFilters(INITIAL_STATE);
    expect(filters).toEqual(expectedFilters);
  });

  it("gets searched courses", () => {
    const expectedSearchedCourses = [course1, course2, course3];
    const searchedCourses = getSearchedCourses(INITIAL_STATE_2);
    expect(searchedCourses).toEqual(expectedSearchedCourses);
  });

  it("gets loaded courses", () => {
    const expectedLoadedCourses = [course1, course2, course3];
    const loadedCourses = getLoadedCourses(INITIAL_STATE_2);
    expect(loadedCourses).toEqual(expectedLoadedCourses);
  });

  it("gets added courses", () => {
    const expectedAddedCourses = [course1, course3];
    const addedCourses = getAddedCourses(INITIAL_STATE);
    expect(addedCourses).toEqual(expectedAddedCourses);
  });

  it("gets hidden courses", () => {
    const expectedHiddenCourses = [course3];
    const hiddenCourses = getHiddenCourses(INITIAL_STATE);
    expect(hiddenCourses).toEqual(expectedHiddenCourses);
  });

  it("gets unhidden courses", () => {
    const expectedUnhiddenCourses = [course1];
    const unhiddenCourses = getUnhiddenCourses(INITIAL_STATE);
    expect(unhiddenCourses).toEqual(expectedUnhiddenCourses);
  });

  it("gets start times", () => {
    const expectedStartTime = ["08:30", "11:00"];
    const startTime = getStartTimes(INITIAL_STATE);
    expect(startTime).toEqual(expectedStartTime);
  });

  it("gets end times", () => {
    const expectedEndTime = ["09:45", "12:15"];
    const endTime = getEndTimes(INITIAL_STATE);
    expect(endTime).toEqual(expectedEndTime);
  });
});
