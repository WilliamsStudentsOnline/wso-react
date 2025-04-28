// React imports
import React from "react";
// Redux imports
import { useAppDispatch, useAppSelector } from "../lib/store"; // Adjust path as needed
import {
  selectQueryFilters,
  updateQueryField,
  toggleQueryYear,
  toggleQueryType,
  AVAILABLE_YEARS,
  AVAILABLE_TYPES,
  UserType,
} from "../lib/queryBuilderSlice"; // Adjust path as needed

// Component imports
import Button from "./Components"; // Assuming Button is a simple styled button component
import StatesDropdown from "./StatesDropdown";

const QueryTable = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectQueryFilters);

  const handleFieldChange = (
    field: keyof typeof filters,
    value: string | number
  ) => {
    // Ensure value is string for fields expecting string
    const stringValue = typeof value === "number" ? String(value) : value;
    dispatch(updateQueryField({ field, value: stringValue }));
  };

  const handleYearToggle = (year: number) => {
    dispatch(toggleQueryYear(year));
  };

  const handleTypeToggle = (type: UserType) => {
    dispatch(toggleQueryType(type));
  };

  return (
    <table id="homepage-table">
      <tbody>
        <tr>
          <td align="right">
            <strong>name</strong>
          </td>
          <td align="left">
            <input
              type="text"
              placeholder="John Doe"
              value={filters.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
            />
          </td>
          <td align="right">
            <strong>unix</strong>
          </td>
          <td align="left">
            <input
              type="text"
              placeholder="e.g. eph"
              value={filters.unix}
              onChange={(e) => handleFieldChange("unix", e.target.value)}
            />
          </td>
        </tr>
        <tr>
          <td align="right">
            <strong>country</strong>
          </td>
          <td align="left">
            <input
              type="text"
              placeholder="United States"
              value={filters.country}
              onChange={(e) => handleFieldChange("country", e.target.value)}
              disabled={!!filters.state}
            />
          </td>
          <td align="right">
            <strong>state (US)</strong>
          </td>
          <td align="center">
            <div className="vertical">
              <StatesDropdown
                updateState={(value) => handleFieldChange("state", value)}
                currentState={filters.state}
              />
            </div>
          </td>
          <td align="right">
            <strong>city</strong>
          </td>
          <td align="left">
            <input
              type="text"
              placeholder="Williamstown"
              value={filters.city}
              onChange={(e) => handleFieldChange("city", e.target.value)}
            />
          </td>
          <td></td>
        </tr>
        <tr>
          <td align="right">
            <strong>class year</strong>
          </td>
          {AVAILABLE_YEARS.map((year) => (
            <td align="left" key={year}>
              <Button
                onClick={() => handleYearToggle(year)}
                className={
                  filters.selectedYears.includes(year)
                    ? "button-toggled"
                    : "button-default"
                }
              >
                {`'${String(year).padStart(2, "0")}`}
              </Button>
            </td>
          ))}
          {[...Array(Math.max(0, 4 - AVAILABLE_YEARS.length))].map((_, i) => (
            <td key={`empty-yr-${i}`}></td>
          ))}
        </tr>
        <tr>
          <td align="right">
            <strong>type</strong>
          </td>
          {AVAILABLE_TYPES.map((type) => (
            <td align="left" key={type}>
              <Button
                onClick={() => handleTypeToggle(type)}
                className={
                  filters.selectedTypes.includes(type)
                    ? "button-toggled"
                    : "button-default"
                }
              >
                {type}
              </Button>
            </td>
          ))}
          {[...Array(Math.max(0, 3 - AVAILABLE_TYPES.length))].map((_, i) => (
            <td key={`empty-type-${i}`}></td>
          ))}
        </tr>
        <tr style={{ height: "10px" }}></tr>
        <tr>
          <td align="right">
            <strong>building</strong>
          </td>
          <td align="left">
            <input
              type="text"
              placeholder="Paresky"
              value={filters.building}
              onChange={(e) => handleFieldChange("building", e.target.value)}
            />
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
  );
};

export default QueryTable;
