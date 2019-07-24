// React imports
import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// Component imports
import Course from "./Course";
import "./stylesheets/Catalog.css";

// Redux (Selector, Reducer, Actions) imports
import { doLoadCourses } from "../actions/course";
import { getLoadedCourses } from "../selectors/course";

class Catalog extends React.Component {
  constructor(props) {
    super(props);

    this.onLoad = this.props.onLoad.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.onScroll, false);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll, false);
  }

  onScroll() {
    if (
      window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 2000 &&
      this.props.loaded.length
    ) {
      this.onLoad(this.props.loaded.length / 50 + 1);
    }
  }

  render() {
    return (
      <div className="catalog">
        {(this.props.loaded || []).map((course) => (
          <Course
            key={`${course.department}${course.peoplesoftNumber}`}
            course={course}
          />
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loaded: getLoadedCourses(state),
});

const mapDispatchToProps = (dispatch) => ({
  onLoad: (newLoadGroup) => dispatch(doLoadCourses(newLoadGroup)),
});

Catalog.propTypes = {
  loaded: PropTypes.arrayOf(PropTypes.object).isRequired,
  onLoad: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Catalog);
