// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Line } from "../../common/Skeleton";
import styles from "./FactrakAOS.module.scss";

// Redux/ Router imports
import { connect } from "react-redux";
import { getWSO } from "../../../selectors/auth";
import { createRouteNodeSelector, actions } from "redux-router5";

// Additional Imports
import { Link } from "react-router5";
import { EuiFlexGroup, EuiFlexItem } from "@elastic/eui";

const FactrakAOS = ({ navigateTo, route, wso }) => {
  const [courses, updateCourses] = useState(null);
  const [profs, updateProfs] = useState(null);
  const [area, updateArea] = useState({});
  const [table, updateTable] = useState(0);
  // const [userPhoto, updateUserPhoto] = useState(null);

  // Equivalent to ComponentDidMount
  useEffect(() => {
    const areaParam = route.params.area;

    // Loads professors of the Area of Study
    const loadProfs = async (areaOfStudyID) => {
      const params = { areaOfStudyID };

      try {
        const profsResponse = await wso.factrakService.listProfessors(params);
        updateProfs(profsResponse.data);
      } catch {
        navigateTo("500");
      }
    };

    // Loads courses of the Area of Study
    const loadCourses = async (areaOfStudyID) => {
      const params = { areaOfStudyID, preload: ["professors"] };

      try {
        const coursesResponse = await wso.factrakService.listCourses(params);
        const coursesData = coursesResponse.data;
        updateCourses(coursesData.sort((a, b) => a.number > b.number));
      } catch {
        navigateTo("500");
      }
    };

    // Loads additional information regarding the area of study
    const loadAOS = async (areaID) => {
      try {
        const areaOfStudyResponse = await wso.factrakService.getAreaOfStudy(
          areaID
        );

        updateArea(areaOfStudyResponse.data);
      } catch {
        navigateTo("500");
      }
    };

    loadProfs(areaParam);
    loadCourses(areaParam);
    loadAOS(areaParam);
  }, [navigateTo, route.params.area, wso]);

  // Generates a row containing the prof information.
  const generateProfRow = (prof) => {
    return (
      <tr key={prof.id} className={styles.profRow}>
        <td>
          <EuiFlexGroup alignItems="center">
            <EuiFlexItem grow={false} className={styles.professorPhotoSmall}>
              <img src="none" alt="avatar" />
            </EuiFlexItem>
            <EuiFlexItem>
              <Link
                routeName="factrak.professors"
                routeParams={{ profID: prof.id }}
                className={styles.professorName}
              >
                {prof.name}
              </Link>
              <a href={`mailto:${prof.unixID}@williams.edu`}>{prof.unixID}</a>
            </EuiFlexItem>
          </EuiFlexGroup>
        </td>

        <td>{prof.title}</td>
      </tr>
    );
  };

  // Generate a skeleton of prof information
  const profSkeleton = (key) => (
    <tr key={key}>
      <td>
        <Line width="30%" />
      </td>
      <td>
        <Line width="80%" />
      </td>
    </tr>
  );

  // Generates the component which holds the list of professors in the area of study
  const generateProfs = () => {
    // If no profs were found, return null. Should not happen for Area of Study unless it's new.
    if (profs?.length === 0) return null;
    return (
      <EuiFlexItem className={styles.mainPage} grow={false}>
        <table className={styles.professorTables}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Courses Taught</th>
            </tr>
          </thead>
          <tbody>
            {profs
              ? profs.map((prof) => generateProfRow(prof))
              : [...Array(5)].map((_, i) => profSkeleton(i))}
            <tr>
              <td />
              <td />
            </tr>
          </tbody>
        </table>
      </EuiFlexItem>
    );
  };

  // Generate a course's professors' information
  const generateCourseProfessors = (course) => {
    if (course.professors) {
      return course.professors
        .map((prof) => {
          return (
            <Link
              routeName="factrak.courses.singleProf"
              routeParams={{
                courseID: course.id,
                profID: prof.id,
              }}
              key={prof.id}
            >
              {prof.name}
            </Link>
          );
        })
        .reduce((prev, curr) => [prev, ", ", curr]);
    }

    return null;
  };

  // Generates a row containing the course information.
  const generateCourseRow = (course) => {
    return (
      <tr key={course.id} className={styles.courseRow}>
        <td>
          <Link
            routeName="factrak.courses"
            routeParams={{ courseID: course.id }}
          >
            {`${area.abbreviation} ${course.number}`}
          </Link>
        </td>
        <td>{generateCourseProfessors(course)}</td>
      </tr>
    );
  };

  // Generates a skeleton for the course
  const courseSkeleton = (key) => (
    <tr key={key}>
      <td>
        <Line width="30%" />
      </td>
      <td>
        <Line width="50%" />
      </td>
    </tr>
  );

  // Generates the component which holds the list of courses in the area of study
  const generateCourses = () => {
    // If no courses were found, return null. Should not happen for Area of Study unless it's new.
    if (courses && courses.length === 0) return null;
    return (
      <EuiFlexItem className={styles.mainPage} grow={false}>
        <table className={styles.courseTable}>
          <thead>
            <tr>
              <th>Course</th>
              <th>Professor(s)</th>
            </tr>
          </thead>
          <tbody>
            {courses
              ? courses.map((course) => generateCourseRow(course))
              : [...Array(5)].map((_, i) => courseSkeleton(i))}
            <tr>
              <td />
              <td />
            </tr>
          </tbody>
        </table>
      </EuiFlexItem>
    );
  };

  // Change Table based on selected Item
  const handleCourseClick = () => {
    updateTable(true);
  };
  const handleProfessorClick = () => {
    updateTable(false);
  };
  const generateTable = () => {
    if (table) {
      return generateCourses();
    }
    return generateProfs();
  };

  return (
    <EuiFlexGroup
      className={styles.factrakDepartments}
      direction="column"
      alignItems="center"
      gutterSize="none"
      justifyContent="flexStart"
    >
      <EuiFlexItem className={styles.departmentFlexItem} grow={false}>
        <h3>
          {area && area.name ? area.name : <Line width="30%" />} Department
        </h3>
      </EuiFlexItem>
      <EuiFlexItem className={styles.departmentFlexItem} grow={false}>
        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <h2
              onClick={handleProfessorClick}
              className={table ? "" : styles.pressed}
              role="presentation"
            >
              Professors
            </h2>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <h2
              onClick={handleCourseClick}
              className={table ? styles.pressed : ""}
              role="presentation"
            >
              Courses
            </h2>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexItem>
      {generateTable()}
    </EuiFlexGroup>
  );
};

FactrakAOS.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  route: PropTypes.object.isRequired,
  wso: PropTypes.object.isRequired,
};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("factrak.areasOfStudy");

  return (state) => ({
    wso: getWSO(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FactrakAOS);
