// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux/ Router imports
import { connect } from "react-redux";
import { getAPI, getCurrUser, getToken } from "../../../selectors/auth";
import { actions, createRouteNodeSelector } from "redux-router5";

// Additional imports
import { Link } from "react-router5";

const FactrakLayout = ({
  api,
  children,
  currUser,
  navigateTo,
  token,
  route,
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const loadQuery = () => {
      if (route.params.q) setQuery(route.params.q);
      else setQuery(""); // Needed to reset if user clears the box.
    };
    loadQuery();
    setShowSuggestions(false);
  }, [route.params.q, route.path]);

  // Initiates new autocomplete
  const factrakAutocomplete = async (event) => {
    setQuery(event.target.value);
    let suggestData = [];

    try {
      const factrakResponse = await api.autocompleteService.autocompleteFactrak(
        token,
        query
      );

      suggestData = factrakResponse.data;
    } catch {
      // eslint-disable-next-line no-empty
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

    navigateTo("factrak.search", { q: query }, { reload: true });
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
          routeName="factrak.areasOfStudy"
          routeParams={{ area: suggestion.id }}
          onMouseDown={(e) => e.preventDefault()}
          successCallback={() => setShowSuggestions(false)}
        >
          {suggestion.value}
        </Link>
      );
    }
    if (suggestion.type && suggestion.type === "course") {
      return (
        <Link
          routeName="factrak.courses"
          routeParams={{ courseID: suggestion.id }}
          onMouseDown={(e) => e.preventDefault()}
          successCallback={() => setShowSuggestions(false)}
        >
          {suggestion.value}
        </Link>
      );
    }
    if (suggestion.type && suggestion.type === "professor") {
      return (
        <Link
          routeName="factrak.professors"
          routeParams={{ profID: suggestion.id }}
          onMouseDown={(e) => e.preventDefault()}
          successCallback={() => setShowSuggestions(false)}
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
                <tr key={suggestion.value}>
                  <td>{suggestionRow(suggestion)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (currUser) {
    if (!currUser.hasAcceptedFactrakPolicy) {
      navigateTo("factrak.policy");
    }

    return (
      <>
        <header>
          <div className="page-head">
            <h1>
              <Link routeName="factrak">Factrak</Link>
            </h1>

            <ul>
              <li>
                <Link routeName="factrak">Home</Link>
              </li>
              <li>
                <Link routeName="factrak.policy">Policy</Link>
              </li>
              <li>
                <Link routeName="factrak.surveys">Your Reviews</Link>
              </li>
              {currUser.factrakAdmin && (
                <li>
                  <Link routeName="factrak.moderate">Moderate</Link>
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
  api: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
  currUser: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  route: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
};

FactrakLayout.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("");

  return (state) => ({
    api: getAPI(state),
    currUser: getCurrUser(state),
    token: getToken(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FactrakLayout);
