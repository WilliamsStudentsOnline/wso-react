// React imports
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";

// Component imports
import "../../stylesheets/MajorBuilder.css";
import Select from "../../Select";

// Redux  imports
import {
  getMajorBuilderGrid,
  getMajorBuilderSemesters,
} from "../../../selectors/schedulerUtils";
import { getHistoricalCatalogs } from "../../../selectors/course";
import { doUpdateMajorBuilderState } from "../../../actions/schedulerUtils";
import { doLoadHistoricalCatalogYear } from "../../../actions/course";
import {
  MAJOR_BUILDER_SEMESTERS,
  MAJOR_BUILDER_COURSES_PER_SEM,
  MAJOR_BUILDER_LS_KEY,
  COURSE_HISTORY_START_YEAR,
  CURRENT_ACADEMIC_YEAR,
} from "../../../constants/constants";

const MajorBuilder = ({
  grid,
  semesters,
  historicalCatalogs,
  updateMajorBuilderState,
  loadHistoricalCatalog,
}) => {
  // Local state for managing which input/year is being edited
  const [editingYearIndex, setEditingYearIndex] = useState(null);
  const [autocomplete, setAutocomplete] = useState({
    semesterIndex: null,
    courseIndex: null,
    results: [],
    visible: false,
  });

  const [showDivisionColors, setShowDivisionColors] = useState(true);

  // Load state from LocalStorage on mount
  useEffect(() => {
    const savedStateRaw = localStorage.getItem(MAJOR_BUILDER_LS_KEY);
    if (savedStateRaw) {
      try {
        const savedState = JSON.parse(savedStateRaw);
        // Basic validation
        if (
          savedState.grid &&
          savedState.semesters &&
          savedState.grid.length === MAJOR_BUILDER_SEMESTERS &&
          savedState.semesters.length === MAJOR_BUILDER_SEMESTERS &&
          // Check if grid structure matches expected shape
          savedState.grid.every(
            (sem) =>
              Array.isArray(sem) && sem.length === MAJOR_BUILDER_COURSES_PER_SEM
          ) &&
          savedState.semesters.every(
            (s) =>
              typeof s === "object" &&
              s !== null &&
              "year" in s &&
              "term" in s &&
              s.term !== null &&
              s.year !== null
          )
        ) {
          updateMajorBuilderState({
            majorBuilderGrid: savedState.grid,
            majorBuilderSemesters: savedState.semesters,
          });
        } else {
          console.warn(
            "Invalid or outdated major builder state found in LocalStorage. Resetting to default."
          );
          localStorage.removeItem(MAJOR_BUILDER_LS_KEY); // Remove invalid state
        }
      } catch (error) {
        console.error(
          "Failed to parse major builder state from LocalStorage:",
          error
        );
        localStorage.removeItem(MAJOR_BUILDER_LS_KEY); // Remove corrupted state
      }
    }
  }, [updateMajorBuilderState]); // Run only once on mount

  // Load historical data on mount if not already loaded
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearsToFetch = [];
    for (let i = 0; i < 5; i++) {
      const year = currentYear - i;
      if (year >= COURSE_HISTORY_START_YEAR) {
        // Only fetch if not already in the redux store
        if (!historicalCatalogs || !historicalCatalogs[year]) {
          yearsToFetch.push(year);
        }
      } else {
        break; // Stop if we go before the start year
      }
    }

    if (yearsToFetch.length > 0) {
      console.log(
        "MajorBuilder: Fetching historical catalogs for years:",
        yearsToFetch
      );
      yearsToFetch.forEach((year) => {
        axios({
          url: `/courses-${year}.json`,
          headers: { "X-Requested-With": "XMLHttpRequest" },
        })
          .then((response) => loadHistoricalCatalog(year, response.data))
          .catch((error) =>
            console.error(
              `MajorBuilder: Failed to load catalog for ${year}:`,
              error
            )
          );
      });
    }
  }, [loadHistoricalCatalog]); // Depend on catalogs and the action dispatcher

  // Save state to LocalStorage whenever it changes
  useEffect(() => {
    // Only save if grid and semesters are properly initialized
    if (
      grid &&
      semesters &&
      grid.length === MAJOR_BUILDER_SEMESTERS &&
      semesters.length === MAJOR_BUILDER_SEMESTERS
    ) {
      const stateToSave = JSON.stringify({ grid, semesters });
      localStorage.setItem(MAJOR_BUILDER_LS_KEY, stateToSave);
    }
  }, [grid, semesters]);

  const handleInputChange = (semesterIndex, courseIndex, event) => {
    const newGrid = JSON.parse(JSON.stringify(grid)); // Deep copy
    const inputValue = event.target.value;
    newGrid[semesterIndex][courseIndex] = {
      course: null, // Clear selected course if typing
      input: inputValue,
    };
    updateMajorBuilderState({ majorBuilderGrid: newGrid });

    // AUTOCOMPLETE
    const semester = semesters[semesterIndex];
    const year = semester.year;
    const targetTerm = semester.term;
    const catalogForYear = historicalCatalogs[year] || [];

    if (inputValue.length > 1 && catalogForYear.length > 0) {
      const lowerInput = inputValue.toLowerCase();
      const semesterFilteredCourses = catalogForYear.filter(
        (course) => course.semester === targetTerm
      );
      const queryFilteredCourses = semesterFilteredCourses.filter(
        (course) =>
          course.titleLong?.toLowerCase().includes(lowerInput) ||
          course.titleShort?.toLowerCase().includes(lowerInput) ||
          `${course.department} ${course.number}`
            .toLowerCase()
            .includes(lowerInput)
      );

      const uniqueCoursesMap = new Map();
      queryFilteredCourses.forEach((course) => {
        const key = `${course.department} ${course.number}`;
        if (!uniqueCoursesMap.has(key)) {
          uniqueCoursesMap.set(key, course);
        }
      });
      const results = Array.from(uniqueCoursesMap.values()).slice(0, 5); // Limit results for autocomplete
      setAutocomplete({ semesterIndex, courseIndex, results, visible: true });
    } else {
      setAutocomplete({ ...autocomplete, visible: false });
    }
  };

  const handleAutocompleteSelect = (
    semesterIndex,
    courseIndex,
    selectedCourse
  ) => {
    const newGrid = JSON.parse(JSON.stringify(grid));
    newGrid[semesterIndex][courseIndex] = {
      course: selectedCourse,
      input: `${selectedCourse.department} ${selectedCourse.number}`, // Display format
    };
    updateMajorBuilderState({ majorBuilderGrid: newGrid });
    setAutocomplete({ ...autocomplete, visible: false }); // Hide autocomplete
  };

  const handleInputBlur = (semesterIndex, courseIndex) => {
    // Delay hiding autocomplete to allow click event on selection
    setTimeout(() => {
      // Check if the current focus is still within the autocomplete list or input
      const activeElement = document.activeElement;
      const autocompleteElement = document.getElementById(
        `autocomplete-${semesterIndex}-${courseIndex}`
      );
      const inputElement = document.getElementById(
        `input-${semesterIndex}-${courseIndex}`
      );

      const isStillInteracting =
        (autocompleteElement && autocompleteElement.contains(activeElement)) ||
        activeElement === inputElement;

      if (!isStillInteracting && autocomplete.visible) {
        setAutocomplete({ ...autocomplete, visible: false });
      }
    }, 200);
  };

  const generateSemesterOptions = () => {
    const opts = [];
    const startYear = COURSE_HISTORY_START_YEAR;
    const endYear = CURRENT_ACADEMIC_YEAR + 3;
    for (let year = startYear; year <= endYear; year++) {
      opts.push({
        label: `Fall ${year - 1}`,
        value: `Fall-${year - 1}`,
        term: "Fall",
        year: year,
      });
      opts.push({
        label: `Spring ${year}`,
        value: `Spring-${year}`,
        term: "Spring",
        year: year,
      });
    }
    return opts.sort((a, b) => {
      // Sort chronologically
      if (a.year !== b.year) return a.year - b.year;
      return a.term === "Spring" ? 1 : -1; // Fall before Spring
    });
  };

  const semesterOptions = generateSemesterOptions();

  const handleSemesterSelectionChange = (event) => {
    const selectedValue = event.target.value; // e.g. Fall-2024
    const selectedOption = semesterOptions.find(
      (opt) => opt.value === selectedValue
    );

    if (selectedOption && editingYearIndex !== null) {
      const newSemesters = [...semesters];
      newSemesters[editingYearIndex] = {
        term: selectedOption.term,
        year: selectedOption.year,
      };
      updateMajorBuilderState({ majorBuilderSemesters: newSemesters });
      setEditingYearIndex(null);
    } else {
      console.error("Selected semester option not found: ", selectedValue);
      setEditingYearIndex(null);
    }
  };

  const renderSemesterHeader = (index) => {
    const semester = semesters[index];

    if (editingYearIndex === index) {
      return (
        <Select
          value={`${semester.term}-${
            semester.term === "Fall" ? semester.year - 1 : semester.year
          }`}
          onBlur={() => setEditingYearIndex(null)} // Close dropdown on blur if no selection made
          onChange={handleSemesterSelectionChange}
          options={semesterOptions.map((opt) => opt.label)} // Display "Term Year"
          valueList={semesterOptions.map((opt) => opt.value)} // Use "Term-Year" as value
          className="semester-edit-select single"
          autoFocus
        />
      );
    }

    return (
      <div
        onClick={() => setEditingYearIndex(index)}
        className="semester-header"
      >
        {`${semester.term} ${
          semester.term === "Fall" ? semester.year - 1 : semester.year
        }`}
      </div>
    );
  };

  const getDivisionHighlightStyle = (course) => {
    if (!course || !showDivisionColors || !course.courseAttributes) {
      return {};
    }

    const div3Color = "rgba(99, 131, 133, 0.15)";
    const div2Color = "rgba(143, 149, 100, 0.15)";
    const div1Color = "rgba(143, 100, 120, 0.15)";

    if (course.courseAttributes.div1) {
      return { backgroundColor: div1Color };
    }
    if (course.courseAttributes.div2) {
      return { backgroundColor: div2Color };
    }
    if (course.courseAttributes.div3) {
      return { backgroundColor: div3Color };
    }
    return {};
  };

  // Tally division requirements
  const getAPRInfo = () => {
    const apr = {
      div1: [],
      div1_count: 0,
      div2: [],
      div2_count: 0,
      div3: [],
      div3_count: 0,
      dpe: 0,
      qfr: 0,
      ws: 0,
    };

    for (let semIdx = 0; semIdx < MAJOR_BUILDER_SEMESTERS; semIdx++) {
      for (
        let courseIdx = 0;
        courseIdx < MAJOR_BUILDER_COURSES_PER_SEM;
        courseIdx++
      ) {
        if (grid[semIdx]?.[courseIdx]?.course) {
          const course = grid[semIdx][courseIdx].course;

          if (course.courseAttributes) {
            if (course.courseAttributes.div1) {
              apr.div1.push(course.department);
            }
            if (course.courseAttributes.div2) {
              apr.div2.push(course.department);
            }
            if (course.courseAttributes.div3) {
              apr.div3.push(course.department);
            }
            if (course.courseAttributes.dpe) {
              apr.dpe++;
            }
            if (course.courseAttributes.qfr) {
              apr.qfr++;
            }
            if (course.courseAttributes.wac) {
              apr.ws++;
            }
          }
        }
      }
    }

    function getDistinctPrefixCourses(arr) {
      const counts = {};
      // Filter to keep only the first 2 occurrences of each department prefix
      const filteredByDeptLimit = arr.filter((deptPrefix) => {
        counts[deptPrefix] = (counts[deptPrefix] || 0) + 1;
        return counts[deptPrefix] <= 2;
      });
      return filteredByDeptLimit.length;
    }

    apr.div1_count = getDistinctPrefixCourses(apr.div1);
    apr.div2_count = getDistinctPrefixCourses(apr.div2);
    apr.div3_count = getDistinctPrefixCourses(apr.div3);

    return apr;
  };

  const renderAPRStatus = () => {
    const aprData = getAPRInfo();

    const reqs = [
      { key: "div1_count", label: "Div I", target: 3 },
      { key: "div2_count", label: "Div II", target: 3 },
      { key: "div3_count", label: "Div III", target: 3 },
      { key: "ws", label: "WS", target: 2 },
      { key: "qfr", label: "QFR", target: 1 },
      { key: "dpe", label: "DPE", target: 1 },
    ];

    return reqs.map((req, index) => {
      const count = aprData[req.key];
      const isMet = count >= req.target;
      const color = isMet ? "#1a8754" : "#6c757d";

      return (
        <span
          key={req.key}
          style={{ color: color, marginRight: "10px", whiteSpace: "nowrap" }}
        >
          {req.label}: {count}/{req.target}
          {index < reqs.length - 1 && (
            <span
              style={{ color: "#ccc", marginLeft: "10px", marginRight: "0px" }}
            >
              |
            </span>
          )}
        </span>
      );
    });
  };

  // Ensure grid is initialized before rendering
  if (
    !grid ||
    grid.length !== MAJOR_BUILDER_SEMESTERS ||
    !semesters ||
    semesters.length !== MAJOR_BUILDER_SEMESTERS
  ) {
    // Or return a loading indicator
    return <div>Loading Major Builder...</div>;
  }

  return (
    <div className="major-builder-container">
      <h2>Planner</h2>
      <p>
        Plan your academic journey. Click semester headers to change the year
        associated with that semester&rsquo;s courses.
      </p>
      <div className="major-builder-options">
        <label>
          <input
            type="checkbox"
            checked={showDivisionColors}
            onChange={() => setShowDivisionColors(!showDivisionColors)}
          />{" "}
          Highlight Division Colors
        </label>
      </div>
      <div className="major-builder-grid">
        <table>
          <thead>
            <tr>
              <th></th>
              {semesters.map((_, index) => (
                <th key={`header-${index}`}>{renderSemesterHeader(index)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(MAJOR_BUILDER_COURSES_PER_SEM)].map((_, courseIdx) => (
              <tr
                key={`row-${courseIdx}`}
                className={courseIdx === 4 ? "optional-course-row" : ""}
              >
                <td>
                  Course {courseIdx === 4 ? <i>5 (optional)</i> : courseIdx + 1}
                </td>
                {semesters.map((_, semesterIdx) => (
                  <td
                    key={`cell-${semesterIdx}-${courseIdx}`}
                    style={getDivisionHighlightStyle(
                      grid[semesterIdx]?.[courseIdx]?.course
                    )}
                  >
                    {" "}
                    <div className="input-container">
                      <input
                        id={`input-${semesterIdx}-${courseIdx}`}
                        type="text"
                        value={grid[semesterIdx]?.[courseIdx]?.input || ""}
                        onChange={(e) =>
                          handleInputChange(semesterIdx, courseIdx, e)
                        }
                        onBlur={() => handleInputBlur(semesterIdx, courseIdx)}
                        autoComplete="off" // Disable browser autocomplete
                      />
                      {autocomplete.visible &&
                        autocomplete.semesterIndex === semesterIdx &&
                        autocomplete.courseIndex === courseIdx && (
                          <ul
                            className="autocomplete-results"
                            id={`autocomplete-${semesterIdx}-${courseIdx}`}
                          >
                            {autocomplete.results.length > 0 ? (
                              autocomplete.results.map((course) => (
                                <li
                                  key={
                                    course.peoplesoftNumber ||
                                    `${course.department}${course.number}${course.semester}`
                                  } // Use a robust key
                                  onClick={() =>
                                    handleAutocompleteSelect(
                                      semesterIdx,
                                      courseIdx,
                                      course
                                    )
                                  }
                                  role="presentation" // for linting, proper role is complex here
                                >
                                  {`${course.department} ${course.number}: ${course.titleShort}`}
                                </li>
                              ))
                            ) : (
                              <li className="no-results">No matches</li>
                            )}
                          </ul>
                        )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="aprInfo">
        Your APR at a glance:<br></br>
        {renderAPRStatus()}
      </div>
      <h2>Major Builder</h2>
      <p>Check your requirements and progress toward your major(s).</p>
      <div className="major-requirements"> {/* TODO */}</div>
    </div>
  );
};

MajorBuilder.propTypes = {
  grid: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        course: PropTypes.object, // Could be null
        input: PropTypes.string,
      })
    )
  ).isRequired,
  semesters: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.number.isRequired,
      term: PropTypes.string.isRequired,
    })
  ).isRequired,
  historicalCatalogs: PropTypes.object.isRequired,
  updateMajorBuilderState: PropTypes.func.isRequired,
  loadHistoricalCatalog: PropTypes.func.isRequired, // Add prop type for the action dispatcher
};

const mapStateToProps = (state) => ({
  grid: getMajorBuilderGrid(state),
  semesters: getMajorBuilderSemesters(state),
  historicalCatalogs: getHistoricalCatalogs(state),
});

const mapDispatchToProps = (dispatch) => ({
  updateMajorBuilderState: (newState) =>
    dispatch(doUpdateMajorBuilderState(newState)),
  loadHistoricalCatalog: (year, catalog) =>
    dispatch(doLoadHistoricalCatalogYear(year, catalog)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MajorBuilder);
