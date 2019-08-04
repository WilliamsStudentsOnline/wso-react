// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";

// External imports
import axios from "axios";
import { Link } from "react-router5";

const FactrakLayout = ({ children }) => {
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

  //if (currentUser.factrak_policy)
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
            {/*currentUser.factrak_admin ? (
              <li>
                <a href="/factrak/moderate">Moderate</a>
              </li>
            ) : null*/}
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
  //return null;
};

FactrakLayout.propTypes = {
  children: PropTypes.object.isRequired,
};

export default FactrakLayout;
