// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
// import styles from "./FactrakSearch.module.scss";

// Redux/ Router imports
import { connect } from "react-redux";
import { getWSO } from "../../../selectors/auth";
import { actions, createRouteNodeSelector } from "redux-router5";

// Additional imports
import { Link } from "react-router5";
import { EuiFlexGroup, EuiFlexItem } from "@elastic/eui";
import styles from "./FactrakSearch.module.scss";

// FactrakSearch refers to the search result page
const FactrakSearch = ({ route, navigateTo, wso }) => {
  const [profs, updateProfs] = useState(null);
  const [courses, updateCourses] = useState(null);

  useEffect(() => {
    const loadProfs = async () => {
      const queryParams = {
        q: route.params.q ? route.params.q : undefined,
        preload: ["office"],
      };

      try {
        const profsResponse = await wso.factrakService.listProfessors(
          queryParams
        );

        updateProfs(profsResponse.data.sort((a, b) => a.name > b.name));
      } catch {
        navigateTo("500");
      }
    };

    const loadCourses = async () => {
      const queryParams = {
        q: route.params.q ? route.params.q : undefined,
        preload: ["areaOfStudy", "professors"],
      };

      try {
        const coursesResponse = await wso.factrakService.listCourses(
          queryParams
        );

        updateCourses(
          coursesResponse.data.sort(
            (a, b) =>
              a.areaOfStudy.abbreviation + a.number >
              b.areaOfStudy.abbreviation + b.number
          )
        );
      } catch {
        navigateTo("500");
      }
    };

    loadProfs();
    loadCourses();
  }, [navigateTo, route.params.q, wso]);

  // Generates the row for one of the professor results.
  const professorRow = (prof) => {
    // Doesn't check for existence of professor in LDAP.
    return (
      <tr key={prof.name} className={styles.tableRow}>
        <td>
          <Link
            routeName="factrak.professors"
            routeParams={{ profID: prof.id }}
          >
            {prof.name}
          </Link>
        </td>
        <td className={styles.unix}>{prof?.unixID}</td>
        <td>{prof?.office?.number}</td>
      </tr>
    );
  };

  // Generates the table of professor results.
  const professorDisplay = () => {
    if (!profs || profs.length === 0) return null;
    return (
      <EuiFlexItem className={styles.parent}>
        <EuiFlexGroup direction="column" alignItems="center">
          <EuiFlexItem>
            <br />
            <h4>Professors</h4>
          </EuiFlexItem>
          <EuiFlexItem className={styles.child}>
            <table className={styles.searchTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Unix</th>
                  <th>Office</th>
                </tr>
              </thead>
              <tbody>{profs.map((prof) => professorRow(prof))}</tbody>
            </table>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexItem>
    );
  };

  // Generate the links to the course's professors.
  const courseRowProfs = (course) => {
    if (course.professors) {
      return course.professors
        .map((prof) => (
          <Link
            key={`${course.id}?profID=${prof.id}`}
            routeName="factrak.courses.singleProf"
            routeParams={{
              courseID: course.id,
              profID: prof.id,
            }}
          >
            {prof.name}
          </Link>
        ))
        .reduce((prev, curr) => [prev, ", ", curr]);
    }

    return null;
  };

  // Generates one row of course results.
  const courseRow = (course) => {
    return (
      <tr key={course.id} className={styles.tableRow}>
        <td className={styles.course}>
          <Link
            routeName="factrak.courses"
            routeParams={{ courseID: course.id }}
          >
            {course.areaOfStudy.abbreviation} {course.number}
          </Link>
        </td>
        <td>{courseRowProfs(course)}</td>
      </tr>
    );
  };

  // Generates the table of course results.
  const courseDisplay = () => {
    if (!courses || courses.length === 0) return null;
    return (
      <EuiFlexItem className={styles.parent}>
        <EuiFlexGroup direction="column" alignItems="center">
          <EuiFlexItem>
            <br />
            <h4>Courses</h4>
          </EuiFlexItem>
          <EuiFlexItem className={styles.child}>
            <table className={styles.searchTable}>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Professors</th>
                </tr>
              </thead>
              <tbody>{courses.map((course) => courseRow(course))}</tbody>
            </table>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexItem>
    );
  };

  // Returns "No results" if there are no results for the given query.
  const noResults = () => {
    if ((!courses || courses.length === 0) && (!profs || profs.length === 0)) {
      return (
        <>
          <br />
          <h1>No matches were found.</h1>
        </>
      );
    }
    return null;
  };

  return (
    <EuiFlexGroup direction="column" alignItems="center">
      {professorDisplay()}
      {courseDisplay()}
      {noResults()}
    </EuiFlexGroup>
  );
};

FactrakSearch.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  route: PropTypes.object.isRequired,
  wso: PropTypes.object.isRequired,
};

FactrakSearch.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("factrak.search");

  return (state) => ({
    wso: getWSO(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FactrakSearch);
