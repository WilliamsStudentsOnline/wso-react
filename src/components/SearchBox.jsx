//@TODO: See if I can use this for factrak too.
//@TODO: Get this to work with the API.

// React Imports
import React from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getToken } from "../selectors/auth";

const SearchBox = ({ token }) => {
  return (
    <form method="post">
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
    </form>
  );
};

SearchBox.propTypes = {
  token: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  token: getToken(state),
});

export default connect(mapStateToProps)(SearchBox);
