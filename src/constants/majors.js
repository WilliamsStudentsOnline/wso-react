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
// DEPRECATED
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
            const matches =
              userCourse.crossListing &&
              userCourse.crossListing.some((cl) => regex.test(cl));
            const notIgnored =
              !ignore.includes(userCourseCode) &&
              !(
                userCourse.crossListing &&
                userCourse.crossListing.some((cl) => ignore.includes(cl))
              );
            if (!fulfillments[userCourse.courseID] && matches && notIgnored) {
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
              fulfillments[userCourse.courseID](
                userCourse.crossListing &&
                  userCourse.crossListing.includes(itemStr)
              )
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

/* Wrapper on checkRequireN that allows for a miniumum semester to be fulfilled
This argument is 1-indexed (e.g. 5 is 5th sem, so junior year or after)
*/
// DEPRECATED
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

/* Checks if n complex, versatile requirements are fulfilled
A slot (element in requireDict) can be:
- a requirement object
- a list of requirement objects (representing an OR group)
Each requirement object must have either:
- description: string; AND >1 constraints (specified below)
- placeholder: string (means the user must click it, no checks performed)
Constraint options for auto-filling:
- minSem: int; 1-indexed minimum semester
- course: string; matches directly with listing or cross listings
- ignore: list; course must not be in this list to match
- classType: regexp; e.g. (Tutorial|Seminar)
- regex: regexp; matches with DEPT 123 (e.g. ^AFR 2)
- attributes: regexp; matches with special attributes (may need to check Williams catalog, e.g. AFR_AFRCORE)
*/
function checkRequireNComplex(args, grid, fulfilledBy, fulfillments) {
  const [requirements, n] = args;
  let autoFulfilledCount = 0;
  const placeholders = [];

  for (const reqItem of requirements) {
    const itemsToCheck = Array.isArray(reqItem) ? reqItem : [reqItem];
    for (const item of itemsToCheck) {
      if (item.placeholder) placeholders.push(item.placeholder);
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
  for (const reqItem of requirements) {
    if (autoFulfilledCount >= n) break;

    let currentSlotFulfilled = false;
    const itemsToCheck = Array.isArray(reqItem) ? reqItem : [reqItem];

    for (const item of itemsToCheck) {
      const id = item.description;
      if (fulfilledBy[id]) {
        if (
          fulfilledBy[id].courseID &&
          !courses.some((c) => c.courseID === fulfilledBy[id].courseID)
        ) {
          delete fulfillments[fulfilledBy[id].courseID];
          delete fulfilledBy[id];
        } else {
          continue;
        }
      }

      if (item.placeholder) {
        continue;
      }

      let foundCourse = null;
      let filteredCourses = JSON.parse(JSON.stringify(courses)).filter(
        (c) => !fulfillments[c.courseID]
      );

      if (item.minSem) {
        const semFilteredCourses = [];
        for (
          let semIdx = item.minSem - 1;
          semIdx < MAJOR_BUILDER_SEMESTERS;
          semIdx++
        ) {
          for (
            let crsIdx = 0;
            crsIdx < MAJOR_BUILDER_COURSES_PER_SEM;
            crsIdx++
          ) {
            if (grid[semIdx][crsIdx].course) {
              semFilteredCourses.push(grid[semIdx][crsIdx].course);
            }
          }
        }
        filteredCourses = filteredCourses.filter((c) =>
          semFilteredCourses.includes(c)
        );
      }

      if (item.course) {
        filteredCourses = filteredCourses.filter((c) =>
          c.crossListing.includes(item.course)
        );
      }

      if (item.ignore) {
        filteredCourses = filteredCourses.filter(
          (c) =>
            !item.ignore.includes(`${c.department} ${c.courseNumber}`) &&
            !c.crossListing.any((i) => item.ignore.includes(i))
        );
      }

      if (item.classType) {
        const regexp = new RegExp(item.classType);
        filteredCourses = filteredCourses.filter((c) =>
          regexp.test(c.classType)
        );
      }

      if (item.regex) {
        const regex = new RegExp(item.regex);
        filteredCourses = filteredCourses.filter((c) =>
          c.crossListing.some((i) => regex.test(i))
        );
      }

      if (item.attributes) {
        const regex = new RegExp(item.attributes);
        filteredCourses = filteredCourses.filter((c) =>
          c.rawAttributes.some((a) => regex.test(a))
        );
      }

      foundCourse = filteredCourses[0];

      if (foundCourse) {
        fulfilledBy[id] = foundCourse;
        fulfillments[foundCourse.courseID] = id;
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

// Map identifier strings to actual functions
export const requirementCheckers = {
  requireN: checkRequireN, // DEPRECATED
  requireNWithYear: checkRequireNWithYear, // DEPRECATED
  complexN: checkRequireNComplex,
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
      identifier: "id of checker func", (defaults to requireN if left out)
      args: [
        specific to checker func
      ]
    }, ...
  ]
}
*/

/* --- CONFIGURE MAJOR REQUIREMENTS --- */
export const MAJORS = {
  "Africana Studies": {
    Link: "https://africana-studies.williams.edu/for-students/the-major/",
    Prefix: "AFR",
    Division: 2,
    Info: [
      "Africana Studies majors must take six electives.",
      "Three (3) of the six electives must be “Core Electives” and must be equally distributed among the three routes so that all majors will take a minimum of one course in each area. No more than two of these three Core Electives can be at the same course level.",
      "The three remaining courses can be core electives or electives (cross-listed courses). We encourage students to take at least one course in a program /department other than Africana Studies and to consider an experiential learning Winter Study session.",
    ],
    Requirements: [
      {
        description: "Core",
        args: [
          [
            {
              description: "AFR 200",
              course: "AFR 200",
            },
            {
              description:
                "300-level AFR seminar/tutorial marked as a core elective",
              classType: "^(Seminar|Tutorial)",
              attributes: "^AFR_AFRCORE",
              regex: "^AFR (3[0-9]{2})",
            },
            {
              description: "Senior Capstone",
              attributes: "^AFR_AFRCAP",
              minSem: 7,
            },
          ],
          3,
        ],
      },
      {
        description: "Core Electives",
        args: [
          [
            {
              description: "Theories, Methods, and Poetics elective",
              attributes: "^AFR_AFRTMP",
            },
            {
              description:
                "Culture, Performance, and Popular Technologies elective",
              attributes: "^AFR_AFRCTTP",
            },
            {
              description: "Black Landscapes elective",
              attributes: "^AFR_AFRBL",
            },
          ],
          3,
        ],
      },
      {
        description: "Electives",
        args: [
          [
            {
              description: "AFR elective (1)",
              attributes: "^(AFR_AFRCORE|AFR_AFRELEC)",
            },
            {
              description: "AFR elective (2)",
              attributes: "^(AFR_AFRCORE|AFR_AFRELEC)",
            },
            {
              description: "AFR elective (3)",
              attributes: "^(AFR_AFRCORE|AFR_AFRELEC)",
            },
          ],
          3,
        ],
      },
    ],
  },
  "American Studies": {
    Link: "https://american-studies.williams.edu/the-major/",
    Prefix: "AMST",
    Division: 2,
    Info: [
      "We recommend consulting the department website and AMST advisors for more information and clarity. This tool does not interface well with the AMST major.",
      "AMST majors take seven (7) electives, concentrating them in one of four (4) specializations.",
      "Majors either pursue a 5-1-1 or 4-1-1-1 layout for their specializations. Note that this is inconsistent with the numbers posted below.",
      "At least one of the electives must be a pre-19th-century course.",
      "The program accepts up to two courses for AMST credit toward the major.",
    ],
    Requirements: [
      {
        description: "Core",
        args: [
          [
            {
              description: "AMST 101",
              course: "AMST 101",
            },
            {
              description: "AMST 301",
              course: "AMST 301",
            },
            {
              description: "Senior Seminar",
              attributes: "^AMST_AMSTSEM",
              minSem: 7,
            },
          ],
          3,
        ],
      },
      {
        description: "Pre-19th century",
        args: [
          [
            {
              description: "Pre 19th-century AMST course",
              attributes: "^AMST_AMSTPRE19C",
            },
          ],
          1,
        ],
      },
      {
        description: "Arts in Context",
        args: [
          [
            {
              description: "Arts in Context elective (1)",
              attributes: "^AMST_AMSTARTS",
            },
            {
              description: "Arts in Context elective (2)",
              attributes: "^AMST_AMSTARTS",
            },
            {
              description: "Arts in Context elective (3)",
              attributes: "^AMST_AMSTARTS",
            },
            {
              description: "Arts in Context elective (4)",
              attributes: "^AMST_AMSTARTS",
            },
            {
              description: "Arts in Context elective (5)",
              attributes: "^AMST_AMSTARTS",
            },
          ],
          1,
        ],
      },
      {
        description: "Comparative Studies in Race, Ethnicity and Diaspora",
        args: [
          [
            {
              description: "Comparative Studies elective (1)",
              attributes: "^AMST_AMSTCOMP",
            },
            {
              description: "Comparative Studies elective (2)",
              attributes: "^AMST_AMSTCOMP",
            },
            {
              description: "Comparative Studies elective (3)",
              attributes: "^AMST_AMSTCOMP",
            },
            {
              description: "Comparative Studies elective (4)",
              attributes: "^AMST_AMSTCOMP",
            },
            {
              description: "Comparative Studies elective (5)",
              attributes: "^AMST_AMSTCOMP",
            },
          ],
          1,
        ],
      },
      {
        description: "Critical and Cultural Theory",
        args: [
          [
            {
              description: "Critical/Cultural Theory elective (1)",
              attributes: "^AMST_AMSTCRIT",
            },
            {
              description: "Critical/Cultural Theory elective (2)",
              attributes: "^AMST_AMSTCRIT",
            },
            {
              description: "Critical/Cultural Theory elective (3)",
              attributes: "^AMST_AMSTCRIT",
            },
            {
              description: "Critical/Cultural Theory elective (4)",
              attributes: "^AMST_AMSTCRIT",
            },
            {
              description: "Critical/Cultural Theory elective (5)",
              attributes: "^AMST_AMSTCRIT",
            },
          ],
          1,
        ],
      },
      {
        description: "Space and Place",
        args: [
          [
            {
              description: "Space/Place Elective (1)",
              attributes: "^AMST_AMSTSPACE",
            },
            {
              description: "Space/Place Elective (2)",
              attributes: "^AMST_AMSTSPACE",
            },
            {
              description: "Space/Place Elective (3)",
              attributes: "^AMST_AMSTSPACE",
            },
            {
              description: "Space/Place Elective (4)",
              attributes: "^AMST_AMSTSPACE",
            },
            {
              description: "Space/Place Elective (5)",
              attributes: "^AMST_AMSTSPACE",
            },
          ],
          1,
        ],
      },
    ],
  },
  "Arabic Studies": {
    Link: "https://arabic.williams.edu/arabic-major-certificate/",
    Prefix: "ARAB",
    Division: 1,
    Info: [
      "Excluding core courses, students must also take at least one 400-level ARAB course, in addition to three other courses on Arabic and Middle Eastern Studies in Arabic Studies or affiliated units. At least one of these courses should be from the arenas of language and the arts (DIV I) and at least one from politics, religion, economics, history, etc. (DIV II).",
      "Students who place into more advanced language courses may substitute additional courses, adding up to a total of at least nine.",
      "Up to four courses from approved semester or year-long study away programs may be counted toward the major. Students may also be granted 1 credit towards the major for intensive summer language study at department-approved programs.",
    ],
    Requirements: [
      {
        description: "Core",
        args: [
          [
            {
              description: "ARAB 101",
              course: "ARAB 101",
            },
            {
              description: "ARAB 102",
              course: "ARAB 102",
            },
            {
              description: "ARAB 201",
              course: "ARAB 201",
            },
            {
              description: "ARAB 202",
              course: "ARAB 202",
            },
            {
              description: "ARAB 301",
              course: "ARAB 301",
            },
            {
              description: "ARAB 302",
              course: "ARAB 302",
            },
          ],
          6,
        ],
      },
      {
        description: "Electives",
        args: [
          [
            {
              description: "ARAB Elective (1)",
              regex: "^ARAB",
              ignore: [
                "ARAB 101",
                "ARAB 102",
                "ARAB 201",
                "ARAB 202",
                "ARAB 301",
                "ARAB 302",
              ],
            },
            {
              description: "ARAB Elective (2)",
              regex: "^ARAB",
              ignore: [
                "ARAB 101",
                "ARAB 102",
                "ARAB 201",
                "ARAB 202",
                "ARAB 301",
                "ARAB 302",
              ],
            },
            {
              description: "ARAB Elective (3)",
              regex: "^ARAB",
              ignore: [
                "ARAB 101",
                "ARAB 102",
                "ARAB 201",
                "ARAB 202",
                "ARAB 301",
                "ARAB 302",
              ],
            },
            {
              description: "Capstone Elective",
              regex: "^ARAB (4[0-9]{2})",
            },
          ],
          4,
        ],
      },
    ],
  },
  "Art History": {
    Link: "https://art.williams.edu/the-major/art-history/",
    Prefix: "ARTH",
    Division: 2,
    Info: [
      "The art history major requires a minimum of 9 courses.",
      "Any three courses offered at the ARTH 100 level",
      "Any ARTS (studio) course",
      "One course in art history concerned with a period prior to 1800",
      "One course in art history concerned with a period post 1800",
      'Any 300-level ARTH course designated "Methods [and/or Methodologies] of Art History"',
      "One 400-level seminar or 500-level graduate seminar (in addition this course may be used to satisfy the pre-1800 or post-1800 requirement)",
      "One additional course, at any level.",
    ],
    Requirements: [
      {
        description: "Introduction",
        args: [
          [
            {
              description: "ARTH 100-level (1)",
              regex: "^ARTH (1[0-9]{2})",
            },
            {
              description: "ARTH 100-level (2)",
              regex: "^ARTH (1[0-9]{2})",
            },
            {
              description: "ARTH 100-level (3)",
              regex: "^ARTH (1[0-9]{2})",
            },
          ],
          3,
        ],
      },
      {
        description: "Studio",
        args: [
          [
            {
              description: "Any ARTS course",
              regex: "^ARTS",
            },
          ],
          1,
        ],
      },
      {
        description: "Pre 18th-century",
        args: [
          [
            {
              description: "Pre 18th-century ARTH course",
              attributes: "^ARTH_ARTHPRE18C",
            },
          ],
          1,
        ],
      },
      {
        description: "Post 18th-century",
        args: [
          [
            {
              description: "Post 18th-century ARTH course",
              attributes: "^ARTH_ARTHPST18C",
            },
          ],
          1,
        ],
      },
      {
        description: "Methods/Methodologies of Art History",
        args: [
          [
            {
              description:
                "300-level course listed as methods/methodologies of art history",
              regex: "^ARTH (301|302|307)",
            },
          ],
          1,
        ],
      },
      {
        description: "Advanced Seminar",
        args: [
          [
            {
              description: "400/500-level seminar",
              classType: "^Seminar",
              regex: "^ARTH (4|5)[0-9]{2}",
            },
          ],
          1,
        ],
      },
      {
        description: "Completion",
        args: [
          [
            {
              description: "Any ARTH course",
              regex: "^ARTH",
            },
          ],
          1,
        ],
      },
    ],
  },
  "Studio Art": {
    Link: "https://art.williams.edu/the-major/studio-art/",
    Prefix: "ARTS",
    Division: 1,
    Info: [
      "Electives must be taken across three (3) different media, and may not be tutorials.",
    ],
    Requirements: [
      {
        description: "Introduction",
        args: [
          [
            {
              description: "ARTS 100",
              course: "ARTS 100",
            },
            {
              description: "Any ARTH course",
              regex: "^ARTH",
            },
          ],
          2,
        ],
      },
      {
        description: "Electives",
        args: [
          [
            {
              description: "100/200-level ARTS course (1)",
              regex: "^ARTS (1|2)[0-9]{2}",
              classType: "^(?!.*Tutorial).*$",
              ignore: ["ARTS 100"],
            },
            {
              description: "100/200-level ARTS course (2)",
              regex: "^ARTS (1|2)[0-9]{2}",
              classType: "^(?!.*Tutorial).*$",
              ignore: ["ARTS 100"],
            },
            {
              description: "100/200-level ARTS course (3)",
              regex: "^ARTS (1|2)[0-9]{2}",
              classType: "^(?!.*Tutorial).*$",
              ignore: ["ARTS 100"],
            },
          ],
          3,
        ],
      },
      {
        description: "Continuation",
        args: [
          [
            {
              description: "300-level ARTS course",
              regex: "^ARTS 3",
            },
            {
              description: "Elected ARTS course",
              regex: "^ARTS",
            },
          ],
          2,
        ],
      },
      {
        description: "Seminars",
        args: [
          [
            {
              description: "ARTS 319 (junior seminar)",
              course: "ARTS 319",
              minSem: 5,
            },
            {
              description: "ARTS 418 (senior seminar)",
              course: "ARTH 418",
              minSem: 7,
            },
          ],
          2,
        ],
      },
    ],
  },
  "Art History and Studio": {
    Link: "https://art.williams.edu/the-major/history-studio/",
    Prefix: "",
    Division: 0,
    Info: [
      "The application for the History and Studio route requires a list of proposed courses that must be approved by the History and Studio advisor before the student may register for the major.",
      "History and Studio students whose ongoing projects have a Studio emphasis have the opportunity to take the Senior Tutorial (ARTS 418) with permission of the instructor and to participate in the senior Studio exhibition. Or, a student following the Studio Art track may propose a senior Independent Study project in order to pursue Honors. Those History and Studio majors with an Art History emphasis may apply to write a thesis and, if accepted, will be admitted to the required Winter Study and Senior Honors Seminar (ARTH 494).",
    ],
    Requirements: [
      {
        description: "ARTH Introduction",
        args: [
          [
            {
              description: "ARTH 100-level (1)",
              regex: "^ARTH 1",
            },
            {
              description: "ARTH 100-level (2)",
              regex: "^ARTH 1",
            },
          ],
          2,
        ],
      },
      {
        description: "ARTS Introduction",
        args: [
          [
            {
              description: "ARTS 100-level",
              regex: "^ARTS 1",
            },
            {
              description: "ARTS 200-level",
              regex: "^ARTS 2",
            },
          ],
          2,
        ],
      },
      {
        description: "Methods/Methodologies of Art History",
        args: [
          [
            [
              {
                description:
                  "300-level course listed as methods/methodologies of art history",
                regex: "^ARTH (301|302|307)",
              },
              {
                description: "ARTS 319 (junior seminar)",
                course: "ARTS 319",
              },
            ],
          ],
          1,
        ],
      },
      {
        description: "ARTH upper-level",
        args: [
          [
            {
              description: "ARTH 400/500-level course",
              regex: "^ARTH (4|5)",
            },
          ],
          1,
        ],
      },
      {
        description: "Electives",
        args: [
          [
            {
              description: "ARTH elective",
              regex: "^ARTH",
            },
            {
              description: "ARTS elective",
              regex: "^ARTS",
            },
          ],
          2,
        ],
      },
      {
        description: "Completion",
        args: [
          [
            [
              {
                description: "ARTS 300-level or ARTS 418 (with permission)",
                regex: "^ARTS (3[0-9]{2}|418)",
              },
              {
                description: "ARTH 400-level or ARTH 494 (with permission)",
                regex: "^ARTH (4[0-9]{2}|494)",
              },
            ],
          ],
          1,
        ],
      },
    ],
  },
  Astrophysics: {
    Link: "https://astronomy.williams.edu/majoring-options/astrophysics/",
    Prefix: "ASTR",
    Division: 3,
    Info: [
      "The Astrophysics major will be elected by students who plan graduate study in astronomy, astrophysics, or a closely related field, and also can be elected by those interested in a wide variety of careers.",
      "The total number of courses required for the Astrophysics major, an interdisciplinary major, is eleven.",
      "Students entering with Advanced Placement in physics and/or math may obtain credit toward the major for the equivalent of Physics 142 and/or Math 150 taken elsewhere, but at least 8 courses in astronomy, physics, and math must be taken at Williams.",
      "There are some aspects of astrophysics that are closely related to chemistry or geology. In recognition of this relation, certain advanced courses in those departments can be accepted for credit toward the Astrophysics major on a two-for-one basis.",
      "In other words, a student may take Astronomy 111 for the major, but if they take Astronomy 101 instead of Astronomy 111 then they must also take one of Astronomy 102 or 104.",
    ],
    Requirements: [
      {
        description: "Introduction",
        args: [
          [
            {
              description: "ASTR 111",
              course: "ASTR 111",
            },
            {
              description: "ASTR 101",
              course: "ASTR 101",
            },
            [
              {
                description: "ASTR 102",
                course: "ASTR 102",
              },
              {
                description: "ASTR 104",
                course: "ASTR 104",
              },
            ],
            {
              placeholder:
                "Click here to mark this section as fulfilled if you took ASTR 111",
            },
          ],
          2,
        ],
      },
      {
        description: "Physics",
        args: [
          [
            [
              {
                description: "PHYS 131",
                course: "PHYS 131",
              },
              {
                description: "PHYS 141",
                course: "PHYS 141",
              },
              {
                placeholder: "Equivalent placement",
              },
            ],
            [
              {
                description: "PHYS 142",
                course: "PHYS 142",
              },
              {
                description: "PHYS 151",
                course: "PHYS 151",
              },
              {
                placeholder: "Equivalent placement",
              },
            ],
            {
              description: "PHYS 201",
              course: "PHYS 201",
            },
            {
              description: "PHYS 202",
              course: "PHYS 202",
            },
            {
              description: "PHYS 301",
              course: "PHYS 301",
            },
          ],
          5,
        ],
      },
      {
        description: "Mathematics",
        args: [
          [
            [
              {
                description: "PHYS 210",
                course: "PHYS 210",
              },
              {
                description: "MATH 209",
                course: "MATH 209",
              },
            ],
            [
              {
                description: "MATH 150",
                course: "MATH 150",
              },
              {
                description: "MATH 151",
                course: "MATH 151",
              },
            ],
          ],
          2,
        ],
      },
      {
        description: "Advanced Astronomy",
        args: [
          [
            {
              description: "400-level ASTR course (1)",
              regex: "^ASTR 4",
            },
            {
              description: "400-level ASTR course (2)",
              regex: "^ASTR 4",
            },
            [
              {
                description: "ASTR 211",
                course: "ASTR 211",
              },
              {
                description: "PHYS 302",
                course: "PHYS 302",
              },
              {
                description: "PHYS 402",
                course: "PHYS 402",
              },
              {
                description: "PHYS 405",
                course: "PHYS 405",
              },
              {
                description: "PHYS 411",
                course: "PHYS 411",
              },
              {
                description: "PHYS 418",
                course: "PHYS 418",
              },
              {
                description: "400-level ASTR course (3)",
                regex: "^ASTR 4",
              },
            ],
          ],
          3,
        ],
      },
    ],
  },
  Astronomy: {
    Link: "https://astronomy.williams.edu/majoring-options/astronomy/",
    Prefix: "ASTR",
    Division: 3,
    Info: [
      "The Astronomy major is particularly suitable for students who seek a coherent course of study in astronomy, but who do not intend to pursue it in graduate school. It is also appropriate as a second major for students majoring in another field.",
      "There are several possible routes through the Astronomy major, depending on preparation and interest. Students considering a major in Astronomy should consult with members of the department early and often.",
    ],
    Requirements: [
      {
        description: "Introductory Astronomy",
        args: [
          [
            [
              {
                description: "ASTR 111",
                course: "ASTR 111",
              },
              {
                description: "ASTR 101",
                course: "ASTR 101",
              },
            ],
            [
              {
                description: "ASTR 102",
                course: "ASTR 102",
              },
              {
                description: "ASTR 104",
                course: "ASTR 104",
              },
            ],
          ],
          2,
        ],
      },
      {
        description: "Astronomy Electives",
        args: [
          [
            {
              description: "ASTR 200-level (1)",
              regex: "^ASTR 2",
            },
            {
              description: "ASTR 200-level (2)",
              regex: "^ASTR 2",
            },
            {
              description: "ASTR 400-level (1)",
              regex: "^ASTR 4",
            },
            {
              description: "ASTR 400-level (2)",
              regex: "^ASTR 4",
            },
          ],
          4,
        ],
      },
      {
        description: "Physics",
        args: [
          [
            [
              {
                description: "PHYS 131",
                course: "PHYS 131",
              },
              {
                description: "PHYS 141",
                course: "PHYS 141",
              },
              {
                placeholder: "Equivalent placement",
              },
            ],
            [
              {
                description: "PHYS 142",
                course: "PHYS 142",
              },
              {
                description: "PHYS 151",
                course: "PHYS 151",
              },
              {
                placeholder: "Equivalent placement",
              },
            ],
          ],
          2,
        ],
      },
      {
        description: "Mathematics",
        args: [
          [
            {
              description: "MATH 140",
              courses: "MATH 140",
            },
            [
              {
                description: "MATH 150",
                course: "MATH 150",
              },
              {
                description: "MATH 151",
                course: "MATH 151",
              },
            ],
          ],
          2,
        ],
      },
    ],
  },
};
