// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getCurrUser, getToken } from "../../../selectors/auth";
import { actions, createRouteNodeSelector } from "redux-router5";

// External imports
import { Link } from "react-router5";
import {
  autocompleteProfs,
  autocompleteCourses,
} from "../../../api/autocomplete";
import { checkAndHandleError } from "../../../lib/general";

const FactrakLayout = ({ children, currUser, navigateTo, token, route }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const loadQuery = () => {
      if (route.params.q) setQuery(route.params.q);
      else setQuery("");
    };
    loadQuery();
  }, [route.params.q]);

  /**
   * Initiates new autocomplete
   */
  const factrakAutocomplete = async (event) => {
    setQuery(event.target.value);
    const profsResponse = await autocompleteProfs(token, query);
    const coursesResponse = await autocompleteCourses(token, query);
    let suggestData = [];
    if (checkAndHandleError(profsResponse)) {
      suggestData = suggestData.concat(profsResponse.data.data);
    }

    if (checkAndHandleError(coursesResponse)) {
      suggestData = suggestData.concat(coursesResponse.data.data);
    }

    if (suggestData.length > 5) {
      setSuggestions(suggestData.slice(0, 5));
    } else {
      setSuggestions(suggestData);
    }
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

  const factrakSuggestions = () => {
    return (
      <div className="autocomplete">
        <table id="suggestions">
          <tbody>
            {suggestions !== [] && showSuggestions
              ? suggestions.map((suggestion) => (
                  <tr key={suggestion.id}>
                    <td>
                      <Link
                        routeName="factrak.search"
                        routeParams={{ q: suggestion }}
                        routeOptions={{ reload: true }}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {suggestion}
                      </Link>
                    </td>
                  </tr>
                ))
              : null}
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
              {currUser.factrakAdmin ? (
                <li>
                  <Link routeName="factrak.moderate">Moderate</Link>
                </li>
              ) : null}
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
  currUser: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  route: PropTypes.object.isRequired,
};

FactrakLayout.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("factrak.search");

  return (state) => ({
    currUser: getCurrUser(state),
    token: getToken(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FactrakLayout);
