// DISCLAIMER: FRONTEND IS NOT MY THING
// SORRY! -Charlie

// React imports
import React, { useState, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";

// Component imports
import "../../stylesheets/MajorBuilder.css";
import Select from "../../Select";

// Redux imports
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
import {
  csRegexSeparator,
  MAJORS,
  requirementCheckers,
} from "../../../constants/majors";
import { getSelectedMajor } from "../../../selectors/majorRequirements";
import { doSelectMajor } from "../../../reducers/majorRequirements";
import {
  initialMajorBuilderGrid,
  initialMajorBuilderSemesters,
} from "../../../reducers/schedulerUtils";

const MajorBuilder = ({
  grid,
  semesters,
  historicalCatalogs,
  updateMajorBuilderState,
  loadHistoricalCatalog,
  selectedMajor,
  selectMajor,
  clearMajor,
}) => {
  const [editingSemesterIndex, setEditingSemesterIndex] = useState(null);

  // Autocomplete
  const [autocompleteInput, setAutocompleteInput] = useState({
    semesterIndex: null,
    courseIndex: null,
    value: "",
  });
  const [autocomplete, setAutocomplete] = useState({
    semesterIndex: null,
    courseIndex: null,
    results: [],
  });
  const [autocompleteVisible, setAutocompleteVisible] = useState(false);

  // Major autocomplete
  const [majorInput, setMajorInput] = useState("");
  const [majorAutocompleteVisible, setMajorAutocompleteVisible] =
    useState(false);
  const [majorAutocompleteResults, setMajorAutocompleteResults] = useState([]);

  // Visuals
  const [showDivisionColors, setShowDivisionColors] = useState(true);
  const [expandedReqs, setExpandedReqs] = useState({});

  // Fulfillments
  const [fulfilledBy, setFulfilledBy] = useState({});
  const [fulfillments, setFulfillments] = useState({});

  const [triggerFetch, setTriggerFetch] = useState(false);

  // Load state from LocalStorage
  useEffect(() => {
    const savedStateRaw = localStorage.getItem(MAJOR_BUILDER_LS_KEY);
    if (savedStateRaw) {
      try {
        const savedState = JSON.parse(savedStateRaw);
        if (
          savedState.grid &&
          savedState.semesters &&
          savedState.selectedMajor !== undefined &&
          savedState.fulfilledBy &&
          savedState.fulfillments &&
          savedState.grid.length === MAJOR_BUILDER_SEMESTERS &&
          savedState.semesters.length === MAJOR_BUILDER_SEMESTERS &&
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
          selectMajor(savedState.selectedMajor || "");
          if (savedState.selectedMajor) {
            setMajorInput(savedState.selectedMajor);
          }
          setFulfilledBy(savedState.fulfilledBy);
          setFulfillments(savedState.fulfillments);
        } else {
          console.warn("Invalid LocalStorage state for MajorBuilder.");
          localStorage.removeItem(MAJOR_BUILDER_LS_KEY);
        }
      } catch (error) {
        console.error("Failed to parse MajorBuilder state:", error);
        localStorage.removeItem(MAJOR_BUILDER_LS_KEY);
      }
    }
  }, [updateMajorBuilderState, selectMajor]);

  // Fetch old courses
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearsToFetch = [];
    for (let i = 0; i < 5; i++) {
      const year = currentYear - i;
      if (year >= COURSE_HISTORY_START_YEAR) {
        if (!historicalCatalogs || !historicalCatalogs[year]) {
          yearsToFetch.push(year);
        }
      } else {
        break;
      }
    }
    yearsToFetch.forEach((year) => {
      axios({
        url: `/courses-${year}.json`,
        headers: { "X-Requested-With": "XMLHttpRequest" },
      })
        .then((response) => loadHistoricalCatalog(year, response.data))
        .catch((error) =>
          console.error(`Failed to load catalog ${year}:`, error)
        );
    });
  }, [loadHistoricalCatalog]);

  // Save state to LocalStorage whenever it changes
  useEffect(() => {
    if (
      grid &&
      semesters &&
      selectedMajor !== undefined &&
      fulfilledBy &&
      fulfillments &&
      grid.length === MAJOR_BUILDER_SEMESTERS &&
      semesters.length === MAJOR_BUILDER_SEMESTERS
    ) {
      const stateToSave = JSON.stringify({
        grid,
        semesters,
        selectedMajor,
        fulfilledBy,
        fulfillments,
      });
      localStorage.setItem(MAJOR_BUILDER_LS_KEY, stateToSave);
    }
  }, [grid, semesters, selectedMajor]);

  // Reset state
  const clearCourseGrid = () => {
    if (window.confirm("Are you sure?")) {
      updateMajorBuilderState({
        majorBuilderGrid: initialMajorBuilderGrid,
        majorBuilderSemesters: initialMajorBuilderSemesters,
      });
    }
    setFulfilledBy({});
    setFulfillments({});
    clearMajor();
    setMajorInput("");
  };

  // Handle user typing in planner grid
  const handleGridInputChange = (semesterIndex, courseIndex, event) => {
    const newGrid = JSON.parse(JSON.stringify(grid)); // Surely there's a better way
    const inputValue = event.target.value;
    newGrid[semesterIndex][courseIndex] = {
      course: null, // clear selected course if typing
      input: inputValue,
    };
    updateMajorBuilderState({ majorBuilderGrid: newGrid });

    // AUTOCOMPLETE TRIGGER
    setAutocompleteInput({ semesterIndex, courseIndex, value: inputValue });
  };

  // Handle autocomplete
  useEffect(() => {
    const { semesterIndex, courseIndex, value } = autocompleteInput;

    if (semesterIndex === null || courseIndex === null || value.length <= 1) {
      if (autocompleteVisible) setAutocompleteVisible(false);
      return;
    }

    const semester = semesters[semesterIndex];
    if (!semester) {
      if (autocompleteVisible) setAutocompleteVisible(false);
      return;
    }

    const year = semester.year;
    const targetTerm = semester.term;
    const catalogForYear = historicalCatalogs[year];

    if (catalogForYear && catalogForYear.length > 0) {
      const lowerInput = value.toLowerCase();
      const semesterFiltered = catalogForYear.filter(
        (c) =>
          c.semester === targetTerm &&
          !grid.some((sem) =>
            sem.some((cell) => cell.course?.courseID === c.courseID)
          )
      );
      const queryFiltered = semesterFiltered.filter(
        (c) =>
          c.titleLong?.toLowerCase().includes(lowerInput) ||
          c.titleShort?.toLowerCase().includes(lowerInput) ||
          `${c.department} ${c.number}`.toLowerCase().includes(lowerInput)
      );
      const uniqueMap = new Map();
      queryFiltered.forEach((c) => {
        const key = `${c.department} ${c.number}`;
        if (!uniqueMap.has(key)) uniqueMap.set(key, c);
      });
      const results = Array.from(uniqueMap.values()).slice(0, 5);
      setAutocomplete({ semesterIndex, courseIndex, results });
      setAutocompleteVisible(true);
    } else {
      if (autocompleteVisible) setAutocompleteVisible(false);
    }
  }, [autocompleteInput, historicalCatalogs, semesters, autocompleteVisible]);

  // Handle autocomplete selection
  const handleAutocompleteSelect = (
    semesterIndex,
    courseIndex,
    selectedCourse
  ) => {
    const newGrid = JSON.parse(JSON.stringify(grid));
    newGrid[semesterIndex][courseIndex] = {
      course: selectedCourse,
      input: `${selectedCourse.department} ${selectedCourse.number}`,
    };
    updateMajorBuilderState({ majorBuilderGrid: newGrid });
    setAutocompleteVisible(false);
    setAutocompleteInput({
      semesterIndex: null,
      courseIndex: null,
      value: "",
    });
  };

  // Handle autocomplete deselection
  const handleAutocompleteBlur = (semesterIndex, courseIndex) => {
    const activeElement = document.activeElement;
    const inputElement = document.getElementById(
      `input-${semesterIndex}-${courseIndex}`
    );
    const listElement = document.getElementById(
      `autocomplete-${semesterIndex}-${courseIndex}`
    );
    const focusStillInside =
      activeElement === inputElement ||
      (listElement && listElement.contains(activeElement));

    if (
      !focusStillInside &&
      autocompleteVisible &&
      autocomplete.semesterIndex === semesterIndex &&
      autocomplete.courseIndex === courseIndex
    ) {
      setTimeout(() => {
        setAutocompleteVisible(false);
      }, 200);
    }
  };

  // Semester header dropdown
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
      return a.term === "Spring" ? 1 : -1;
    });
  };
  const semesterOptions = generateSemesterOptions();

  const handleSemesterSelectionChange = (event) => {
    const selectedValue = event.target.value; // e.g. Fall-2024
    const selectedOption = semesterOptions.find(
      (opt) => opt.value === selectedValue
    );

    if (selectedOption && editingSemesterIndex !== null) {
      if (
        semesters.some(
          (sem) =>
            selectedOption.year === sem.year && selectedOption.term === sem.term
        )
      ) {
        return;
      }

      const newSemesters = [...semesters];
      newSemesters[editingSemesterIndex] = {
        term: selectedOption.term,
        year: selectedOption.year,
      };
      const newGrid = JSON.parse(JSON.stringify(grid));
      for (let i = 0; i < MAJOR_BUILDER_COURSES_PER_SEM; i++) {
        newGrid[editingSemesterIndex][i] = {
          course: null,
          input: "",
        };
      }
      updateMajorBuilderState({
        majorBuilderSemesters: newSemesters,
        majorBuilderGrid: newGrid,
      });
      setEditingSemesterIndex(null);
    } else {
      console.error("Selected semester option error:", selectedValue);
      setEditingSemesterIndex(null);
    }
  };

  const renderSemesterHeader = (index) => {
    const semester = semesters[index];

    if (editingSemesterIndex === index) {
      return (
        <Select
          value={`${semester.term}-${
            semester.term === "Fall" ? semester.year - 1 : semester.year
          }`}
          onBlur={() => setEditingSemesterIndex(null)} // Close dropdown on blur if no selection made
          onChange={handleSemesterSelectionChange}
          options={semesterOptions.map((opt) => opt.label)}
          valueList={semesterOptions.map((opt) => opt.value)}
          className="semester-edit-select single"
          autoFocus
        />
      );
    }

    return (
      <div
        onClick={() => setEditingSemesterIndex(index)}
        className="semester-header"
      >
        {`${semester.term} ${
          semester.term === "Fall" ? semester.year - 1 : semester.year
        }`}
      </div>
    );
  };

  // Flatten grid into 1D array of courses for processing
  const getFlatUserCourses = useMemo(() => {
    const courses = [];
    for (let semIdx = 0; semIdx < MAJOR_BUILDER_SEMESTERS; semIdx++) {
      for (
        let courseIdx = 0;
        courseIdx < MAJOR_BUILDER_COURSES_PER_SEM;
        courseIdx++
      ) {
        if (grid[semIdx]?.[courseIdx]?.course) {
          courses.push(grid[semIdx][courseIdx].course);
        }
      }
    }
    return courses;
  }, [grid]);

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

    function getDistinctPrefixCourses(arr) {
      const counts = {};
      // Filter to keep only the first 2 occurrences of each department prefix
      const filteredByDeptLimit = arr.filter((deptPrefix) => {
        counts[deptPrefix] = (counts[deptPrefix] || 0) + 1;
        return counts[deptPrefix] <= 2;
      });
      return filteredByDeptLimit.length;
    }

    for (const course of getFlatUserCourses) {
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

  const getGridCellColor = (course) => {
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

  const toggleReqExpansion = (reqKey) => {
    setExpandedReqs((prev) => ({ ...prev, [reqKey]: !prev[reqKey] }));
  };
  const setAllReqsExpansion = (majorName, isExpanded) => {
    const newExpanded = { ...expandedReqs };
    MAJORS[majorName]?.Requirements.forEach((req) => {
      newExpanded[`${majorName}-${req.description}`] = isExpanded;
    });
    setExpandedReqs(newExpanded);
  };

  const handleMajorInputChange = (event) => {
    const value = event.target.value;
    setMajorInput(value);
    clearMajor(); // clear selected major in Redux if user starts typing

    if (value.length > 0) {
      const lowerValue = value.toLowerCase();
      const results = Object.keys(MAJORS)
        .filter((majorName) => majorName.toLowerCase().includes(lowerValue))
        .slice(0, 5);
      setMajorAutocompleteResults(results);
      setMajorAutocompleteVisible(true);
    } else {
      setMajorAutocompleteVisible(false);
      setMajorAutocompleteResults([]);
    }
  };
  const handleMajorAutocompleteSelect = (majorName) => {
    setMajorInput(majorName);
    selectMajor(majorName);
    setMajorAutocompleteVisible(false);
    setMajorAutocompleteResults([]);
  };
  const handleMajorAutocompleteBlur = () => {
    setTimeout(() => {
      const activeElement = document.activeElement;
      const isStillInteracting = activeElement?.closest(
        "#major-autocomplete-results"
      );
      if (!isStillInteracting) {
        setMajorAutocompleteVisible(false);
      }
    }, 200);
  };

  // Mark an unchecked course as completed, or marked a check course as unfinished to trigger reprocessing
  const handleManualOverride = (itemStr, isChecked) => {
    const newFulfilledBy = JSON.parse(JSON.stringify(fulfilledBy));
    const newFulfillments = JSON.parse(JSON.stringify(fulfillments));
    if (isChecked) {
      if (fulfilledBy[itemStr] === "blocked") {
        delete newFulfilledBy[itemStr];
      } else {
        newFulfilledBy[itemStr] = "manual";
      }
    } else {
      delete newFulfillments[fulfilledBy[itemStr].courseID];
      newFulfilledBy[itemStr] = "blocked";
    }
    setFulfilledBy(newFulfilledBy);
    setFulfillments(newFulfillments);
    setTriggerFetch(!triggerFetch);
  };

  const truncateItemStr = (itemStr) => {
    if (itemStr.includes(csRegexSeparator)) {
      return itemStr.substring(0, itemStr.indexOf(csRegexSeparator));
    }
    return itemStr;
  };
  const truncateItemArr = (arr) => {
    return arr.map((str) => {
      return truncateItemStr(str);
    });
  };

  const requirementResults = useMemo(() => {
    if (!selectedMajor || !MAJORS[selectedMajor]) return <div></div>;
    const results = {};
    var newFulfilledBy = JSON.parse(JSON.stringify(fulfilledBy));
    var newFulfillments = JSON.parse(JSON.stringify(fulfillments));
    MAJORS[selectedMajor].Requirements.forEach((req) => {
      const reqKey = `${selectedMajor}-${req.description}`;

      const checkerFunc = requirementCheckers[req.identifier || "requireN"];

      const result = checkerFunc
        ? checkerFunc(req.args, grid, newFulfilledBy, newFulfillments)
        : {
            autoFulfilledCount: 0,
            fulfilledBy: {},
            fulfillments: {},
            placeholders: [],
          };
      setFulfilledBy(result.fulfilledBy);
      setFulfillments(result.fulfillments);

      const target = req.args[1];

      let finalFulfilledCount = 0;
      for (let item of req.args[0]) {
        if (typeof item === "string") {
          item = [item];
        }
        for (const itemStr of item) {
          if (fulfilledBy[itemStr] && fulfilledBy[itemStr] !== "blocked") {
            finalFulfilledCount++;
          }
        }
      }
      // finalFulfilledCount = Math.min(finalFulfilledCount, target);

      results[reqKey] = { result, finalFulfilledCount, target };
    });
    return results;
  }, [getFlatUserCourses, selectedMajor, triggerFetch]);

  const renderCourseRequirement = (itemStr, result, reqKey, subItemClass) => {
    const itemRenderStr = truncateItemStr(itemStr);
    const itemKey = `${reqKey}-${itemStr}`;
    const isPlaceholder = result.placeholders.includes(itemStr);
    let isChecked = false;
    const fulfillingCourse = fulfilledBy[itemStr];
    if (fulfillingCourse === "manual") {
      isChecked = true;
    } else if (fulfillingCourse === "blocked") {
      isChecked = false;
    } else {
      if (fulfillingCourse && typeof fulfillingCourse === "object") {
        isChecked = true;
      }
    }

    let viaStr = fulfillingCourse
      ? typeof fulfillingCourse === "object"
        ? `${fulfillingCourse.department} ${fulfillingCourse.number}`
        : "manual override"
      : "";

    return (
      <li
        key={itemKey}
        className={`requirement-list-item ${
          isPlaceholder ? "placeholder" : ""
        } ${subItemClass}`}
      >
        <input
          type="checkbox"
          className="requirement-item-checkbox"
          checked={isChecked}
          onChange={(e) => handleManualOverride(itemStr, e.target.checked)}
          title={`Mark ${itemRenderStr} as ${isChecked ? "not " : ""}fulfilled`}
        />
        <span className={`status-indicator ${isChecked ? "met" : "not-met"}`}>
          {isChecked ? "✓" : "✕"}
        </span>
        <span
          className="item-string"
          style={
            fulfillingCourse === "blocked"
              ? { textDecoration: "line-through" }
              : {}
          }
        >
          {itemRenderStr}
        </span>
        {isChecked && fulfillingCourse && (
          <span className="fulfilled-by-auto"> (via {viaStr})</span>
        )}
      </li>
    );
  };

  const requirementsList = useMemo(() => {
    return (
      <div className="requirements-list">
        {MAJORS[selectedMajor] &&
          MAJORS[selectedMajor].Requirements.map((req, idx) => {
            const reqKey = `${selectedMajor}-${req.description}`;

            const isExpanded = !!expandedReqs[reqKey];

            const { result, finalFulfilledCount, target } = requirementResults[
              reqKey
            ] || {
              result: {},
              finalFulfilledCount: 0,
              target: 0,
            };
            const isMetOverall = finalFulfilledCount >= target;

            // Create "Needs" string for collapsed view
            let needsStr = "";
            if (!isMetOverall && !isExpanded) {
              const unmetItemsFormatted = req.args[0]
                .map((itemOrGroup) => {
                  const itemsToCheck = Array.isArray(itemOrGroup)
                    ? itemOrGroup
                    : [itemOrGroup];
                  // Check if *any* item in this slot/group was fulfilled (by grid or manual override)
                  const isSlotMet = itemsToCheck.some(
                    (r) => fulfilledBy[r] && fulfilledBy[r] !== "blocked"
                  );

                  if (!isSlotMet) {
                    return Array.isArray(itemOrGroup)
                      ? itemOrGroup.join("/")
                      : itemOrGroup;
                  }
                  return null;
                })
                .filter(Boolean);

              if (unmetItemsFormatted.length > 0) {
                needsStr = `Needs: ${truncateItemArr(unmetItemsFormatted).join(
                  ", "
                )}`;
              }
            }

            return (
              <div key={reqKey} className="requirement-bucket">
                {/* Collapsed view */}
                <div
                  className="requirement-header"
                  onClick={() => toggleReqExpansion(reqKey)}
                >
                  <span
                    className={`expand-collapse-icon ${
                      isExpanded ? "expanded" : "collapsed"
                    }`}
                  >
                    {isExpanded ? "▼" : "▶"}
                  </span>
                  <span
                    className={`status-indicator ${
                      isMetOverall ? "met" : "not-met"
                    }`}
                  >
                    {isMetOverall ? "✓" : "✕"}
                  </span>
                  <span className="requirement-description">
                    {req.description} ({finalFulfilledCount}/{target})
                  </span>
                  {needsStr && (
                    <span className="collapsed-needs" title={needsStr}>
                      {needsStr}
                    </span>
                  )}
                </div>

                {/* Expanded view */}
                {isExpanded && (
                  <ul className="requirement-item-list">
                    {req.args[0].map((itemOrGroup, groupIdx) => {
                      // Render OR group
                      if (Array.isArray(itemOrGroup)) {
                        return (
                          <li
                            key={`${reqKey}-group-${groupIdx}`}
                            className="requirement-or-group"
                          >
                            <span className="or-group-label">One of:</span>
                            <ul>
                              {itemOrGroup.map((itemStr, subIdx) => {
                                return renderCourseRequirement(
                                  itemStr,
                                  result,
                                  reqKey,
                                  "sub-item"
                                );
                              })}
                            </ul>
                          </li>
                        );
                      }
                      // Render single item
                      else {
                        const itemStr = itemOrGroup;
                        return renderCourseRequirement(
                          itemStr,
                          result,
                          reqKey,
                          ""
                        );
                      }
                    })}
                  </ul>
                )}
              </div>
            );
          })}
      </div>
    );
  }, [fulfilledBy, expandedReqs, triggerFetch]);

  // Ensure grid is initialized before rendering
  if (
    !grid ||
    grid.length !== MAJOR_BUILDER_SEMESTERS ||
    !semesters ||
    semesters.length !== MAJOR_BUILDER_SEMESTERS
  ) {
    return <div>Loading Major Builder...</div>;
  }

  // RENDER
  return (
    <div className="major-builder-container">
      <h2>Planner</h2>
      <p>Plan your academic journey.</p>
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
              <th className="grid-corner-cell">
                <button
                  onClick={clearCourseGrid}
                  className="clear-grid-button"
                  title="Clear all courses from the planner grid"
                >
                  Clear
                </button>
              </th>
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
                    style={getGridCellColor(
                      grid[semesterIdx]?.[courseIdx]?.course
                    )}
                  >
                    <div className="cs-input-container">
                      <input
                        id={`input-${semesterIdx}-${courseIdx}`}
                        type="text"
                        value={grid[semesterIdx]?.[courseIdx]?.input || ""}
                        onChange={(e) =>
                          handleGridInputChange(semesterIdx, courseIdx, e)
                        }
                        onBlur={() =>
                          handleAutocompleteBlur(semesterIdx, courseIdx)
                        }
                        autoComplete="off"
                      />
                      {autocompleteVisible &&
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
                                  }
                                  onClick={() =>
                                    handleAutocompleteSelect(
                                      semesterIdx,
                                      courseIdx,
                                      course
                                    )
                                  }
                                  role="presentation"
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
      <p>Pick a course of study that&apos;s right for you.</p>
      <div className="major-selection-container cs-input-container">
        <label htmlFor="major-input">Select Major:</label>
        <input
          id="major-input"
          type="text"
          value={majorInput}
          onChange={handleMajorInputChange}
          onBlur={handleMajorAutocompleteBlur}
          placeholder="Type major..."
          autoComplete="off"
        />
        {majorAutocompleteVisible && majorAutocompleteResults.length > 0 && (
          <ul
            className="autocomplete-results major-autocomplete"
            id="major-autocomplete-results"
          >
            {majorAutocompleteResults.map((majorName) => (
              <li
                key={majorName}
                onClick={() => handleMajorAutocompleteSelect(majorName)}
                role="presentation"
              >
                {majorName}
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedMajor && MAJORS[selectedMajor] && (
        <div className="all-majors-container">
          <div className="major-requirements-display">
            <h3>Requirements for {selectedMajor}</h3>
            <ul className="major-info-list">
              {MAJORS[selectedMajor].Info.map((info, i) => (
                <li key={`info-${i}`}>{info}</li>
              ))}
            </ul>
            <div className="major-req-controls">
              <button onClick={() => setAllReqsExpansion(selectedMajor, true)}>
                Expand All
              </button>
              <button onClick={() => setAllReqsExpansion(selectedMajor, false)}>
                Collapse All
              </button>
            </div>
            {requirementsList}
          </div>
        </div>
      )}
    </div>
  );
};

MajorBuilder.propTypes = {
  grid: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        course: PropTypes.object,
        input: PropTypes.string.isRequired,
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
  loadHistoricalCatalog: PropTypes.func.isRequired,
  selectedMajor: PropTypes.string.isRequired,
  selectMajor: PropTypes.func.isRequired,
  clearMajor: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  grid: getMajorBuilderGrid(state),
  semesters: getMajorBuilderSemesters(state),
  historicalCatalogs: getHistoricalCatalogs(state),
  selectedMajor: getSelectedMajor(state),
});

const mapDispatchToProps = (dispatch) => ({
  updateMajorBuilderState: (newState) =>
    dispatch(doUpdateMajorBuilderState(newState)),
  loadHistoricalCatalog: (year, catalog) =>
    dispatch(doLoadHistoricalCatalogYear(year, catalog)),
  selectMajor: (major) => dispatch(doSelectMajor(major)),
  clearMajor: () => dispatch(doSelectMajor("")),
});

export default connect(mapStateToProps, mapDispatchToProps)(MajorBuilder);
