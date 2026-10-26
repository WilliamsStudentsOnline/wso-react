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
  useEffect(() => {
    // page scroll lives on .layout-scroll, not the window
    const scrollEl = document.querySelector(".layout-scroll");
    if (!scrollEl) return undefined;

    const onScroll = () => {
      const nearBottom =
        scrollEl.scrollTop + scrollEl.clientHeight >=
        scrollEl.scrollHeight - 2000;
      // a short final page means the catalog is fully loaded
      const pageFull = loaded.length > 0 && loaded.length % 50 === 0;
      if (nearBottom && pageFull) {
        onLoad(loaded.length / 50 + 1);
      }
    };

    onScroll();
    scrollEl.addEventListener("scroll", onScroll, false);
    return () => {
      scrollEl.removeEventListener("scroll", onScroll, false);
    };
  }, [onLoad, loaded]);

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
