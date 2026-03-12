// React imports
import React, { useState, useEffect } from "react";

// Redux imports
import { useAppSelector } from "../../../lib/store";
import { getCurrUser } from "../../../lib/authSlice";
import { selectGeneratedQuery } from "../../../lib/queryBuilderSlice";

// Additional imports
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { StylizedLink } from "../../StylizedLink";

// Component Imports
import QueryTable from "../../QueryTable";

const FacebookLayout = ({ children }: { children: React.ReactElement }) => {
  const currUser = useAppSelector(getCurrUser);
  const navigateTo = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchInputValue, setSearchInputValue] = useState(
    searchParams.get("q") ?? ""
  );
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
    const finalQuery = advancedFiltersSelected
      ? generatedQuery
      : searchInputValue;
    if (finalQuery.trim()) {
      searchParams.set("q", finalQuery.trim());
      navigateTo(`/facebook?${searchParams.toString()}`);
    } else {
      searchParams.delete("q");
      navigateTo(`/facebook?${searchParams.toString()}`);
    }
    setAdvancedFiltersSelected(false);
  };

  const handleAdvancedToggleClick = () => {
    setAdvancedFiltersSelected(!advancedFiltersSelected);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(event.target.value);
  };

  const FilterButton = () => {
    return (
      <button
        onClick={handleAdvancedToggleClick}
        className={
          advancedFiltersSelected ? "button-toggled" : "button-default"
        }
        style={{ marginLeft: "0px" }}
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
              <StylizedLink to="/facebook" end>
                Search
              </StylizedLink>
            </li>
            <li>
              <StylizedLink to="/facebook/help">Help</StylizedLink>
            </li>
            {currUser === null
              ? null
              : [
                  <li key="view">
                    <StylizedLink to={`/facebook/users/${currUser.id}`}>
                      View
                    </StylizedLink>
                  </li>,
                  <li key="edit">
                    <StylizedLink to="/facebook/edit"> Edit </StylizedLink>
                  </li>,
                ]}
          </ul>
        </div>
        <div>
          <form onSubmit={submitHandler}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: "10px",
              }}
            >
              <input
                aria-label="Search box for Facebook"
                type="search"
                placeholder="Search Facebook..."
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
            </div>
          </form>
        </div>
        {advancedFiltersSelected && (
          <div className="advanced-query advanced-query-facebook">
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
      {children}
    </div>
  );
};

export default FacebookLayout;
