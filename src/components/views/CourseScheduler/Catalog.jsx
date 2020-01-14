// React imports
import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// Component imports
import Course from "./Course";
import "../../stylesheets/Catalog.css";

// Redux (Selector, Reducer, Actions) imports
import { doLoadCourses } from "../../../actions/course";
import { getLoadedCourses } from "../../../selectors/course";

const Catalog = ({ onLoad, loaded }) => {
  const onScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 2000 &&
      loaded.length
    ) {
      onLoad(loaded.length / 50 + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll, false);
    return () => {
      window.removeEventListener("scroll", onScroll, false);
    };
  }, []);

  return (
    <div className="catalog">
      {loaded.map((course) => (
        <Course
          key={`${course.department}${course.peoplesoftNumber}`}
          course={course}
        />
      ))}
    </div>
  );
};

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

export default connect(mapStateToProps, mapDispatchToProps)(Catalog);
