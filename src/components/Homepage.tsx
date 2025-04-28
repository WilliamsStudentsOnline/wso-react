// React imports
import React, { useState, useEffect } from "react";

// Component imports
import QueryTable from "./QueryTable";
import "./stylesheets/Homepage.css";
import BulletinBox from "./views/BulletinsDiscussions/BulletinBox";

// Redux Imports
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../lib/store";
import { selectGeneratedQuery } from "../lib/queryBuilderSlice";
import { PostType } from "../lib/types";

const Homepage = () => {
  const navigateTo = useNavigate();
  const [searchInputValue, setSearchInputValue] = useState("");
  const [advancedFiltersSelected, setAdvancedFiltersSelected] = useState(false);

  const { query: generatedQuery, warning: queryWarning } =
    useAppSelector(selectGeneratedQuery);

  useEffect(() => {
    if (advancedFiltersSelected) {
      setSearchInputValue(generatedQuery);
    }
  }, [advancedFiltersSelected, generatedQuery]);

  const submitHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    // use the generated query if advanced filters are active, otherwise use the input value
    const finalQuery = advancedFiltersSelected
      ? generatedQuery
      : searchInputValue;
    // navigate only if there's a query to prevent empty searches
    if (finalQuery.trim()) {
      navigateTo(`/facebook?q=${encodeURIComponent(finalQuery.trim())}`);
    }
    setAdvancedFiltersSelected(false);
  };

  const handleAdvancedToggleClick = () => {
    setAdvancedFiltersSelected(!advancedFiltersSelected);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSearchInputValue(newValue);
  };

  const FilterButton = () => {
    return (
      <button
        onClick={handleAdvancedToggleClick}
        className={`${
          advancedFiltersSelected ? "button-toggled" : "button-default"
        }`}
        style={{ marginLeft: "20px" }}
      >
        Advanced
      </button>
    );
  };

  return (
    <div className="home">
      <div className="full-width">
        <div id="join-header">
          <a href="https://wso.williams.edu/bulletins/announcement/8387">
            4/13 PATCH NOTES
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
                value={searchInputValue}
                onChange={handleInputChange}
              />
              <input
                data-disable-with="Search"
                type="submit"
                value="Search"
                className="submit"
              />
              <div
                style={{
                  marginLeft: "30px",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <FilterButton />
              </div>
            </form>
          </div>
          {advancedFiltersSelected && (
            <div className="advanced-query">
              <br />
              <div className="active-filters-container">
                {generatedQuery ? (
                  <div className="active-filters">{generatedQuery}</div>
                ) : (
                  <div className="active-filters">
                    <span id="italic">empty query - add filters below</span>
                  </div>
                )}
                {queryWarning && <div className="warning">{queryWarning}</div>}
              </div>
              <br />
              <QueryTable />
            </div>
          )}
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
