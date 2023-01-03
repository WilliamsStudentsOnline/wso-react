// React imports
import React, { useState, useEffect } from "react";

// Redux/ Router imports
import { useAppSelector } from "../../../lib/store";
import { getWSO } from "../../../lib/authSlice";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { ModelsCourse, ModelsUser } from "wso-api-client/lib/services/types";

// FactrakSearch refers to the search result page
const FactrakSearch = () => {
  const wso = useAppSelector(getWSO);

  const [searchParams] = useSearchParams();
  const navigateTo = useNavigate();

  const [profs, updateProfs] = useState<ModelsUser[]>([]);
  const [courses, updateCourses] = useState<ModelsCourse[]>([]);

  useEffect(() => {
    const loadProfs = async () => {
      const queryParams = {
        q: searchParams?.get("q") || undefined,
        preload: ["office"],
      };

      try {
        const profsResponse = await wso.factrakService.listProfessors(
          queryParams
        );
        const profsData = profsResponse.data;
        updateProfs(
          profsData
            ? profsData.sort((a, b) =>
                a.name && b.name ? a.name.localeCompare(b.name) : 1
              )
            : []
        );
      } catch (error) {
        navigateTo("/error", { replace: true, state: { error } });
      }
    };

    const loadCourses = async () => {
      const queryParams = {
        q: searchParams?.get("q") || undefined,
        preload: ["areaOfStudy", "professors"],
      };

      try {
        const coursesResponse = await wso.factrakService.listCourses(
          queryParams
        );
        const coursesData = coursesResponse.data;
        updateCourses(
          coursesData
            ? coursesData.sort((a, b) =>
                a.areaOfStudy?.abbreviation &&
                b.areaOfStudy?.abbreviation &&
                a.number &&
                b.number
                  ? (a.areaOfStudy.abbreviation + a.number).localeCompare(
                      b.areaOfStudy.abbreviation + b.number
                    )
                  : 1
              )
            : []
        );
      } catch (error) {
        navigateTo("/error", { replace: true, state: { error } });
      }
    };

    loadProfs();
    loadCourses();
  }, [searchParams?.get("q"), wso]);

  // Generates the row for one of the professor results.
  const professorRow = (prof: ModelsUser) => {
    // Doesn't check for existence of professor in LDAP.
    return (
      <tr key={prof.id}>
        <td>
          <Link to={`/factrak/professors/${prof.id}`}>{prof.name}</Link>
        </td>
        <td>{prof?.unixID}</td>
        <td>{prof?.office?.number}</td>
      </tr>
    );
  };

  // Generates the table of professor results.
  const professorDisplay = () => {
    if (!profs || profs.length === 0) return null;
    return (
      <section className="margin-vertical-small">
        <br />
        <h4>Professors</h4>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th className="unix-column">Unix</th>
              <th>Office</th>
            </tr>
          </thead>
          <tbody>{profs.map((prof) => professorRow(prof))}</tbody>
        </table>
      </section>
    );
  };

  // Generate the links to the course's professors.
  const courseRowProfs = (course: ModelsCourse) => {
    if (course.professors) {
      return course.professors
        .map<React.ReactNode>((prof) => (
          <Link
            key={`${course.id}?profID=${prof.id}`}
            to={`/factrak/courses/${course.id}/${prof.id}`}
          >
            {prof.name}
          </Link>
        ))
        .reduce((prev, curr) => [prev, ", ", curr]);
    }

    return null;
  };

  // Generates one row of course results.
  const courseRow = (course: ModelsCourse) => {
    return (
      <tr key={course.id}>
        <td className="col-20">
          <Link to={`/factrak/courses/${course.id}`}>
            {course.areaOfStudy?.abbreviation} {course.number}
          </Link>
        </td>
        <td className="col-80">{courseRowProfs(course)}</td>
      </tr>
    );
  };

  // Generates the table of course results.
  const courseDisplay = () => {
    if (!courses || courses.length === 0) return null;
    return (
      <section className="margin-vertical-small">
        <h4>Courses</h4>
        <table>
          <thead>
            <tr>
              <th className="col-20">Course</th>
              <th className="col-80">Professors</th>
            </tr>
          </thead>
          <tbody>{courses.map((course) => courseRow(course))}</tbody>
        </table>
      </section>
    );
  };

  // Returns "No results" if there are no results for the given query.
  const noResults = () => {
    if ((!courses || courses.length === 0) && (!profs || profs.length === 0)) {
      return (
        <>
          <br />
          <h1 className="no-matches-found">No matches were found.</h1>
        </>
      );
    }
    return null;
  };

  return (
    <article className="factrak-home">
      {professorDisplay()}
      {courseDisplay()}
      {noResults()}
    </article>
  );
};

export default FactrakSearch;
