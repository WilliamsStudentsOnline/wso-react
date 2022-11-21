// React imports
import React, { useState, useEffect } from "react";
import { Line } from "../../Skeleton";

// Redux/ Router imports
import { useAppSelector } from "../../../lib/store";
import { getWSO } from "../../../reducers/authSlice";
import { Link, useNavigate, useParams } from "react-router-dom";

const FactrakAOS = () => {
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();
  const params = useParams();

  const [courses, updateCourses] = useState(null);
  const [profs, updateProfs] = useState(null);
  const [area, updateArea] = useState({});

  // Equivalent to ComponentDidMount
  useEffect(() => {
    const areaParam = params.area;

    // Loads professors of the Area of Study
    const loadProfs = async (areaOfStudyID) => {
      const reqParams = { areaOfStudyID };

      try {
        const profsResponse = await wso.factrakService.listProfessors(
          reqParams
        );
        updateProfs(profsResponse.data);
      } catch (error) {
        navigateTo("/error", { replace: true, state: { error } });
      }
    };

    // Loads courses of the Area of Study
    const loadCourses = async (areaOfStudyID) => {
      const reqParams = { areaOfStudyID, preload: ["professors"] };

      try {
        const coursesResponse = await wso.factrakService.listCourses(reqParams);
        const coursesData = coursesResponse.data;
        updateCourses(coursesData.sort((a, b) => a.number > b.number));
      } catch (error) {
        navigateTo("/error", { replace: true, state: { error } });
      }
    };

    // Loads additional information regarding the area of study
    const loadAOS = async (areaID) => {
      try {
        const areaOfStudyResponse = await wso.factrakService.getAreaOfStudy(
          areaID
        );

        updateArea(areaOfStudyResponse.data);
      } catch (error) {
        navigateTo("/error", { replace: true, state: { error } });
      }
    };

    loadProfs(areaParam);
    loadCourses(areaParam);
    loadAOS(areaParam);
  }, [params?.area, wso]);

  // Generates a row containing the prof information.
  const generateProfRow = (prof) => {
    return (
      <tr key={prof.id}>
        <td>
          <Link to={`/factrak/professors/${prof.id}`}>{prof.name}</Link>
        </td>

        <td>{prof.title}</td>
        <td>
          <Link to={`/facebook/users/${prof.id}`}>{prof.unixID}</Link>
        </td>
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
      <td>
        <Line width="30%" />
      </td>
    </tr>
  );

  // Generates the component which holds the list of professors in the area of study
  const generateProfs = () => {
    // If no profs were found, return null. Should not happen for Area of Study unless it's new.
    if (profs?.length === 0) return null;
    return (
      <>
        <br />
        <h4>
          {area?.name ? (
            `Professors in ${area.name}`
          ) : (
            <>
              Professors in <Line width="20%" />
            </>
          )}
        </h4>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Title</th>
              <th className="unix-column">Unix</th>
            </tr>
          </thead>
          <tbody>
            {profs
              ? profs.map((prof) => generateProfRow(prof))
              : [...Array(5)].map((_, i) => profSkeleton(i))}
          </tbody>
        </table>
      </>
    );
  };

  // Generate a course's professors' information
  const generateCourseProfessors = (course) => {
    if (course.professors) {
      return course.professors
        .map((prof) => {
          return (
            <Link to={`/factrak/courses/${course.id}/${prof.id}`} key={prof.id}>
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
      <tr key={course.id}>
        <td className="col-20">
          <Link to={`/factrak/courses/${course.id}`}>
            {`${area.abbreviation} ${course.number}`}
          </Link>
        </td>
        <td className="col-80">{generateCourseProfessors(course)}</td>
      </tr>
    );
  };

  // Generates a skeleton for the course
  const courseSkeleton = (key) => (
    <tr key={key}>
      <td className="col-20">
        <Line width="30%" />
      </td>
      <td className="col-80">
        <Line width="50%" />
      </td>
    </tr>
  );

  // Generates the component which holds the list of courses in the area of study
  const generateCourses = () => {
    // If no courses were found, return null. Should not happen for Area of Study unless it's new.
    if (courses && courses.length === 0) return null;
    return (
      <>
        <h4>Courses</h4>
        <table>
          <thead>
            <tr>
              <th className="col-20">Course</th>
              <th className="col-80">Professors</th>
            </tr>
          </thead>
          <tbody>
            {courses
              ? courses.map((course) => generateCourseRow(course))
              : [...Array(5)].map((_, i) => courseSkeleton(i))}
          </tbody>
        </table>
      </>
    );
  };

  return (
    <article className="factrak-home">
      <section className="margin-vertical-small">
        <h3>{area && area.name ? area.name : <Line width="30%" />}</h3>
        {generateProfs()}
      </section>

      <section className="margin-vertical-small">{generateCourses()}</section>
    </article>
  );
};

export default FactrakAOS;
