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
import "../../stylesheets/Homepage.css";

const MOBILE_MAX = "(max-width: 48.125em)";

const FacebookLayout = ({ children }: { children: React.ReactElement }) => {
  const currUser = useAppSelector(getCurrUser);
  const navigateTo = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchInputValue, setSearchInputValue] = useState(
    searchParams.get("q") ?? ""
  );
  const [advancedFiltersSelected, setAdvancedFiltersSelected] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(MOBILE_MAX).matches
      : false
  );
  const { query: generatedQuery, warning: queryWarning } =
    useAppSelector(selectGeneratedQuery);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_MAX);
    const onChange = () => {
      const matches = media.matches;
      setIsMobile(matches);
      if (matches) setAdvancedFiltersSelected(false);
    };
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

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
              isMobile ? undefined : (
                <Button
                  variant={advancedFiltersSelected ? "toggleActive" : "toggle"}
                  onClick={() =>
                    setAdvancedFiltersSelected(!advancedFiltersSelected)
                  }
                  style={{ marginLeft: 0 }}
                >
                  Advanced
                </Button>
              )
            }
          />
        }
      >
        {!isMobile && advancedFiltersSelected && (
          <div className="advanced-query advanced-query-facebook">
            <div className="active-filters-container">
              {generatedQuery ? (
                <div className="active-filters">{generatedQuery}</div>
              ) : null}
              {queryWarning && <div className="warning">{queryWarning}</div>}
            </div>
            <QueryTable />
          </div>
        )}
      </ServiceHeader>
      {children}
    </div>
  );
};

export default FacebookLayout;
