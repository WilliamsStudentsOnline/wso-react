import {
  MAJOR_BUILDER_COURSES_PER_SEM,
  MAJOR_BUILDER_SEMESTERS,
} from "./constants";

/* Checks if n complex, versatile requirements are fulfilled
A slot (element in requireDict) can be:
- a requirement object
- a list of requirement objects (representing an OR group)
Each requirement object must have either:
- description: string; AND >1 constraints (specified below)
- placeholder: string (means the user must click it, no checks performed)
Constraint options for auto-filling:
- minSem: int; 1-indexed minimum semester (using position in the grid)
- course: string; matches directly with listing or cross listings
- ignore: list; course must not be in this list to match
- classType: regexp; e.g. "^(Tutorial|Seminar)"
- regex: regexp; matches with listing/cross-listings, e.g. "^AFR 2"
- attributes: regexp; matches with special attributes, e.g. "^AFR_AFRCORE" (see majorAttributes.txt)
*/
export const checkRequireNComplex = (args, grid, fulfilledBy, fulfillments) => {
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
            !c.crossListing.some((i) => item.ignore.includes(i))
        );
      }

      if (item.classType) {
        const regexp = new RegExp(item.classType);
        filteredCourses = filteredCourses.filter((c) =>
          regexp.test(c.classType)
        );
      }

      if (item.component) {
        const regexp = new RegExp(item.component);
        filteredCourses = filteredCourses.filter((c) =>
          c.components.some((i) => regexp.test(i))
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
  Biology: {
    Link: "https://biology.williams.edu/the-major/",
    Prefix: "BIOL",
    Division: 3,
    Info: [
      "A student who places out of BIOL101 and/or BIOL102 (by passing the placement exam) must still take nine BIOL courses to complete the BIOL major.",
      "The two Chemistry courses (CHEM 156 and CHEM 251, OR CHEM 200 and CHEM 201) combined, can be counted for one of the additional elective courses for the BIOL major. However, the college does not allow the same course to count toward fulfilling the requirements for two majors (“no double-counting”). This means that if you are a BIOL and CHEM major, you cannot count CHEM 156 and CHEM 251 as an elective toward the BIOL major.",
      "Some BIOL courses do not count toward the BIOL major, so-called “non-major” courses (for example, BIOL 133, 134, and 135).",
    ],
    Requirements: [
      {
        description: "Introduction",
        args: [
          [
            {
              description: "BIOL 101",
              course: "BIOL 101",
            },
            {
              description: "BIOL 102",
              course: "BIOL 102",
            },
          ],
          2,
        ],
      },
      {
        description: "Labs",
        args: [
          [
            {
              description: "200-level lab (1)",
              classType: "^(?!.*Tutorial)(?!.*Independent Study).*$",
              component: "^Laboratory",
              regex: "^BIOL 2",
            },
            {
              description: "200-level lab (2)",
              classType: "^(?!.*Tutorial)(?!.*Independent Study).*$",
              component: "^Laboratory",
              regex: "^BIOL 2",
            },
            {
              description: "300-level lab (1)",
              class: "^BIOL 3",
              component: "^Laboratory",
            },
            {
              description: "300-level lab (2)",
              class: "^BIOL 3",
              component: "^Laboratory",
            },
          ],
          4,
        ],
      },
      {
        description: "Seminar",
        args: [
          [
            {
              description: "400-level seminar",
              class: "^BIOL 4",
              classType: "^Seminar",
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
              description: "200/300/400-level elective (1)",
              regex: "^BIOL (2|3|4)",
            },
            {
              description: "200/300/400-level elective (2)",
              regex: "^BIOL (2|3|4)",
            },
            {
              description: "CHEM 156 (needs also CHEM 251)",
              course: "CHEM 156",
            },
            {
              description: "CHEM 251",
              course: "CHEM 251",
            },
            {
              description: "CHEM 200 (needs also CHEM 201)",
              course: "CHEM 200",
            },
            {
              description: "CHEM 201",
              course: "CHEM 201",
            },
            {
              description: "Honors thesis",
              classType: "^Honors",
              regex: "^BIOL",
            },
            {
              placeholder:
                "Check if you took both BIOL electives or the honors thesis",
            },
          ],
          3,
        ],
      },
    ],
  },
  Chemistry: {
    Link: "https://chemistry.williams.edu/the-major/",
    Prefix: "CHEM",
    Division: 3,
    Info: [
      "Only one course designated as pass/fail may be counted towards the major.",
      "Beyond the four core introductory courses, four 300-level courses are required, including at least three having a laboratory component. Among these, the Department’s quantitative requirement must be met by completing one of the following: Chemistry 361, 363, 364, 366, or 367.",
      "The ninth and final major course requirement can be satisfied in one of three ways: 1) by taking Chemistry 100; 2) by taking an additional 300-level course; or 3) by taking two approved courses from adjacent sciences (those with significant chemical and/or quantitative content) from Biology, Computer Science, Environmental Studies, Geosciences, Mathematics, Physics, or Statistics. The specific courses selected, will depend on each student’s future plans and interests, and can be determined in consultation with the chair or major advisor.",
    ],
    Requirements: [
      {
        description: "Core",
        args: [
          [
            {
              description: "CHEM 101",
              course: "CHEM 101",
            },
            {
              description: "CHEM 200",
              course: "CHEM 200",
            },
            {
              description: "CHEM 201",
              course: "CHEM 201",
            },
            {
              description: "CHEM 242",
              course: "CHEM 242",
            },
          ],
          4,
        ],
      },
      {
        description: "Labs",
        args: [
          [
            {
              description: "Quantitative requirement (361, 363, 364, 366, 367)",
              regex: "^CHEM (361|363|364|366|367)",
            },
            {
              description: "300-level lab (2)",
              regex: "^CHEM 3",
              component: "^Laboratory",
            },
            {
              description: "300-level lab (3)",
              regex: "^CHEM 3",
              component: "^Laboratory",
            },
            {
              description: "300-level elective (does not need lab)",
              regex: "^CHEM 3",
            },
          ],
          4,
        ],
      },
      {
        description: "Completion",
        args: [
          [
            {
              description: "CHEM 100 (counts double)",
              course: "CHEM 100",
            },
            {
              description: "CHEM 100 (counts double)",
              course: "CHEM 100",
            },
            {
              description: "300-level elective (counts double)",
              regex: "^CHEM 3",
            },
            {
              description: "300-level elective (counts double)",
              regex: "^CHEM 3",
            },
            {
              placeholder:
                "Approved BIOL/CHEM/ENVI/GEOS/MATH/PHYS/STAT course (1)",
            },
            {
              placeholder:
                "Approved BIOL/CHEM/ENVI/GEOS/MATH/PHYS/STAT course (2)",
            },
          ],
          2,
        ],
      },
    ],
  },
  Chinese: {
    Link: "https://chinese.williams.edu/major/",
    Prefix: "CHIN",
    Division: 1,
    Info: [
      "In order to develop proficiency and intercultural communicative skills in the language, students are required to complete at least eight Mandarin Chinese language courses (CHIN 101, 102, 201, 202, 301, 302, 401, 402) and at least one course in Classical Chinese (CHIN 312).",
      "To gain a deeper understanding of Chinese cultural traditions, students should take at least one Chinese core elective in Chinese literary, linguistic, or cultural studies (taught either in English or in Chinese) with prefixes and primary cross-listings in CHIN.",
      "Students with higher language proficiency who are placed out of any of the core language courses (101 through 402) can take an equal number of faculty-approved electives taught either in Chinese or in English on literature, linguistics, culture studies or related Chinese studies disciplines (e.g., art history, history, political science) to fulfill the core language requirement.",
      "Students who have summer or semester study-away plans MUST attend the fall Chinese study-away meeting or consult with department faculty for advice.",
    ],
    Requirements: [
      {
        description: "Core language courses",
        args: [
          [
            [
              {
                description: "CHIN 101",
                course: "CHIN 101",
              },
              {
                placeholder: "Approved replacement for CHIN 101",
              },
            ],
            [
              {
                description: "CHIN 102",
                course: "CHIN 102",
              },
              {
                placeholder: "Approved replacement for CHIN 102",
              },
            ],
            [
              {
                description: "CHIN 201",
                course: "CHIN 201",
              },
              {
                placeholder: "Approved replacement for CHIN 201",
              },
            ],
            [
              {
                description: "CHIN 202",
                course: "CHIN 202",
              },
              {
                placeholder: "Approved replacement for CHIN 202",
              },
            ],
            [
              {
                description: "CHIN 301",
                course: "CHIN 301",
              },
              {
                placeholder: "Approved replacement for CHIN 301",
              },
            ],
            [
              {
                description: "CHIN 302",
                course: "CHIN 302",
              },
              {
                placeholder: "Approved replacement for CHIN 302",
              },
            ],
            [
              {
                description: "CHIN 401",
                course: "CHIN 401",
              },
              {
                placeholder: "Approved replacement for CHIN 401",
              },
            ],
            [
              {
                description: "CHIN 402",
                course: "CHIN 402",
              },
              {
                placeholder: "Approved replacement for CHIN 402",
              },
            ],
          ],
          8,
        ],
      },
      {
        description: "Elective",
        args: [
          [
            {
              description: "CHIN core elective",
              regex: "^CHIN",
              ignore: [
                "CHIN 101",
                "CHIN 102",
                "CHIN 201",
                "CHIN 202",
                "CHIN 301",
                "CHIN 302",
                "CHIN 401",
                "CHIN 402",
              ],
            },
          ],
          1,
        ],
      },
    ],
  },
  "Classics (Route A)": {
    Link: "https://classics.williams.edu/major/",
    Prefix: "CLAS",
    Division: 1,
    Info: [
      "There are two routes through the Classics major: Route A emphasizes more coursework in Greek and Latin, while Route B emphasizes more Classical Studies courses (see below).",
      "This route requires six courses in Greek and/or Latin, with at least two 400-level courses in one language.",
      "It also requires three additional courses from the offerings in Greek, Latin, or Classical Studies or from approved courses in other departments and programs.",
    ],
    Requirements: [
      {
        description: "Core language courses",
        args: [
          [
            {
              description: "Greek or Latin course (1)",
              regex: "^(CLLA|CLGR)",
            },
            {
              description: "Greek or Latin course (2)",
              regex: "^(CLLA|CLGR)",
            },
            {
              description: "Greek or Latin course (3)",
              regex: "^(CLLA|CLGR)",
            },
            {
              description: "Greek or Latin course (4)",
              regex: "^(CLLA|CLGR)",
            },
          ],
          4,
        ],
      },
      {
        description: "Upper-level language courses",
        args: [
          [
            {
              description: "400-level Latin or Greek (1)",
              regex: "^(CLLA|CLGR) 4",
            },
            {
              description: "400-level Latin or Greek (same language) (2)",
              regex: "^(CLLA|CLGR) 4",
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
                description: "Coursework in Latin (1)",
                regex: "^CLLA",
              },
              {
                description: "Coursework in Greek (1)",
                regex: "^CLGR",
              },
              {
                placeholder: "Approved replacement (1)",
              },
            ],
            [
              {
                description: "Coursework in Latin (2)",
                regex: "^CLLA",
              },
              {
                description: "Coursework in Greek (2)",
                regex: "^CLGR",
              },
              {
                placeholder: "Approved replacement (2)",
              },
            ],
            [
              {
                description: "Coursework in Latin (3)",
                regex: "^CLLA",
              },
              {
                description: "Coursework in Greek (3)",
                regex: "^CLGR",
              },
              {
                placeholder: "Approved replacement (3)",
              },
            ],
          ],
          3,
        ],
      },
      {
        description: "Colloquium",
        args: [
          [
            {
              placeholder:
                "All Classics majors in residence are expected to participate fully in the life of the department through attendance at lectures and other departmental events.",
            },
          ],
          1,
        ],
      },
    ],
  },
  "Classics (Route B)": {
    Link: "https://classics.williams.edu/major/",
    Prefix: "CLAS",
    Division: 1,
    Info: [
      "There are two routes through the Classics major: Route A emphasizes more coursework in Greek and Latin, while Route B emphasizes more Classical Studies courses (see below).",
      "This route requires one course each from any two of the following categories: literature (CLAS 101 or CLAS 102); visual and material culture (CLAS 209 or CLAS 210); history (CLAS 222 or CLAS 223).",
      "It also requires four courses in Greek or Latin with at least one at the 400-level, or the four-course sequence CLLA 101, 102, 201, and 302.",
      "It also requires three additional courses from the offerings in Classical Studies or from approved courses in other departments and programs.",
    ],
    Requirements: [
      {
        description: "Introduction",
        args: [
          [
            [
              {
                description: "CLAS 101",
                course: "CLAS 101",
              },
              {
                description: "CLAS 102",
                course: "CLAS 102",
              },
            ],
            [
              {
                description: "CLAS 209",
                course: "CLAS 209",
              },
              {
                description: "CLAS 210",
                course: "CLAS 210",
              },
            ],
            [
              {
                description: "CLAS 222",
                course: "CLAS 222",
              },
              {
                description: "CLAS 223",
                course: "CLAS 223",
              },
            ],
          ],
          2,
        ],
      },
      {
        description: "Coursework in Greek/Latin",
        args: [
          [
            [
              {
                description: "Greek course (1)",
                regex: "^CLGR",
              },
              {
                description: "Latin course (1)",
                regex: "^CLLA",
              },
              {
                description: "CLAS 101",
                course: "CLAS 101",
              },
            ],
            [
              {
                description: "Greek course (2)",
                regex: "^CLGR",
              },
              {
                description: "Latin course (2)",
                regex: "^CLLA",
              },
              {
                description: "CLAS 102",
                course: "CLAS 102",
              },
            ],
            [
              {
                description: "Greek course (3)",
                regex: "^CLGR",
              },
              {
                description: "Latin course (3)",
                regex: "^CLLA",
              },
              {
                description: "CLAS 201",
                course: "CLAS 201",
              },
            ],
            [
              {
                description: "Greek 400-level",
                regex: "^CLGR 4",
              },
              {
                description: "Latin 400-level",
                regex: "^CLLA 4",
              },
              {
                description: "CLAS 302",
                course: "CLAS 302",
              },
            ],
          ],
          4,
        ],
      },
      {
        description: "Electives",
        args: [
          [
            [
              {
                description: "Latin, Greek, or CLAS elective (1)",
                regex: "^(CLLA|CLGR|CLAS)",
              },
              {
                placeholder: "Approved replacement (1)",
              },
            ],
            [
              {
                description: "Latin, Greek, or CLAS elective (2)",
                regex: "^(CLLA|CLGR|CLAS)",
              },
              {
                placeholder: "Approved replacement (2)",
              },
            ],
            [
              {
                description: "Latin, Greek, or CLAS elective (3)",
                regex: "^(CLLA|CLGR|CLAS)",
              },
              {
                placeholder: "Approved replacement (3)",
              },
            ],
          ],
          3,
        ],
      },
      {
        description: "Colloquium",
        args: [
          [
            {
              placeholder:
                "All Classics majors in residence are expected to participate fully in the life of the department through attendance at lectures and other departmental events.",
            },
          ],
          1,
        ],
      },
    ],
  },
  "Computer Science": {
    Link: "https://csci.williams.edu/major-requirements/",
    Prefix: "CSCI",
    Division: 3,
    Info: [
      "Potential majors are strongly urged to complete all or most of the core courses by the end of their junior year in order to ensure that they have the appropriate prerequisites for the electives.",
      "Three or more electives (bringing the total number of Computer Science courses to at least 8) chosen from 300- or 400-level courses in Computer Science. Computer Science courses with 9 as the middle digit (reading, research, and thesis courses) will normally not be used to satisfy the elective requirements. Students may petition the department to waive this restriction with good reason.",
      "Students who take Computer Science 102T, 103, or 104 prior to Fall 2023 may use that course as one of the two electives required for the major in Computer Science.",
      "With the advance permission of the department, two appropriate mathematics or statistics courses may be substituted for one Computer Science elective. Appropriate mathematics classes are those numbered 300 or above, and appropriate statistics courses are those numbered 200 or above. Other variations in the required courses, adapting the requirements to the special needs and interests of the individual student, may be arranged in consultation with the department.",
    ],
    Requirements: [
      {
        description: "Introduction",
        args: [
          [
            [
              {
                description: "CSCI 134",
                course: "CSCI 134",
              },
              {
                description: "300-level replacement",
                regex: "^CSCI 3",
              },
            ],
            {
              description: "CSCI 136",
              course: "CSCI 136",
            },
          ],
          2,
        ],
      },
      {
        description: "Core",
        args: [
          [
            {
              description: "CSCI 237",
              course: "CSCI 237",
            },
            {
              description: "CSCI 256",
              course: "CSCI 256",
            },
            [
              {
                description: "CSCI 337",
                course: "CSCI 337",
              },
              {
                description: "CSCI 361",
                course: "CSCI 361",
              },
            ],
          ],
          3,
        ],
      },
      {
        description: "Electives",
        args: [
          [
            {
              description: "300-level elective (1)",
              regex: "^CSCI 3",
            },
            {
              description: "300-level elective (2)",
              regex: "^CSCI 3",
            },
            {
              description: "300-level elective (3)",
              regex: "^CSCI 3",
            },
          ],
          3,
        ],
      },
      {
        description: "Mathematics",
        args: [
          [
            {
              description: "Any 200-level MATH/STAT course except MATH 200",
              regex: "^(MATH|STAT) 2",
              ignore: ["MATH 200"],
            },
            [
              {
                description: "MATH 200",
                course: "MATH 200",
              },
              {
                placeholder: "Discrete Mathematics Proficiency Exam (DMPE)",
              },
            ],
          ],
          2,
        ],
      },
    ],
  },
  "Contract Major": {
    Link: "https://registrar.williams.edu/contract-major/",
    Prefix: "",
    Division: 0,
    Info: ["Please consult the link above"],
    Requirements: [
      {
        description: "Consult the link above!",
        args: [[{ placeholder: "Consult the link above!" }], 1],
      },
    ],
  },
  "East Asian Languages and Cultures": {
    Link: "https://www.williams.edu/dallc/east-asian-languages-cultures-major/",
    Prefix: "",
    Division: 1,
    Info: [
      "In order to develop proficiency and intercultural communicative skills in the language, students are required to complete at least six language courses (or attain a minimum proficiency equivalent to the completion of 302) in one East Asian language offered by the department (currently Chinese Mandarin and Japanese).",
      "To gain a deeper understanding of the Chinese or Japanese cultural traditions and to develop research skills in the Chinese or Japanese fields, they should take at least two Chinese/Japanese core electives in literary, linguistic, or cultural studies in their primary focus of study with prefixes and primary cross-listings in CHIN/JAPN, and two approved electives related to Chinese/Japanese language and culture (including additional CHIN/JAPN core electives, additional Asian language courses, or Chinese/Japanese studies courses offered in art, comparative literature, history, music, political science, religion, etc.).",
      "Students with higher language proficiency who are placed out of any of the core language courses (101 through 402) can take an equal number of faculty-approved electives taught either in the target language or in English on literature, linguistics, culture studies or related Chinese/Japanese studies disciplines (e.g., art history, history, political science) to fulfill the core language requirement.",
      "Students who have summer or semester study-away plans MUST attend the fall Chinese or Japanese study-away meeting or consult with department faculty for advice.",
      "This major offers students who are able to complete the 402 level in either Chinese or Japanese by the end of their sophomore year a dual-language option which will allow them to learn a second Asian language and reach the Intermediate level in speaking that language by the time of graduation. Please consult with the chair or language coordinator for more information about this option.",
    ],
    Requirements: [
      {
        description: "Unavailable",
        args: [
          [
            {
              placeholder:
                "The Major Builder is currently unavailable for this major. Please consult the department website link above.",
            },
          ],
          1,
        ],
      },
    ],
  },
  Econonomics: {
    Link: "https://econ.williams.edu/major/",
    Prefix: "ECON",
    Division: 2,
    Info: [
      "The ECON 110 requirement may be waived for students who earned a 5 on the microeconomics AP exam, and the ECON 120 requirement may be waived for those who received a 5 on the macroeconomics AP exam. Both the ECON 110 and 120 requirements may be waived for students who received an A on the A-level exam in economics or earned a 6 or 7 in the higher economics IB exam. A requirement may be waived for students who earned below a 5 on the microeconomics or macroeconomics AP exams or below a 6 on the higher economics IB exam after consultation with the department. In all cases, results from the department placement exam are taken into account in making the determination of whether a requirement will be waived.",
      "Students who started at Williams in Fall 2020 and following receive advanced placement, but no reduction in the number of courses required for the major. Completion of a major in Economics requires nine semester courses. These would include the introductory course for which no advanced placement was granted (if applicable) and one additional elective at the 200-level or higher, or two additional electives at the 200-level or higher if both ECON 110 and 120 requirements are waived, the three core theory classes, and the four electives.",
      "Students may receive credit towards the major for college courses taken at other institutions, including those taken as part of a study abroad program. Most economics courses taken elsewhere that have an introductory economics prerequisite will qualify for 200-level elective credit. Consult the department website for more information.",
      "With the permission of the instructor, undergraduates may enroll in 500-level graduate courses given by the Center for Development Economics. These courses can substitute for advanced electives numbered 300-398, unless otherwise noted in the course description.",
    ],
    Requirements: [
      {
        description: "Introduction",
        args: [
          [
            [
              {
                description: "ECON 110",
                course: "ECON 110",
              },
              {
                placeholder: "Approved replacement for ECON 110",
              },
            ],
            [
              {
                description: "ECON 120",
                course: "ECON 120",
              },
              {
                placeholder: "Approved replacement for ECON 120",
              },
            ],
          ],
          2,
        ],
      },
      {
        description: "Core",
        args: [
          [
            {
              description: "ECON 251",
              course: "ECON 251",
            },
            {
              description: "ECON 252",
              course: "ECON 252",
            },
            [
              {
                description: "ECON 255",
                course: "ECON 255",
              },
              {
                description: "STAT 346",
                course: "STAT 346",
              },
            ],
          ],
          3,
        ],
      },
      {
        description: "Electives",
        args: [
          [
            [
              {
                description: "ECON 300-398 (1)",
                regex: "^ECON 3([0-9][0-8])",
              },
              {
                description: "ECON 500-level (1)",
                regex: "^ECON 5",
              },
            ],
            [
              {
                description: "ECON 300-398 (2)",
                regex: "^ECON 3([0-9][0-8])",
              },
              {
                description: "ECON 400-level seminar (2)",
                regex: "^ECON 4",
                classType: "^Seminar",
              },
              {
                description: "ECON 500-level (2)",
                regex: "^ECON 5",
              },
            ],
            {
              description: "ECON 400-level seminar (1)",
              regex: "^ECON 4",
              classType: "^Seminar",
            },
            {
              description: "ECON 200-level or above",
              regex: "^ECON (2|3|4|5)",
            },
          ],
          4,
        ],
      },
    ],
  },
  English: {
    Link: "https://english.williams.edu/ways-through-the-major/",
    Prefix: "",
    Division: 1,
    Info: [
      "Paths through the English major are varied; please consult the department website for information about the major.",
    ],
    Requirements: [
      {
        description: "Unavailable",
        args: [
          [
            {
              placeholder:
                "The Major Builder is currently unavailable for this major. Please consult the department website link above.",
            },
          ],
          1,
        ],
      },
    ],
  },
  "Environmental Studies": {
    Link: "https://www.williams.edu/environmental-studies/curriculum/major/",
    Prefix: "ENVI",
    Division: 3,
    Info: [
      "Students must take three (3) electives from one of the curricular branches (Culture/Humanities; Environmental Science; and Social Science/Policy).",
      "Students must also take one (1) elective from a second curricular branch to provide cross-disciplinary breadth.",
      "Electives should be chosen in close consultation with a faculty adviser to ensure intellectual coherence and academic rigor.",
    ],
    Requirements: [
      {
        description: "Core",
        args: [
          [
            {
              description: "ENVI 101",
              course: "ENVI 101",
            },
            [
              {
                description: "ENVI 102",
                course: "ENVI 102",
              },
              {
                description: "Approved 200-level lab course",
                regex: "^ENVI 2",
                component: "^Laboratory",
              },
            ],
            {
              description: "Culture/Humanities course",
              attributes: "^(ENVI_ENVIHUM|EVST_EVSTCULHUM)",
            },
            {
              description: "Enviornmental Science course",
              attributes: "^(ENVI_ENVINATW|EVST_EVSTENVS)",
            },
            {
              description: "Social Science/Policy course",
              attributes: "^(ENVI_ENVIPOL|EVST_EVSTSOCSCI)",
            },
          ],
          5,
        ],
      },
      {
        description: "Electives (Primary Focus)",
        args: [
          [
            {
              description: "Elective 1",
              attributes:
                "^(ENVI_ENVIHUM|EVST_EVSTCULHUM|ENVI_ENVINATW|EVST_EVSTENVS|ENVI_ENVIPOL|EVST_EVSTSOCSCI)",
            },
            {
              description: "Elective 2",
              attributes:
                "^(ENVI_ENVIHUM|EVST_EVSTCULHUM|ENVI_ENVINATW|EVST_EVSTENVS|ENVI_ENVIPOL|EVST_EVSTSOCSCI)",
            },
            {
              description: "Elective 3",
              attributes:
                "^(ENVI_ENVIHUM|EVST_EVSTCULHUM|ENVI_ENVINATW|EVST_EVSTENVS|ENVI_ENVIPOL|EVST_EVSTSOCSCI)",
            },
          ],
          3,
        ],
      },
      {
        description: "Electives (Secondary Focus)",
        args: [
          [
            {
              description: "Elective 4",
              attributes:
                "^(ENVI_ENVIHUM|EVST_EVSTCULHUM|ENVI_ENVINATW|EVST_EVSTENVS|ENVI_ENVIPOL|EVST_EVSTSOCSCI)",
            },
          ],
          1,
        ],
      },
      {
        description: "Senior Seminar",
        args: [
          [
            {
              description: "Senior seminar",
              attributes: "^(ENVI_ENVISENSEM|EVST_EVSTSENSEM)",
            },
          ],
          1,
        ],
      },
    ],
  },
};
