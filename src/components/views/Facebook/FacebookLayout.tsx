// React imports
import React, { useState, useEffect } from "react";
import QueryManager from "../../QueryManager";
import QueryTable from "../../QueryTable";

// Redux imports
import { useAppSelector } from "../../../lib/store";
import { getCurrUser } from "../../../lib/authSlice";

// Additional imports
import { Link, useSearchParams, useNavigate } from "react-router-dom";

const FacebookLayout = ({ children }: { children: React.ReactElement }) => {
  const currUser = useAppSelector(getCurrUser);
  const navigateTo = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, updateSearch] = useState("");
  const [query, updateQuery] = useState("");
  const [filtersClickedOff, setFiltersClickedOff] = useState(false);

  const [advancedFiltersSelected, setAdvancedFiltersSelected] = useState(false);
  const [name, updateName] = useState("");
  const [unix, updateUnix] = useState("");
  const [country, updateCountry] = useState("");
  const [state, updateState] = useState("");
  const [city, updateCity] = useState("");
  const [year27Selected, setYear27Selected] = useState(false);
  const [year26Selected, setYear26Selected] = useState(false);
  const [year25Selected, setYear25Selected] = useState(false);
  const [year24Selected, setYear24Selected] = useState(false);
  const [professorSelected, setProfessorSelected] = useState(false);
  const [staffSelected, setStaffSelected] = useState(false);
  const [studentSelected, setStudentSelected] = useState(false);
  const [building, updateBuilding] = useState("");

  useEffect(() => {
    if (searchParams?.get("q")) {
      updateQuery(searchParams.get("q") ?? "");
    } else {
      updateQuery("");
    }
  }, [searchParams]);

  // Handles submissions
  const submitHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (advancedFiltersSelected) searchParams.set("q", query);
    else searchParams.set("q", search);
    navigateTo(`/facebook?${searchParams.toString()}`);
    setAdvancedFiltersSelected(false);
  };

  const handleClick = () => {
    setFiltersClickedOff(advancedFiltersSelected);
    setAdvancedFiltersSelected(!advancedFiltersSelected);
  };

  const FilterButton = () => {
    return (
      <button
        onClick={handleClick}
        className={
          advancedFiltersSelected ? "button-toggled" : "button-default"
        }
      >
        Advanced
      </button>
    );
  };

  return (
    <div className="facebook">
      <header>
        <div className="page-head">
          <h1>
            <Link to="/facebook">Facebook</Link>
          </h1>
          <ul>
            <li>
              <Link to="/facebook">Search</Link>
            </li>
            <li>
              <Link to="/facebook/help">Help</Link>
            </li>
            {currUser === null
              ? null
              : [
                  <li key="view">
                    <Link to={`/facebook/users/${currUser.id}`}>View</Link>
                  </li>,
                  <li key="edit">
                    <Link to="/facebook/edit"> Edit </Link>
                  </li>,
                ]}
          </ul>
        </div>
        <div>
          <form onSubmit={submitHandler}>
            <div
              style={{
                display: "flex",
                alignContent: "space-between",
                alignItems: "center",
              }}
            >
              <input
                style={{ marginTop: "12px" }}
                aria-label="Search box for Facebook"
                type="search"
                placeholder="Search Facebook"
                onClick={(event) => {
                  if (
                    name !== "" ||
                    unix !== "" ||
                    country !== "" ||
                    state !== "" ||
                    city !== "" ||
                    year27Selected ||
                    year26Selected ||
                    year25Selected ||
                    year24Selected ||
                    professorSelected ||
                    staffSelected ||
                    studentSelected ||
                    building !== ""
                  ) {
                    if (!filtersClickedOff) setAdvancedFiltersSelected(true);
                  }
                }}
                onChange={(event) => {
                  updateSearch(event.target.value);
                }}
              />
              <input
                data-disable-with="Search"
                type="submit"
                value="Search"
                className="submit"
              />
              <div style={{ marginLeft: "20px" }}>
                <FilterButton />
              </div>
            </div>
          </form>
        </div>
        <div
          className={
            advancedFiltersSelected ? "advanced-query-facebook" : "invisible"
          }
        >
          <br />
          <QueryManager
            search={search}
            name={name}
            unix={unix}
            country={country}
            state={state}
            city={city}
            year27Selected={year27Selected}
            year26Selected={year26Selected}
            year25Selected={year25Selected}
            year24Selected={year24Selected}
            professorSelected={professorSelected}
            staffSelected={staffSelected}
            studentSelected={studentSelected}
            building={building}
            advancedFiltersSelected={advancedFiltersSelected}
            updateQuery={updateQuery}
          />
          <QueryTable
            updateName={updateName}
            updateUnix={updateUnix}
            updateCountry={updateCountry}
            updateState={updateState}
            updateCity={updateCity}
            year27Selected={year27Selected}
            year26Selected={year26Selected}
            year25Selected={year25Selected}
            year24Selected={year24Selected}
            setYear27Selected={setYear27Selected}
            setYear26Selected={setYear26Selected}
            setYear25Selected={setYear25Selected}
            setYear24Selected={setYear24Selected}
            professorSelected={professorSelected}
            staffSelected={staffSelected}
            studentSelected={studentSelected}
            setProfessorSelected={setProfessorSelected}
            setStaffSelected={setStaffSelected}
            setStudentSelected={setStudentSelected}
            updateBuilding={updateBuilding}
          />
        </div>
      </header>
      {children}
    </div>
  );
};

export default FacebookLayout;
