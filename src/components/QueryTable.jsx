// React imports
import React from "react";
import PropTypes from "prop-types";
import Button from "./Components";
import StatesDropdown from "./StatesDropdown";

const QueryTable = ({
  updateName,
  updateUnix,
  updateCountry,
  updateState,
  updateCity,
  year27Selected,
  year26Selected,
  year25Selected,
  year24Selected,
  setYear27Selected,
  setYear26Selected,
  setYear25Selected,
  setYear24Selected,
  professorSelected,
  staffSelected,
  studentSelected,
  setProfessorSelected,
  setStaffSelected,
  setStudentSelected,
  updateBuilding,
}) => {
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
              onChange={(event) => updateName(event.target.value)}
            />
          </td>
          <td align="right">
            <strong>unix</strong>
          </td>
          <td align="left">
            <input
              type="text"
              placeholder="####"
              onChange={(event) => updateUnix(event.target.value)}
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
              onChange={(event) => updateCountry(event.target.value)}
            />
          </td>
          <td align="right">
            <strong>state (US)</strong>
          </td>
          <td align="center">
            <div className="vertical">
              <StatesDropdown updateState={updateState} />
            </div>
          </td>
          <td align="right">
            <strong>city</strong>
          </td>
          <td align="left">
            <input
              type="text"
              placeholder="Williamstown"
              onChange={(event) => updateCity(event.target.value)}
            />
          </td>
          <td></td>
        </tr>
        <tr>
          <td align="right">
            <strong>class year</strong>
          </td>
          <td align="left">
            <Button
              onClick={() => {
                year27Selected
                  ? setYear27Selected(false)
                  : setYear27Selected(true);
              }}
              className={year27Selected ? "button-toggled" : "button-default"}
            >
              27 / 26.5
            </Button>
          </td>
          <td align="left">
            <Button
              onClick={() => {
                year26Selected
                  ? setYear26Selected(false)
                  : setYear26Selected(true);
              }}
              className={year26Selected ? "button-toggled" : "button-default"}
            >
              26 / 25.5
            </Button>
          </td>
          <td align="left">
            <Button
              onClick={() => {
                year25Selected
                  ? setYear25Selected(false)
                  : setYear25Selected(true);
              }}
              className={year25Selected ? "button-toggled" : "button-default"}
            >
              25 / 24.5
            </Button>
          </td>
          <td align="left">
            <Button
              onClick={() => {
                year24Selected
                  ? setYear24Selected(false)
                  : setYear24Selected(true);
              }}
              className={year24Selected ? "button-toggled" : "button-default"}
            >
              24 / 23.5
            </Button>
          </td>
        </tr>
        <tr>
          <td align="right">
            <strong>type</strong>
          </td>
          <td align="left">
            <Button
              onClick={() => {
                professorSelected
                  ? setProfessorSelected(false)
                  : setProfessorSelected(true);
              }}
              className={
                professorSelected ? "button-toggled" : "button-default"
              }
            >
              professor
            </Button>
          </td>
          <td align="left">
            <Button
              onClick={() => {
                staffSelected
                  ? setStaffSelected(false)
                  : setStaffSelected(true);
              }}
              className={staffSelected ? "button-toggled" : "button-default"}
            >
              staff
            </Button>
          </td>
          <td align="left">
            <Button
              onClick={() => {
                studentSelected
                  ? setStudentSelected(false)
                  : setStudentSelected(true);
              }}
              className={studentSelected ? "button-toggled" : "button-default"}
            >
              student
            </Button>
          </td>
        </tr>
        <br />
        <tr>
          <td align="right">
            <strong>building</strong>
          </td>
          <td align="left">
            <input
              type="text"
              placeholder="Paresky"
              onChange={(event) => updateBuilding(event.target.value)}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

QueryTable.propTypes = {
  updateName: PropTypes.func,
  updateUnix: PropTypes.func,
  updateCountry: PropTypes.func,
  updateState: PropTypes.func,
  updateCity: PropTypes.func,
  year27Selected: PropTypes.bool,
  year26Selected: PropTypes.bool,
  year25Selected: PropTypes.bool,
  year24Selected: PropTypes.bool,
  setYear27Selected: PropTypes.func,
  setYear26Selected: PropTypes.func,
  setYear25Selected: PropTypes.func,
  setYear24Selected: PropTypes.func,
  professorSelected: PropTypes.bool,
  staffSelected: PropTypes.bool,
  studentSelected: PropTypes.bool,
  setProfessorSelected: PropTypes.func,
  setStaffSelected: PropTypes.func,
  setStudentSelected: PropTypes.func,
  updateBuilding: PropTypes.func,
};

export default QueryTable;
