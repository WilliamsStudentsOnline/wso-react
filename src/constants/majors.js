import {
  MAJOR_BUILDER_COURSES_PER_SEM,
  MAJOR_BUILDER_SEMESTERS,
} from "./constants";

const courseFormatRegex = /^[A-Z]{3,4} \d{2,5}/;
export const csRegexSeparator = "\n";

/* Checks if 'n' top-level slots from a potentially nested list are fulfilled
A slot (element in nestedCourseList) can be:
- a single course string (e.g. "MATH 151")
- a single placeholder (e.g. "Colloquium")
- regex of the form "<text to render>\n<REGEXP>" (without the <>s)
- an array including any of the above, representing an OR choice
Include an ignore list to specify courses that the regexp will not match to
*/
function checkRequireN(args, grid, fulfilledBy, fulfillments) {
  const [nestedCourseList, n, ignore = []] = args; // CONTROLLED BY REQUIREMENT !!!
  let autoFulfilledCount = 0;
  const placeholders = [];

  for (const reqItem of nestedCourseList) {
    const itemsToCheck = Array.isArray(reqItem) ? reqItem : [reqItem];
    for (const itemStr of itemsToCheck) {
      if (
        !courseFormatRegex.test(itemStr) &&
        !itemStr.includes(csRegexSeparator)
      )
        placeholders.push(itemStr);
    }
  }

  const courses = [];
  for (let semId = 0; semId < MAJOR_BUILDER_SEMESTERS; semId++) {
    for (let crsId = 0; crsId < MAJOR_BUILDER_COURSES_PER_SEM; crsId++) {
      if (grid[semId][crsId]?.course) {
        courses.push(grid[semId][crsId].course);
      }
    }
  }

  // Iterate through the top-level requirement slots
  for (const reqItem of nestedCourseList) {
    if (autoFulfilledCount >= n) break;

    let currentSlotFulfilled = false;
    const itemsToCheck = Array.isArray(reqItem) ? reqItem : [reqItem];

    for (const itemStr of itemsToCheck) {
      if (fulfilledBy[itemStr]) {
        if (
          fulfilledBy[itemStr].courseID &&
          !courses.some((c) => c.courseID === fulfilledBy[itemStr].courseID)
        ) {
          delete fulfillments[fulfilledBy[itemStr].courseID];
          delete fulfilledBy[itemStr];
        } else {
          continue;
        }
      }

      let foundCourse = null;

      // Regex fulfillment (i.e. for electives, more arbitrary requirements)
      if (itemStr.includes(csRegexSeparator)) {
        const [description, regexString] = itemStr.split(csRegexSeparator);
        try {
          const regex = new RegExp(regexString);
          for (let userCourse of courses) {
            const userCourseCode = `${userCourse.department} ${userCourse.number}`;
            const mainCodeMatches = regex.test(userCourseCode);
            const crossListingMatches =
              userCourse.crossListing &&
              userCourse.crossListing.some((cl) => regex.test(cl));
            const notIgnored =
              !ignore.includes(userCourseCode) &&
              !(
                userCourse.crossListing &&
                userCourse.crossListing.some((cl) => ignore.includes(cl))
              );
            if (
              !fulfillments[userCourse.courseID] &&
              (mainCodeMatches || crossListingMatches) &&
              notIgnored
            ) {
              foundCourse = userCourse;
            }
          }
        } catch (e) {
          console.error(
            `Invalid regex in requirement "${description}": ${regexString}`,
            e
          );
          continue;
        }
      }
      // Standard course fulfillment (direct/cross-listed match)
      else if (courseFormatRegex.test(itemStr)) {
        const [reqDept, reqNumStr] = itemStr.split(" ");
        const reqNum = parseInt(reqNumStr, 10);
        if (reqDept && !isNaN(reqNum)) {
          for (let userCourse of courses) {
            if (
              (!fulfillments[userCourse.courseID] &&
                userCourse.department === reqDept &&
                userCourse.number === reqNum) ||
              (userCourse.crossListing &&
                userCourse.crossListing.includes(itemStr))
            ) {
              foundCourse = userCourse;
            }
          }
        }
      }

      if (foundCourse) {
        fulfilledBy[itemStr] = foundCourse;
        fulfillments[foundCourse.courseID] = itemStr;
        currentSlotFulfilled = true;
        break;
      }
    }

    if (currentSlotFulfilled) {
      autoFulfilledCount++;
    }
  }

  return {
    autoFulfilledCount,
    fulfilledBy,
    fulfillments,
    placeholders,
  };
}

