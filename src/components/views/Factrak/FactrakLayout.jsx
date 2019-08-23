// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getCurrUser, getToken } from "../../../selectors/auth";
import { actions } from "redux-router5";

// External imports
import { Link } from "react-router5";
import {
  autocompleteProfs,
  autocompleteCourses,
} from "../../../api/autocomplete";
import { checkAndHandleError } from "../../../lib/general";

const FactrakLayout = ({ children, currUser, navigateTo, token }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  /**
   * Initiates new autocomplete
   */
  const factrakAutocomplete = (event) => {
    setQuery(event.target.value);
    const profsResponse = autocompleteProfs(token, query);
    const coursesResponse = autocompleteCourses(token, query);
    const suggestData = [];
    if (checkAndHandleError(profsResponse)) {
      suggestData.push(profsResponse.data.data);
    }

    if (checkAndHandleError(coursesResponse)) {
      suggestData.push(coursesResponse.data.data);
    }

    setSuggestions(suggestData.slice(0, 5));
  };

  const submitHandler = (event) => {
    event.preventDefault();

    navigateTo("factrak.search", { q: query }, { reload: true });
  };

  const factrakSuggestions = () => {
    return (
      <div className="autocomplete">
        <table id="suggestions">
          <tbody>
            {suggestions.map((suggestion) => (
              <tr key={suggestion.id}>
                <td>
                  <Link
                    routeName={
                      suggestion.name ? "factrak.professors" : "factrak.courses"
                    }
                    routeParams={
                      suggestion.name
                        ? { profID: suggestion.id }
                        : { courseID: suggestion.id }
                    }
                  >
                    {suggestion.name ? suggestion.name : suggestion.title}
                  </Link>
                </td>
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
              {currUser.factrakAdmin ? (
                <li>
                  <Link routeName="factrak.moderate">Moderate</Link>
                </li>
              ) : null}
            </ul>
          </div>
          <form onSubmit={submitHandler}>
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
};

FactrakLayout.defaultProps = {};

const mapStateToProps = (state) => ({
  currUser: getCurrUser(state),
  token: getToken(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FactrakLayout);
