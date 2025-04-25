// React imports
import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// Component imports
import "../../stylesheets/AdditionalOptions.css";
import Checkbox from "./Checkbox";
import Select from "../../Select";
import Accordion from "./Accordion";

// Redux (Selector, Reducer, Actions) imports
import {
  getFilters,
  getSearchedCourses,
  getStartTimes,
  getEndTimes,
  getCounts,
  getCatalogUpdateTime,
  getShowFactrakScore,
  getMinFactrakScore,
  getIncludeFactrakNoScores,
} from "../../../selectors/course";
import { getTimeFormat } from "../../../selectors/schedulerUtils";
import {
  START_TIMES,
  START_TIMES12,
  END_TIMES,
  END_TIMES12,
  CLASS_TYPES,
} from "../../../constants/constants";
import {
  doToggleConflict,
  doToggleOthers,
  doToggleLevel,
  doToggleSem,
  doToggleDist,
  doToggleDiv,
  doToggleRemote,
  doToggleType,
  doUpdateStart,
  doUpdateEnd,
  doSearchCourse,
  doResetFilters,
  doToggleFactrakScoreDisplay,
  doSetMinFactrakScore,
  doToggleIncludeFactrakNoScores,
} from "../../../actions/course";

const AdditionalOptions = ({
  catalog,
  semClick,
  distClick,
  divClick,
  othersClick,
  conflictClick,
  levelClick,
  typeClick,
  remoteClick,
  toggleFactrakScoreClick,
  setMinFactrakScoreClick,
  toggleIncludeNoScoresClick,
  filters,
  onSearch,
  startChange,
  endChange,
  resetFilters,
  twelveHour,
  counts,
  updateTime,
  showFactrakScore,
  minFactrakScore,
  includeFactrakNoScores,
}) => {
  const factrakAuth = catalog.length > 0 && catalog[0].factrakScore; // lazy!

  // Generates a description of how many courses were found.
  const numFound = (length) => {
    if (length === 1) {
      return <span className="num-found">1 course found</span>;
    }
    return <span className="num-found">{`${length} courses found`}</span>;
  };

  // Handles the clicking and triggers a search update,
  // *unless* the action is purely for display (like toggleFactrakScoreClick)
  const clickLoader = (funct, param) => {
    if (param && param.target) {
      // Check if it's an event object
      funct(param.target.value); // Extract value from event
    } else {
      funct(param); // Use param directly (e.g., slider value, index)
    }
    // Only trigger search if the function isn't the display toggle (SPECIAL CASE!)
    if (funct !== toggleFactrakScoreClick) {
      onSearch(); // Trigger search/filter update
    }
  };

  // Determining which set of start times should be used.
  const startTimes = twelveHour ? START_TIMES12 : START_TIMES;
  const endTimes = twelveHour ? END_TIMES12 : END_TIMES;

  return (
    <div className="additional-options-container">
      <div className="additional-options">
        {numFound(catalog.length)}
        <span className="refine">Refine by</span>
        {factrakAuth ? (
          <Accordion header="Course Reviews" startsHidden={false}>
            <ul className="factrak-filters">
              <li>
                <Checkbox
                  // This checkbox just toggles a display setting, no immediate search needed
                  // Call action directly, bypassing clickLoader
                  onClick={toggleFactrakScoreClick}
                  checked={showFactrakScore}
                />
                Display factrak score (if available)
              </li>
              <li>
                <Checkbox
                  onClick={() => clickLoader(toggleIncludeNoScoresClick)}
                  checked={includeFactrakNoScores}
                />
                Include courses with no Factrak reviews ({counts.factrak[0]})
              </li>
              <li className="slider-container">
                <label htmlFor="factrak-slider">
                  Minimum Factrak Score:{" "}
                  {minFactrakScore > 0 ? minFactrakScore : "Any"} (
                  {counts.factrak[1]})
                </label>
                <input
                  type="range"
                  id="factrak-slider"
                  min="0"
                  max="100"
                  step="1"
                  value={minFactrakScore}
                  onChange={(e) => clickLoader(setMinFactrakScoreClick, e)}
                  className="factrak-score-slider"
                />
              </li>
            </ul>
          </Accordion>
        ) : (
          ""
        )}
        <Accordion header="Level">
          <ul className="Level">
            <li>
              <Checkbox
                onClick={() => clickLoader(levelClick, 0)}
                checked={filters.levels[0]}
              />
              {`000 (${counts.levels[0]})`}
            </li>
            <li>
              <Checkbox
                onClick={() => clickLoader(levelClick, 1)}
                checked={filters.levels[1]}
              />
              {`100 (${counts.levels[1]})`}
            </li>
            <li>
              <Checkbox
                onClick={() => clickLoader(levelClick, 2)}
                checked={filters.levels[2]}
              />
              {`200 (${counts.levels[2]})`}
            </li>
            <li>
              <Checkbox
                onClick={() => clickLoader(levelClick, 3)}
                checked={filters.levels[3]}
              />
              {`300 (${counts.levels[3]})`}
            </li>
            <li>
              <Checkbox
                onClick={() => clickLoader(levelClick, 4)}
                checked={filters.levels[4]}
              />
              {`400 (${counts.levels[4]})`}
            </li>
          </ul>
        </Accordion>
        <Accordion header="Divisions">
          <ul className="Division">
            <li>
              <Checkbox
                onClick={() => clickLoader(divClick, 0)}
                checked={filters.divisions[0]}
              />
              {`Division I (${counts.divisions[0]})`}
            </li>
            <li>
              <Checkbox
                onClick={() => clickLoader(divClick, 1)}
                checked={filters.divisions[1]}
              />
              {`Division II (${counts.divisions[1]})`}
            </li>
            <li>
              <Checkbox
                onClick={() => clickLoader(divClick, 2)}
                checked={filters.divisions[2]}
              />
              {`Division III (${counts.divisions[2]})`}
            </li>
          </ul>
        </Accordion>
        <Accordion header="Distributions">
          <ul className="Distribution">
            <li>
              <Checkbox
                onClick={() => clickLoader(distClick, 0)}
                checked={filters.distributions[0]}
              />
              {`Diversity, Power, and Equality (DPE) (${counts.distributions[0]})`}
            </li>
            <li>
              <Checkbox
                onClick={() => clickLoader(distClick, 1)}
                checked={filters.distributions[1]}
              />
              {`Quantitative/Formal Reasoning (QFR) (${counts.distributions[1]})`}
            </li>
            <li>
              <Checkbox
                onClick={() => clickLoader(distClick, 2)}
                checked={filters.distributions[2]}
              />
              {`Writing Skills (WS) (${counts.distributions[2]})`}
            </li>
          </ul>
        </Accordion>
        <Accordion header="Other Attributes">
          <ul className="pffc">
            <li>
              <Checkbox
                onClick={() => clickLoader(othersClick, 0)}
                checked={filters.others[0]}
              />
              {`Pass/Fail Available (${counts.others[0]})`}
            </li>
            <li>
              <Checkbox
                onClick={() => clickLoader(othersClick, 1)}
                checked={filters.others[1]}
              />
              {`Fifth Course Available (${counts.others[1]})`}
            </li>
          </ul>
        </Accordion>
        <Accordion header="Semester">
          <ul className="semester">
            <li>
              <Checkbox
                onClick={() => clickLoader(semClick, 0)}
                checked={filters.semesters[0]}
              />
              {`Fall (${counts.semesters[0]})`}
            </li>
            <li>
              <Checkbox
                onClick={() => clickLoader(semClick, 1)}
                checked={filters.semesters[1]}
              />
              {`Winter (${counts.semesters[1]})`}
            </li>
            <li>
              <Checkbox
                onClick={() => clickLoader(semClick, 2)}
                checked={filters.semesters[2]}
              />
              {`Spring (${counts.semesters[2]})`}
            </li>
          </ul>
        </Accordion>
        <Accordion header="Conflicts">
          <ul className="no-conflict">
            <li>
              <Checkbox
                onClick={() => clickLoader(conflictClick, 0)}
                checked={filters.conflict[0]}
              />
              {`Only classes that fit my current schedule (${counts.conflict[0]})`}
            </li>
          </ul>
        </Accordion>
        <Accordion header="Time">
          <div className="row">
            <div className="column">
              <span className="ul-header">Start Time</span>
              {/* We pass in the 24 hour values for comparison so we don't have to write
                    methods to parse them in the reducer. */}
              <Select
                onChange={(event) => clickLoader(startChange, event)}
                options={startTimes.filter((time, index) => {
                  if (filters.end) return START_TIMES[index] < filters.end;
                  return true;
                })}
                value={filters.start}
                valueList={START_TIMES.filter((time, index) => {
                  if (filters.end) return START_TIMES[index] < filters.end;
                  return true;
                })}
                fillerOption="Pick a Time"
                fillerValue=""
              />
            </div>
            <div className="column">
              <span className="ul-header">End Time</span>
              <Select
                onChange={(event) => clickLoader(endChange, event)}
                options={endTimes.filter((time, index) => {
                  if (filters.start) return END_TIMES[index] > filters.start;
                  return true;
                })}
                value={filters.end}
                valueList={END_TIMES.filter((time, index) => {
                  if (filters.start) return END_TIMES[index] > filters.start;
                  return true;
                })}
                fillerOption="Pick a Time"
                fillerValue=""
              />
            </div>
          </div>
        </Accordion>
        <Accordion header="Remote Availability">
          <ul className="remote">
            <li>
              <Checkbox
                onClick={() => clickLoader(remoteClick, 0)}
                checked={filters.remote[0]}
              />
              {`Hybrid (${counts.remote[0]})`}
            </li>
            <li>
              <Checkbox
                onClick={() => clickLoader(remoteClick, 1)}
                checked={filters.remote[1]}
              />
              {`Remote (${counts.remote[1]})`}
            </li>
            <li>
              <Checkbox
                onClick={() => clickLoader(remoteClick, 2)}
                checked={filters.remote[2]}
              />
              {`In-person (${counts.remote[2]})`}
            </li>
          </ul>
        </Accordion>
        <Accordion header="Class Formats">
          <ul className="class-types">
            <li>
              <Checkbox
                onClick={() => clickLoader(typeClick, 0)}
                checked={filters.classTypes[0]}
              />
              {`${CLASS_TYPES[0]} (${counts.classTypes[0]})`}
            </li>
            <li>
              <Checkbox
                onClick={() => clickLoader(typeClick, 1)}
                checked={filters.classTypes[1]}
              />
              {`${CLASS_TYPES[1]} (${counts.classTypes[1]})`}
            </li>
            <li>
              <Checkbox
                onClick={() => clickLoader(typeClick, 2)}
                checked={filters.classTypes[2]}
              />
              {`${CLASS_TYPES[2]} (${counts.classTypes[2]})`}
            </li>
            <li>
              <Checkbox
                onClick={() => clickLoader(typeClick, 3)}
                checked={filters.classTypes[3]}
              />
              {`${CLASS_TYPES[3]} (${counts.classTypes[3]})`}
            </li>
            <li>
              <Checkbox
                onClick={() => clickLoader(typeClick, 4)}
                checked={filters.classTypes[4]}
              />
              {`${CLASS_TYPES[4]} (${counts.classTypes[4]})`}
            </li>
            <li>
              <Checkbox
                onClick={() => clickLoader(typeClick, 5)}
                checked={filters.classTypes[5]}
              />
              {`${CLASS_TYPES[5]} (${counts.classTypes[5]})`}
            </li>
          </ul>
        </Accordion>

        <div className="reset-filters">
          <button type="button" onClick={() => clickLoader(resetFilters)}>
            Reset Filters
          </button>
        </div>
        <span className="last-update">
          {updateTime ? `Catalog last updated on ${updateTime}` : ""}
          <br></br>
          <div style={{ lineHeight: "1em" }}>
            Factrak reviews are aggregated from archival data; check Factrak for
            only recent reviews
          </div>
        </span>
      </div>
    </div>
  );
};