function checkRequireNWithYear(args, grid, fulfilledBy, fulfillments) {
  const minSem = args[3];
  if (minSem) {
    const newGrid = JSON.parse(JSON.stringify(grid));
    for (let semId = 0; semId < minSem; semId++) {
      for (let crsId = 0; crsId < MAJOR_BUILDER_COURSES_PER_SEM; crsId++) {
        newGrid[semId][crsId].course = null;
      }
    }
    return checkRequireN(args, newGrid, fulfilledBy, fulfillments);
  }
  console.error("Error on checkRequireWithYear args", args);
  return {
    autoFulfilledCount: 0,
    fulfilledBy,
    fulfillments,
    placeholders: [],
  };
}

// Map identifier strings to actual functions
export const requirementCheckers = {
  requireN: checkRequireN,
  requireNWithYear: checkRequireNWithYear,
};

/* Each major should have the format
"Major Name": {
  Link: "link to major requirements on Williams site",
  Prefix: "DEPT",
  Division: 0/1/2/3,
  Info: ["each string here will be rendered as a bullet point below the header"],
  Requirements: [
    {
      description: "name of the category",
      // identifier defaults to requireN if left out
      args: [
        nestedList,
        n,
        ignore (optional),
        minSemester (only for requireNWithYear; 1-indexed),
      ]
      }
    }, ...
  ]
}
*/

/* --- CONFIGURE MAJOR REQUIREMENTS --- */
export const MAJORS = {
  "Contract Major": {
    Link: "https://registrar.williams.edu/contract-major/",
    Prefix: "",
    Division: 0,
    Info: ["TODO"],
    Requirements: [
      {
        description: "Helpful links",
        args: [
          [
            "Apply to be a Goodrich Barista: https://sites.williams.edu/goodrich/our-team/",
          ],
          1,
        ],
      },
    ],
  },
  Mathematics: {
    Prefix: "MATH",
    Division: 3,
    Link: "https://math.williams.edu/courses/requirements-for-the-major/",
    Info: ["TODO 1", "TODO 2"],
    Requirements: [
      {
        description: "Calculus",
        args: [
          [
            [
              "MATH 140",
              "Elective (if AP requirements satisfied)\n^MATH [0-9]{3}",
            ],
            ["MATH 150", "MATH 151"],
          ],
          2,
          [
            "MATH 140",
            "MATH 150",
            "MATH 151",
            "MATH 200",
            "STAT 201",
            "PHYS 210",
            "MATH 309",
            "MATH 250",
            "MATH 350",
            "MATH 351",
            "MATH 355",
          ],
        ],
      },
      {
        description: "Applied/Discrete",
        args: [
          [
            [
              "MATH 200",
              "STAT 201",
              "PHYS 210",
              "MATH 309",
              "Advanced approved elective",
            ],
          ],
          1,
        ],
      },
      {
        description: "Core",
        identifier: "requireN",
        args: [["MATH 250", ["MATH 350", "MATH 351"], "MATH 355"], 3],
      },
      {
        description: "Electives",
        args: [
          [
            "Elective 1\n^(MATH|STAT) (3[0-9]{2}|[4-9][0-9]{2})",
            "Elective 2\n^(MATH|STAT) (3[0-9]{2}|[4-9][0-9]{2})",
          ],
          2,
          [
            "MATH 140",
            "MATH 150",
            "MATH 151",
            "MATH 200",
            "STAT 201",
            "PHYS 210",
            "MATH 309",
            "MATH 250",
            "MATH 350",
            "MATH 351",
            "MATH 355",
          ],
        ],
      },
      {
        description: "Senior",
        identifier: "requireNWithYear",
        args: [
          [
            "Senior major course\n^(MATH|STAT) (4[0-7][0-9])",
            "Math colloquium",
          ],
          2,
          [],
          6,
        ],
      },
    ],
  },
};
