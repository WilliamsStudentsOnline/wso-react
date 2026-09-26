// React imports
import React, { useState, useEffect, ReactElement } from "react";

// Redux/ Router imports
import { useAppSelector } from "../../../lib/store";
import { getWSO, getCurrUser } from "../../../lib/authSlice";
import {
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";

import { AutocompleteACEntry } from "wso-api-client/lib/services/types";
import { ServiceHeader, SearchBar } from "../../ui";

const FactrakLayout = ({ children }: { children: ReactElement }) => {
  const currUser = useAppSelector(getCurrUser);
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();

  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AutocompleteACEntry[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadQuery = () => {
      if (searchParams?.get("q")) {
        setQuery(searchParams.get("q") ?? "");
      } else {
        setQuery("");
      }
    };

    if (isMounted) {
      loadQuery();
      setShowSuggestions(false);
    }

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  useEffect(() => {
    setShowSuggestions(false);
  }, [location.pathname]);

  const factrakAutocomplete = async (value: string) => {
    setQuery(value);
    let suggestData: AutocompleteACEntry[] = [];

    try {
      const factrakResponse = await wso.autocompleteService.autocompleteFactrak(
        value
      );
      if (factrakResponse.data) {
        suggestData = factrakResponse.data;
      }
    } catch {
      // alright if we don't have autocomplete
    }

    if (suggestData.length > 5) {
      setSuggestions(suggestData.slice(0, 5));
    } else {
      setSuggestions(suggestData);
    }
    setShowSuggestions(true);
  };

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    navigateTo(`/factrak/serch?q=${query}`);
  };

  const suggestionRow = (suggestion: AutocompleteACEntry) => {
    if (suggestion.type && suggestion.type === "area") {
      return (
        <Link
          to={`/factrak/areasOfStudy/${suggestion.id}`}
          onMouseDown={(e) => e.preventDefault()}
        >
          {suggestion.value}
        </Link>
      );
    }
    if (suggestion.type && suggestion.type === "course") {
      return (
        <Link
          to={`/factrak/courses/${suggestion.id}`}
          onMouseDown={(e) => e.preventDefault()}
        >
          {suggestion.value}
        </Link>
      );
    }
    if (suggestion.type && suggestion.type === "professor") {
      return (
        <Link
          to={`/factrak/professors/${suggestion.id}`}
          onMouseDown={(e) => e.preventDefault()}
        >
          {suggestion.value}
        </Link>
      );
    }

    return null;
  };

  const factrakSuggestions = () => {
    return (
      <div className="autocomplete">
        <table id="suggestions">
          <tbody>
            {suggestions.length > 0 &&
              showSuggestions &&
              suggestions.map((suggestion) => (
                <tr key={`${suggestion.type}.${suggestion.id}`}>
                  <td>{suggestionRow(suggestion)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (!currUser) {
    return null;
  }

  const tabs = [
    { to: "/factrak", label: "Home", end: true },
    { to: "/factrak/policy", label: "Policy" },
    { to: "/factrak/surveys", label: "Your Reviews" },
    { to: "/factrak/professor-rankings", label: "Professor Rankings" },
    { to: "/factrak/course-rankings", label: "Course Rankings" },
    ...(currUser.factrakAdmin
      ? [{ to: "/factrak/moderate", label: "Moderate" }]
      : []),
  ];

  return (
    <>
      <ServiceHeader
        title="Factrak"
        titleTo="/factrak"
        tabs={tabs}
        search={
          <SearchBar
            value={query}
            onChange={factrakAutocomplete}
            onSubmit={submitHandler}
            placeholder="Search for a professor or course"
            inputStyle={{ marginBottom: "0px" }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setShowSuggestions(false)}
          >
            {factrakSuggestions()}
          </SearchBar>
        }
      />
      {children}
    </>
  );
};

export default FactrakLayout;
