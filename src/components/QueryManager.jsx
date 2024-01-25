/* eslint-disable no-template-curly-in-string */
// React imports
import React from "react";
import PropTypes from "prop-types";

const QueryManager = ({
  search,
  name,
  unix,
  country,
  state,
  city,
  year27Selected,
  year26Selected,
  year25Selected,
  year24Selected,
  professorSelected,
  staffSelected,
  studentSelected,
  building,
  advancedFiltersSelected,
  updateQuery,
}) => {
  // display all active filters
  let str = "";
  let prior = false;

  // base query (search box)
  if (search.trim() !== "") {
    str += search;
    prior = true;
  }

  // name
  if (name.trim() !== "") {
    str += prior ? " AND (" : "(";
    str += `name: "${name}")`;
    prior = true;
  }

  // unix
  if (unix.trim() !== "") {
    str += prior ? " AND (" : "(";
    str += `unix: "${unix}")`;
    prior = true;
  }

  // country
  if (state !== "") country = "United States";
  if (country.trim() !== "") {
    str += prior ? " AND (" : "(";
    str += `country: "${country}")`;
    prior = true;
  }

  // state
  if (state !== "") {
    str += prior ? " AND (" : "(";
    str += `state: "${state}")`;
    prior = true;
  }

  // town
  if (city.trim() !== "") {
    str += prior ? " AND (" : "(";
    str += `city: "${city}")`;
    prior = true;
  }

  // year
  let firstYear = 1;
  if (!year27Selected) {
    firstYear = 2;
    if (!year26Selected) {
      firstYear = 3;
      if (!year25Selected) {
        firstYear = 4;
      }
    }
  }
  if (year27Selected || year26Selected || year25Selected || year24Selected)
    str += prior ? " AND (" : "(";
  if (year27Selected) str += 'year: "27"';
  if (year26Selected) str += firstYear === 2 ? 'year: "26"' : ' OR year: "26"';
  if (year25Selected) str += firstYear === 3 ? 'year: "25"' : ' OR year: "25"';
  if (year24Selected) str += firstYear === 4 ? 'year: "24"' : ' OR year: "24"';
  if (year27Selected || year26Selected || year25Selected || year24Selected) {
    str += ")";
    prior = true;
  }

  // type
  let firstType = 1;
  if (!professorSelected) {
    firstType = 2;
    if (!staffSelected) {
      firstType = 3;
    }
  }
  if (professorSelected || staffSelected || studentSelected)
    str += prior ? " AND (" : "(";
  if (professorSelected) str += 'type: "professor"';
  if (staffSelected)
    str += firstType === 2 ? 'type: "staff"' : ' OR type: "staff"';
  if (studentSelected)
    str += firstType === 3 ? 'type: "student"' : ' OR type: "student"';
  if (professorSelected || staffSelected || studentSelected) {
    str += ")";
    prior = true;
  }

  // building
  if (building.trim() !== "") {
    str += prior ? " AND (" : "(";
    str += `bldg: "${building}")`;
  }

  // warning conditions
  let warn = "";
  if (
    (professorSelected || staffSelected) &&
    !studentSelected &&
    (country !== "" ||
      state !== "" ||
      city !== "" ||
      year27Selected ||
      year26Selected ||
      year25Selected ||
      year24Selected)
  ) {
    warn = 'student-only filter added with type: "student" excluded';
  }

  // render, update query
  if (!advancedFiltersSelected) return <></>;
  else if (str === "") {
    updateQuery(str);
    return (
      <div>
        <div className="active-filters">
          <div id="italic">empty query</div>
        </div>
        <br />
      </div>
    );
  } else {
    updateQuery(str);
    if (warn === "")
      return (
        <div>
          <div className="active-filters">{str}</div>
          <br />
        </div>
      );
    else
      return (
        <div>
          <div className="active-filters">{str}</div>
          <div className="warning">{warn}</div>
        </div>
      );
  }
};

QueryManager.propTypes = {
  search: PropTypes.string,
  name: PropTypes.string,
  unix: PropTypes.string,
  country: PropTypes.string,
  state: PropTypes.string,
  city: PropTypes.string,
  year27Selected: PropTypes.bool,
  year26Selected: PropTypes.bool,
  year25Selected: PropTypes.bool,
  year24Selected: PropTypes.bool,
  professorSelected: PropTypes.bool,
  staffSelected: PropTypes.bool,
  studentSelected: PropTypes.bool,
  building: PropTypes.string,
  advancedFiltersSelected: PropTypes.bool,
  updateQuery: PropTypes.func,
};

export default QueryManager;
