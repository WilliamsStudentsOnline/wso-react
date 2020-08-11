import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { getWSO } from "../../../selectors/auth";

import styles from "./FactrakAOS.module.scss";

import { Link } from "react-router5";
import { EuiFlexGroup, EuiFlexItem } from "@elastic/eui";

const ProfessorRow = ({ professor, wso }) => {
  const [photo, setPhoto] = useState(null);
  const [courses, setCourses] = useState(null);

  useEffect(() => {
    // Load the professor photo
    const loadPhoto = async () => {
      try {
        const profPhoto = await wso.userService.getUserLargePhoto(professor.id);
        setPhoto(URL.createObjectURL(profPhoto));
      } catch {
        // nothing
      }
    };

    // Load the list of courses the professor has taught
    const loadCourses = async () => {
      try {
        const profCourses = await wso.factrakService.listCourses({
          professorID: professor.id,
          preload: ["areaOfStudy"],
        });
        setCourses(profCourses.data);
      } catch {
        // nothing
      }
    };

    loadPhoto(professor);
    loadCourses(professor);
  }, [wso, professor]);

  return (
    <tr key={professor.id} className={styles.profRow}>
      <td>
        <EuiFlexGroup
          alignItems="center"
          direction="row"
          className={styles.professorRow}
        >
          <EuiFlexItem grow={false} className={styles.professorPhotoSmall}>
            <img src={photo} alt="avatar" />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <Link
              routeName="factrak.professors"
              routeParams={{ profID: professor.id }}
              className={styles.professorName}
            >
              {professor.name}
            </Link>
            <a href={`mailto:${professor.unixID}@williams.edu`}>
              {professor.unixID}
            </a>
          </EuiFlexItem>
        </EuiFlexGroup>
      </td>

      <td>
        {courses ? (
          courses.map((course) => {
            return (
              <Link
                routeName="factrak.courses"
                routeParams={{ courseID: course.id }}
              >
                &nbsp;{course.areaOfStudy.abbreviation}&nbsp;{course.number},
              </Link>
            );
          })
        ) : (
          <p />
        )}
      </td>
    </tr>
  );
};

ProfessorRow.propTypes = {
  professor: PropTypes.object.isRequired,
  wso: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  wso: getWSO(state),
});

export default connect(mapStateToProps)(ProfessorRow);