AdditionalOptions.propTypes = {
  catalog: PropTypes.arrayOf(PropTypes.object).isRequired,
  semClick: PropTypes.func.isRequired,
  distClick: PropTypes.func.isRequired,
  divClick: PropTypes.func.isRequired,
  othersClick: PropTypes.func.isRequired,
  conflictClick: PropTypes.func.isRequired,
  levelClick: PropTypes.func.isRequired,
  typeClick: PropTypes.func.isRequired,
  remoteClick: PropTypes.func.isRequired,
  setMinFactrakScoreClick: PropTypes.func.isRequired,
  toggleIncludeNoScoresClick: PropTypes.func.isRequired,
  toggleFactrakScoreClick: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  onSearch: PropTypes.func.isRequired,
  startChange: PropTypes.func.isRequired,
  endChange: PropTypes.func.isRequired,
  resetFilters: PropTypes.func.isRequired,
  twelveHour: PropTypes.bool.isRequired,
  counts: PropTypes.object.isRequired,
  minFactrakScore: PropTypes.number.isRequired,
  showFactrakScore: PropTypes.bool.isRequired,
  includeFactrakNoScores: PropTypes.bool.isRequired,
  updateTime: PropTypes.string,
};

AdditionalOptions.defaultProps = {
  updateTime: "",
};

