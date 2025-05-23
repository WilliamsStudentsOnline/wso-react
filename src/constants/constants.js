export const PALETTE = [
  "#B3E5FC",
  "#F0F4C3",
  "#FFCCBC",
  "#CFD8DC",
  "#E1BEE7",
  "#B2DFDB",
];
export const BORDER_PALETTE = [
  "#03A9F4",
  "#AFB42B",
  "#E64A19",
  "#455A64",
  "#7B17A2",
  "#00796B",
];

export const SEMESTERS = ["Fall", "Winter", "Spring"];
export const DISTRIBUTIONS = ["dpe", "qfr", "wac"];
export const DIVISIONS = ["div1", "div2", "div3"];
export const OTHERS = ["passFail", "fifthCourse"];
export const REMOTE = ["hybrid", "remote", "in-person"];
export const LEVELS = [0, 1, 2, 3, 4];
export const FOLLETT_SEMESTER_UUID = 100082572;
let now = new Date();
// year represents the higher end of academic year
// e.g. 2024 represents the AY 2023-2024
let year = now.getFullYear();
if (now.getMonth() >= 5) {
  year++;
}
// these month dates were manually set for the academic year 2023-2024
// if not manually updated, they may be slightly off for future years
export const DATES = {
  Fall: {
    START: year - 1 + "0907",
    END: year - 1 + "1208",
  },
  Winter: {
    START: year + "0103",
    END: year + "0126",
  },
  Spring: {
    START: year + "0131",
    END: year + "0510",
  },
  PREREG: {
    SPRING: year - 1 + "1030",
    WINTER: year - 1 + "1108",
    FALL: year + "0426",
  },
};
export const START_TIMES = [
  "08:00",
  "08:15",
  "08:30",
  "09:00",
  "09:20",
  "09:45",
  "10:00",
  "10:30",
  "10:40",
  "11:30",
  "11:45",
  "12:00",
  "13:00",
  "13:10",
  "13:15",
  "13:30",
  "14:00",
  "14:30",
  "14:50",
  "15:00",
  "15:15",
  "15:30",
  "15:33",
  "16:00",
  "16:10",
  "18:45",
  "20:30",
];
export const START_TIMES12 = [
  " 8:00AM",
  " 8:15AM",
  " 8:30AM",
  " 9:00AM",
  " 9:20AM",
  " 9:45AM",
  "10:00AM",
  "10:30AM",
  "10:40AM",
  "11:30AM",
  "11:45AM",
  "12:00PM",
  " 1:00PM",
  " 1:10PM",
  " 1:15PM",
  " 1:30PM",
  " 2:00PM",
  " 2:30PM",
  " 2:50PM",
  " 3:00PM",
  " 3:15PM",
  " 3:30PM",
  " 3:33PM",
  " 4:00PM",
  " 4:10PM",
  " 6:45PM",
  " 8:30PM",
];
export const END_TIMES = [
  "08:50",
  "09:05",
  "09:15",
  "09:30",
  "09:45",
  "10:00",
  "10:10",
  "10:50",
  "11:00",
  "11:15",
  "11:30",
  "11:45",
  "12:20",
  "12:30",
  "12:35",
  "12:45",
  "12:50",
  "13:00",
  "14:20",
  "14:25",
  "14:30",
  "14:45",
  "15:00",
  "15:30",
  "15:40",
  "15:45",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "20:00",
  "21:45",
  "22:00",
];
export const END_TIMES12 = [
  " 8:50AM",
  " 9:05AM",
  " 9:15AM",
  " 9:30AM",
  " 9:45AM",
  "10:00AM",
  "10:10AM",
  "10:50AM",
  "11:00AM",
  "11:15AM",
  "11:30AM",
  "11:45AM",
  "12:20PM",
  "12:30PM",
  "12:35PM",
  "12:45PM",
  "12:50PM",
  " 1:00PM",
  " 2:20PM",
  " 2:25PM",
  " 2:30PM",
  " 2:45PM",
  " 3:00PM",
  " 3:30PM",
  " 3:40PM",
  " 3:45PM",
  " 4:00PM",
  " 4:30PM",
  " 5:00PM",
  " 5:30PM",
  " 6:00PM",
  " 8:00PM",
  " 9:45PM",
  "10:00PM",
];
export const CLASS_TYPES = [
  "Lecture",
  "Seminar",
  "Tutorial",
  "Studio",
  "Independent Study",
  "Laboratory",
];

// New Major Builder constants
export const CURRENT_ACADEMIC_YEAR =
  new Date().getMonth() >= 8
    ? new Date().getFullYear() + 1
    : new Date().getFullYear();
export const COURSE_HISTORY_START_YEAR = Math.max(
  2022,
  CURRENT_ACADEMIC_YEAR - 4
); // do not fetch courses before 2022, since THEY DO NOT EXIST; do not fetch courses >5yo
export const MAJOR_BUILDER_SEMESTERS = 8;
export const MAJOR_BUILDER_COURSES_PER_SEM = 5; // allow for 5th course inputs
export const MAJOR_BUILDER_LS_KEY = "majorBuilderState";
