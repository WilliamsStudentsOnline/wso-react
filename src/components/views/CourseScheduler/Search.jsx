// React imports
import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// Component imports
import "../../stylesheets/Search.css";

// Redux (Selector, Reducer, Actions) imports
import {
  doSearchCourse,
  doResetLoad,
  doLoadCourses,
} from "../../../actions/course";
import {
  getSearchedCourses,
  getLoadedCourses,
  getQuery,
} from "../../../selectors/course";

class Search extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    const { onSearch, resetLoad } = this.props;
    const { value } = event.target;
    onSearch(value);
    resetLoad();
  }

  render() {
    return (
      <form onSubmit={this.onSubmit} className="search">
        <i className="material-icons md-36">search</i>
        <input
          id="course-search"
          type="text"
          placeholder="Search by course title, code, or instructors!"
          value={this.props.query}
          onChange={this.onChange}
        />
      </form>
    );
  }
}

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
  onLoad: (courses) => dispatch(doLoadCourses(courses)),
  resetLoad: () => dispatch(doResetLoad()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
