// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getCurrUser } from "../../../selectors/auth";
import { actions } from "redux-router5";

// External imports
import axios from "axios";
import { Link } from "react-router5";

const FactrakLayout = ({ children, currUser, navigateTo }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  /**
   * Initiates new autocomplete
   */
  const factrakAutocomplete = (event) => {
    // Call factrak#autocomplete using what is in the search field
    setQuery(event.target.value);
    axios({
      url: "/factrak/autocomplete.json",
      params: { q: escape(event.target.value) },
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    }).then((response) => {
      return setSuggestions(response.data);
    });
  };

  const factrakSuggestions = () => {
    return (
      <div className="autocomplete">
        <table id="suggestions">
          <tbody>
            {suggestions.map((suggestion) => (
              <tr key={suggestion.id}>
                <td>
                  <a
                    href={
                      suggestion.name
                        ? `/factrak/professors/${suggestion.id}`
                        : `/factrak/courses/${suggestion.id}`
                    }
                  >
                    {suggestion.name ? suggestion.name : suggestion.title}
                  </a>
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
          <form acceptCharset="UTF-8" method="post">
            <input
              type="search"
              name="search"
              id="search"
              placeholder="Search for a professor or course"
              onChange={factrakAutocomplete}
              style={{ marginBottom: "0px" }}
              autoComplete="off"
              value={query}
            />
            <input
              type="submit"
              name="commit"
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

  navigateTo("home");
  return null;
};

FactrakLayout.propTypes = {
  children: PropTypes.object.isRequired,
  currUser: PropTypes.object,
  navigateTo: PropTypes.func.isRequired,
};

FactrakLayout.defaultProps = {
  currUser: {},
};

const mapStateToProps = (state) => ({
  currUser: getCurrUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location) => dispatch(actions.navigateTo(location)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FactrakLayout);