const mapStateToProps = (state) => ({
  catalog: getSearchedCourses(state),
  filters: getFilters(state),
  startTimes: getStartTimes(state),
  endTimes: getEndTimes(state),
  twelveHour: getTimeFormat(state),
  counts: getCounts(state),
  updateTime: getCatalogUpdateTime(state),
  showFactrakScore: getShowFactrakScore(state),
  minFactrakScore: getMinFactrakScore(state),
  includeFactrakNoScores: getIncludeFactrakNoScores(state),
});

const mapDispatchToProps = (dispatch) => ({
  onSearch: (query = undefined, filters) =>
    dispatch(doSearchCourse(query, filters)),
  conflictClick: () => dispatch(doToggleConflict()),
  othersClick: (index) => dispatch(doToggleOthers(index)),
  divClick: (index) => dispatch(doToggleDiv(index)),
  distClick: (index) => dispatch(doToggleDist(index)),
  levelClick: (index) => dispatch(doToggleLevel(index)),
  semClick: (index) => dispatch(doToggleSem(index)),
  startChange: (time) => dispatch(doUpdateStart(time)),
  endChange: (time) => dispatch(doUpdateEnd(time)),
  resetFilters: () => dispatch(doResetFilters()),
  typeClick: (index) => dispatch(doToggleType(index)),
  remoteClick: (index) => dispatch(doToggleRemote(index)),
  toggleFactrakScoreClick: () => dispatch(doToggleFactrakScoreDisplay()),
  toggleIncludeNoScoresClick: () => dispatch(doToggleIncludeFactrakNoScores()),
  setMinFactrakScoreClick: (score) => dispatch(doSetMinFactrakScore(score)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdditionalOptions);
