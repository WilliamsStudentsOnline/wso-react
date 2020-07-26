// React imports
import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// Component imports
import "../../stylesheets/Search.css";

// Redux (Selector, Reducer, Actions) imports
import { doSearchCourse, doResetLoad } from "../../../actions/course";
import {
  getSearchedCourses,
  getLoadedCourses,
  getQuery,
} from "../../../selectors/course";

const Search = ({ query, onSearch, resetLoad }) => {
  const onChange = (event) => {
    const { value } = event.target;
    onSearch(value);
    resetLoad();
  };

  return (
    <form className="search">
      <i className="material-icons md-36">search</i>
      <input
        id="course-search"
        type="text"
        placeholder="Search by course title, code, or instructors!"
        value={query}
        onChange={onChange}
      />
    </form>
  );
};

Search.propTypes = {
  onSearch: PropTypes.func.isRequired,
  resetLoad: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  catalog: getSearchedCourses(state),
  loadedCourses: getLoadedCourses(state),
  query: getQuery(state),
});

const mapDispatchToProps = (dispatch) => ({
  onSearch: (query, filters) => dispatch(doSearchCourse(query, filters)),
  resetLoad: () => dispatch(doResetLoad()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
