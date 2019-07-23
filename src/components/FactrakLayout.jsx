// React imports
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Layout from './Layout';

const FactrakLayout = ({
  currentUser,
  authToken,
  children,
  notice,
  warning,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  /**
   * Initiates new autocomplete
   */
  const factrakAutocomplete = event => {
    // Call factrak#autocomplete using what is in the search field
    setQuery(event.target.value);
    axios({
      url: '/factrak/autocomplete.json',
      params: { q: escape(event.target.value) },
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    }).then(response => {
      return setSuggestions(response.data);
    });
  };

  const factrakSuggestions = () => {
    return (
      <div className="autocomplete">
        <table id="suggestions">
          <tbody>
            {suggestions.map(suggestion => (
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

  if (currentUser.factrak_policy)
    return (
      <Layout
        bodyClass="factrak"
        notice={notice}
        warning={warning}
        currentUser={currentUser}
      >
        <header>
          <div className="page-head">
            <h1>
              <a href="/factrak">Factrak</a>
            </h1>

            <ul>
              <li>
                <a href="/factrak">Home</a>
              </li>
              <li>
                <a href="/factrak/policy">Policy</a>
              </li>
              <li>
                <a href="/factrak/surveys">Your Reviews</a>
              </li>
              {currentUser.factrak_admin ? (
                <li>
                  <a href="/factrak/moderate">Moderate</a>
                </li>
              ) : null}
            </ul>
          </div>
          <form action="/factrak/search" acceptCharset="UTF-8" method="post">
            <input name="utf8" type="hidden" value="✓" />
            <input type="hidden" name="authenticity_token" value={authToken} />
            <input
              type="search"
              name="search"
              id="search"
              placeholder="Search for a professor or course"
              onChange={factrakAutocomplete}
              style={{ marginBottom: '0px' }}
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
      </Layout>
    );
  return null;
};

FactrakLayout.propTypes = {
  currentUser: PropTypes.object,
  authToken: PropTypes.string.isRequired,
  children: PropTypes.object.isRequired,
  notice: PropTypes.string,
  warning: PropTypes.string,
};

FactrakLayout.defaultProps = {
  notice: '',
  warning: '',
  currentUser: {},
};

export default FactrakLayout;
