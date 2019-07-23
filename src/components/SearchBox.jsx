// React Imports
import React from 'react';
import PropTypes from 'prop-types';

const SearchBox = ({ authToken }) => {
  return (
    <form action="/facebook" method="post">
      <input
        id="search"
        name="search"
        type="search"
        placeholder="Search Facebook"
      />
      <input
        name="commit"
        data-disable-with="Search"
        type="submit"
        value="Search"
        className="submit"
      />
      <input type="hidden" name="authenticity_token" value={authToken} />
    </form>
  );
};

SearchBox.propTypes = {
  authToken: PropTypes.string.isRequired,
};

export default SearchBox;
