// React imports
import React, { Children, useState } from "react";
import QueryManager from "./QueryManager";
import QueryTable from "./QueryTable";

// Component imports
import "./stylesheets/Homepage.css";
import BulletinBox from "./views/BulletinsDiscussions/BulletinBox";

// Redux Imports
import { useNavigate } from "react-router-dom";
import { PostType } from "../lib/types";

const Homepage = () => {
  const navigateTo = useNavigate();
  const [search, updateSearch] = useState("");
  const [query, updateQuery] = useState("");
  const [advancedFiltersSelected, setAdvancedFiltersSelected] = useState(false);

  const submitHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (advancedFiltersSelected) navigateTo(`/facebook?q=${query}`);
    else navigateTo(`/facebook?q=${search}`);
  };
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

  const handleClick = () => {
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
    <div className="home">
      <div className="full-width">
        <div id="join-header">
          {/* <a href="https://forms.gle/7EcorfSMSuLQw5XW8">Join WSO today!</a> */}
          <a href="https://wso.williams.edu/bulletins/announcement/6021">
            Click to read updates on recent WSO bugs and activities!
          </a>
        </div>
        <header>
          <div className="logo">
            <h2 className="text-center" id="logotype">
              WSO
            </h2>
            <h4 className="text-center" id="tagline">
              By Students, For Students!
            </h4>
          </div>
          <br />
          <div className="search-bar">
            <form onSubmit={submitHandler}>
              <input
                aria-label="Search box for Facebook"
                type="search"
                placeholder="Search Facebook"
                onChange={(event) => updateSearch(event.target.value)}
              />
              <input
                data-disable-with="Search"
                type="submit"
                value="Search"
                className="submit"
              />
            </form>
            <div>
              <FilterButton />
            </div>
          </div>
          <div
            className={advancedFiltersSelected ? "advanced-query" : "invisible"}
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
        <article>
          <section>
            <div className="bulletin-list">
              {Object.values(PostType).map((type) => (
                <BulletinBox type={type} key={type} />
              ))}
            </div>
          </section>
        </article>
      </div>
    </div>
  );
};

export default Homepage;
