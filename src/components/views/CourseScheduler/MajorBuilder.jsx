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
  getMajorBuilderYears,
} from "../../../selectors/schedulerUtils";
import { getHistoricalCatalogs } from "../../../selectors/course";
import { doUpdateMajorBuilderState } from "../../../actions/schedulerUtils";
import { doLoadHistoricalCatalogYear } from "../../../actions/course";
import {
  MAJOR_BUILDER_SEMESTERS,
  MAJOR_BUILDER_COURSES_PER_SEM,
  MAJOR_BUILDER_LS_KEY,
  COURSE_HISTORY_START_YEAR,
} from "../../../constants/constants";

const MajorBuilder = ({
  grid,
  years,
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
          savedState.years &&
          savedState.grid.length === MAJOR_BUILDER_SEMESTERS &&
          savedState.years.length === MAJOR_BUILDER_SEMESTERS &&
          // Check if grid structure matches expected shape
          savedState.grid.every(
            (sem) =>
              Array.isArray(sem) && sem.length === MAJOR_BUILDER_COURSES_PER_SEM
          )
        ) {
          updateMajorBuilderState({
            majorBuilderGrid: savedState.grid,
            majorBuilderYears: savedState.years,
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
    // If no saved state, ensure years are initialized (e.g., based on current year)
    else if (years.every((y) => y === new Date().getFullYear())) {
      // Basic check if using default placeholder
      const currentAcademicYearStart =
        new Date().getMonth() >= 6
          ? new Date().getFullYear()
          : new Date().getFullYear() - 1; // Crude check for academic year start (July+)
      const initialYears = [];
      for (let i = 0; i < MAJOR_BUILDER_SEMESTERS / 2; i++) {
        initialYears.push(currentAcademicYearStart + i); // Fall Year X
        initialYears.push(currentAcademicYearStart + i + 1); // Spring Year X+1
      }
      updateMajorBuilderState({
        majorBuilderYears: initialYears.slice(0, MAJOR_BUILDER_SEMESTERS),
      });
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
  }, [historicalCatalogs, loadHistoricalCatalog]); // Depend on catalogs and the action dispatcher

  // Save state to LocalStorage whenever it changes
  useEffect(() => {
    // Only save if grid and years are properly initialized (not the default placeholder)
    if (
      grid &&
      years &&
      grid.length === MAJOR_BUILDER_SEMESTERS &&
      years.length === MAJOR_BUILDER_SEMESTERS
    ) {
      const stateToSave = JSON.stringify({ grid, years });
      localStorage.setItem(MAJOR_BUILDER_LS_KEY, stateToSave);
    }
  }, [grid, years]);

  const handleInputChange = (semesterIndex, courseIndex, event) => {
    const newGrid = JSON.parse(JSON.stringify(grid)); // Deep copy
    const inputValue = event.target.value;
    newGrid[semesterIndex][courseIndex] = {
      course: null, // Clear selected course if typing
      input: inputValue,
    };
    updateMajorBuilderState({ majorBuilderGrid: newGrid });

    // AUTOCOMPLETE
    const year =
      semesterIndex % 2 === 0 ? years[semesterIndex] + 1 : years[semesterIndex];
    const catalogForYear = historicalCatalogs[year] || [];
    const targetSemester = semesterIndex % 2 === 0 ? "Fall" : "Spring";
    if (inputValue.length > 1 && catalogForYear.length > 0) {
      const lowerInput = inputValue.toLowerCase();
      const semesterFilteredCourses = catalogForYear.filter(
        (course) => course.semester === targetSemester
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

  const handleYearHeaderClick = (index) => {
    setEditingYearIndex(index);
  };

  const handleYearChange = (event) => {
    if (editingYearIndex !== null) {
      const newYears = [...years];
      newYears[editingYearIndex] = parseInt(event.target.value, 10);
      updateMajorBuilderState({ majorBuilderYears: newYears });
      setEditingYearIndex(null); // Finish editing
    }
  };

  const renderSemesterHeader = (index) => {
    const year = years[index];
    const term = index % 2 === 0 ? "Fall" : "Spring";
    // Fall semester is in year YYYY, Spring semester is in year YYYY+1 but belongs to the YYYY-(YYYY+1) academic year
    // But displaying the calendar year makes more sense for fetching historical data
    const displayYear = year;

    if (editingYearIndex === index) {
      const currentYear = new Date().getFullYear();
      const availableYears = [];
      // Allow selecting current year + next year for planning, and past years
      // Allow one year ahead, up to 4 years back
      for (let i = -3; i <= 4; i++) {
        const y = currentYear - i;
        if (y >= COURSE_HISTORY_START_YEAR) {
          availableYears.push(y);
        }
      }
      // Ensure years are sorted correctly if needed, though loop order should be descending
      availableYears.sort((a, b) => b - a);

      return (
        <Select
          value={year}
          onChange={handleYearChange}
          onBlur={() => setEditingYearIndex(null)} // Hide select on blur
          options={availableYears}
          valueList={availableYears}
          autoFocus // Focus the select when it appears
        />
      );
    }

    return (
      <div onClick={() => handleYearHeaderClick(index)} className="year-header">
        {`${term} ${displayYear}`}
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

  // Tally Div Reqs (like an APR)
  const getAPRInfo = () => {
    const apr = {
      div1: [],
      div2: [],
      div3: [],
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

    function getDistinctPrefixCourses(arr) {
      const counts = {};
      return arr.filter((x) => {
        counts[x] = (counts[x] || 0) + 1;
        return counts[x] <= 2;
      }).length;
    }

    /* eslint-disable */
    return (
      <p>
        Div 1: {getDistinctPrefixCourses(apr.div1)}/3, Div 2:{" "}
        {getDistinctPrefixCourses(apr.div2)}/3, Div 3:{" "}
        {getDistinctPrefixCourses(apr.div3)}/3, WS: {apr.ws}, QFR: {apr.qfr},
        DPE: {apr.dpe}
      </p>
    );
    /* eslint-enable */
  };

  // Ensure grid is initialized before rendering
  if (!grid || grid.length !== MAJOR_BUILDER_SEMESTERS) {
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
              {years.map((_, index) => (
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
                {years.map((_, semesterIdx) => (
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
        {getAPRInfo()}
      </div>
      <h2>Major Builder</h2>
      <p>Check your requirements and progress toward your major(s).</p>
      <div className="major-requirements-placeholder"> {/* TODO */}</div>
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
  years: PropTypes.arrayOf(PropTypes.number).isRequired,
  historicalCatalogs: PropTypes.object.isRequired,
  updateMajorBuilderState: PropTypes.func.isRequired,
  loadHistoricalCatalog: PropTypes.func.isRequired, // Add prop type for the action dispatcher
};

const mapStateToProps = (state) => ({
  grid: getMajorBuilderGrid(state),
  years: getMajorBuilderYears(state),
  historicalCatalogs: getHistoricalCatalogs(state),
});

const mapDispatchToProps = (dispatch) => ({
  updateMajorBuilderState: (newState) =>
    dispatch(doUpdateMajorBuilderState(newState)),
  loadHistoricalCatalog: (year, catalog) =>
    dispatch(doLoadHistoricalCatalogYear(year, catalog)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MajorBuilder);
