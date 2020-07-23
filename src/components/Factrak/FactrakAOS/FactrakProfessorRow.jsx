import React, {useState, useEffect } from "react";

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
    const loadPhoto = async (professor) => {
      try {
        const profPhoto = await wso.userService.getUserLargePhoto(professor.id);
        setPhoto(URL.createObjectURL(profPhoto));
      }
      catch {
        console.log("failed to load photo");
      }
    };

    // Load the list of courses the professor has taught
    const loadCourses = async (professor) => {
      try {
        const profCourses = await wso.factrakService.listSurveys({professorID: professor.id});
        setCourses(profCourses);
      }
      catch {
        // console.log("failed to load courses");
      }
    };

   loadPhoto(professor);
   loadCourses(professor);
 }, [wso]);

  return (
    <tr key={professor.id} className={styles.profRow}>
      <td>
        <EuiFlexGroup alignItems="center">
          <EuiFlexItem grow={false} className={styles.professorPhotoSmall}>
            <img src={photo} alt="avatar" />
          </EuiFlexItem>
          <EuiFlexItem>
            <Link
              routeName="factrak.professors"
              routeParams={{ profID: professor.id }}
              className={styles.professorName}
            >
              {professor.name}
            </Link>
            <a href={`mailto:${professor.unixID}@williams.edu`}>{professor.unixID}</a>
          </EuiFlexItem>
        </EuiFlexGroup>
      </td>

      <td>
        {courses? courses.map((course) => {
          return (
            <p>{course}</p>
          );
        })
        :
          <p>
            No courses available
          </p>
        }
      </td>
    </tr>
  );
};

const mapStateToProps = (state) => ({
    wso: getWSO(state),
});

export default connect(mapStateToProps)(ProfessorRow);
