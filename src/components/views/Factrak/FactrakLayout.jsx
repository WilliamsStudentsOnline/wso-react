// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux/ Router imports
import { useAppSelector } from "../../../lib/store";
import { getWSO, getCurrUser } from "../../../lib/authSlice";
import {
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";

const FactrakLayout = ({ children }) => {
  const currUser = useAppSelector(getCurrUser);
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();

  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadQuery = () => {
      if (searchParams?.get("q")) {
        setQuery(searchParams.get("q"));
      } else {
        setQuery("");
      } // Needed to reset if user clears the box.
    };

    if (isMounted) {
      loadQuery();
      setShowSuggestions(false);
    }

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  // When navigated to new page (e.g. by following autosuggestion), hide it
  useEffect(() => {
    setShowSuggestions(false);
  }, [location.pathname]);

  // Initiates new autocomplete
  const factrakAutocomplete = async (event) => {
    setQuery(event.target.value);
    let suggestData = [];

    try {
      const factrakResponse = await wso.autocompleteService.autocompleteFactrak(
        query
      );

      suggestData = factrakResponse.data;
    } catch {
      // No need to do anything - it's alright if we don't have autocomplete.
    }

    // Limit the number of factrak suggestions to 5.
    if (suggestData.length > 5) {
      setSuggestions(suggestData.slice(0, 5));
    } else {
      setSuggestions(suggestData);
    }
    setShowSuggestions(true);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    navigateTo(`/factrak/search?q=${query}`);
  };

  const focusHandler = () => {
    setShowSuggestions(true);
  };

  const blurHandler = () => {
    setShowSuggestions(false);
  };

  const suggestionRow = (suggestion) => {
    if (suggestion.type && suggestion.type === "area") {
      return (
        <Link
          to={`/factrak/areasOfStudy/${suggestion.id}`}
          // prevent the blur event, which causes the Link to disappear
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

    // Just to handle weird cases
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

  if (currUser) {
    return (
      <>
        <header>
          <div className="page-head">
            <h1>
              <Link to="/factrak">Factrak</Link>
            </h1>

            <ul>
              <li>
                <Link to="/factrak">Home</Link>
              </li>
              <li>
                <Link to="/factrak/policy">Policy</Link>
              </li>
              <li>
                <Link to="/factrak/surveys">Your Reviews</Link>
              </li>
              <li>
                <Link to="/factrak/rankings">Rankings</Link>
              </li>
              {currUser.factrakAdmin && (
                <li>
                  <Link to="/factrak/moderate">Moderate</Link>
                </li>
              )}
            </ul>
          </div>
          <form
            onSubmit={submitHandler}
            onFocus={focusHandler}
            onBlur={blurHandler}
          >
            <input
              type="search"
              id="search"
              placeholder="Search for a professor or course"
              onChange={factrakAutocomplete}
              style={{ marginBottom: "0px" }}
              value={query}
            />
            <input
              type="submit"
              value="Search"
              className="submit"
              data-disable-with="Search"
            />
            {factrakSuggestions()}
          </form>
        </header>
        {children}
      </>
    );
  }

  // Just to handle weird cases
  return null;
};

FactrakLayout.propTypes = {
  children: PropTypes.object.isRequired,
};

export default FactrakLayout;
