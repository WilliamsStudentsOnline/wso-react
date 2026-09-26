// React imports
import React, { useState, useEffect } from "react";

// Redux imports
import { useAppSelector } from "../../../lib/store";
import { getCurrUser } from "../../../lib/authSlice";
import { selectGeneratedQuery } from "../../../lib/queryBuilderSlice";

// Additional imports
import { useSearchParams, useNavigate } from "react-router-dom";
import { ServiceHeader, SearchBar, Button, ServiceTab } from "../../ui";

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

  const submitHandler = (event: React.FormEvent) => {
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

  const tabs: ServiceTab[] = [
    { to: "/facebook", label: "Search", end: true },
    { to: "/facebook/help", label: "Help" },
    ...(currUser
      ? [
          { to: `/facebook/users/${currUser.id}`, label: "View" },
          { to: "/facebook/edit", label: "Edit" },
        ]
      : []),
  ];

  return (
    <div className="facebook">
      <ServiceHeader
        title="Facebook"
        titleTo="/facebook"
        tabs={tabs}
        search={
          <SearchBar
            value={searchInputValue}
            onChange={setSearchInputValue}
            onSubmit={submitHandler}
            placeholder="Search Facebook..."
            id="facebook-search"
            actions={
              <Button
                variant={advancedFiltersSelected ? "toggleActive" : "toggle"}
                onClick={() =>
                  setAdvancedFiltersSelected(!advancedFiltersSelected)
                }
                style={{ marginLeft: 0 }}
              >
                Advanced
              </Button>
            }
          />
        }
      >
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
      </ServiceHeader>
      {children}
    </div>
  );
};

export default FacebookLayout;
