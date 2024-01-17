// React imports
import React, { useState } from "react";

import { AutocompleteACEntry } from "wso-api-client/lib/services/types";
import { useAppSelector } from "../../../lib/store";
import { getWSO } from "../../../lib/authSlice";

import "../../stylesheets/Booktrak.css";

const CourseRemove = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <button type="button" onClick={onClick} className="remove-course">
      X
    </button>
  );
};

const CourseEdit = ({
  courses,
  updateCourses,
  updateErrors,
}: {
  courses: AutocompleteACEntry[];
  updateCourses: React.Dispatch<React.SetStateAction<AutocompleteACEntry[]>>;
  updateErrors?: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const wso = useAppSelector(getWSO);
  const [newCourseString, updateNewCourseString] = useState("");
  const [newCourse, updateNewCourse] = useState<
    AutocompleteACEntry | undefined
  >(undefined);
  const [suggestions, setSuggestions] = useState<AutocompleteACEntry[]>([]);

  const courseAutocomplete = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateNewCourseString(event.target.value);
    updateNewCourse(undefined);
    try {
      const courseResponse = await wso.autocompleteService.autocompleteCourse(
        event.target.value,
        5
      );
      const newSuggestions = courseResponse.data;
      setSuggestions(newSuggestions ?? []);
    } catch {
      // Do nothing - it's okay to not have autocomplete.
    }
  };

  const addCourseHandler = () => {
    if (newCourse) {
      if (courses.filter((course) => course.id === newCourse.id).length) {
        if (updateErrors)
          updateErrors(["Unable to add the same course twice."]);
        return;
      }

      const updatedCourses = Object.assign([], courses);
      updatedCourses.push(newCourse);
      updateCourses(updatedCourses);
      updateNewCourseString("");
      updateNewCourse(undefined);
    } else {
      if (updateErrors) updateErrors([]);
    }
  };

  const removeCourseHandler = (index: number) => {
    const updatedCourses = Object.assign([], courses);
    updatedCourses.splice(index, 1);
    updateCourses(updatedCourses);
  };

  const courseSuggestions = () => {
    if (suggestions && suggestions.length > 0) {
      return (
        <table className="course-suggestions">
          <tbody>
            {suggestions.map((suggestion) => (
              <tr key={suggestion.id}>
                <td>
                  <button
                    type="button"
                    className="course-suggestion-option"
                    onClick={() => {
                      setSuggestions([]);
                      updateNewCourseString(suggestion.value ?? "");
                      updateNewCourse(suggestion);
                    }}
                  >
                    {suggestion.value}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    return null;
  };

  return (
    <ul className="course-edit-container">
      <div className="course-edit-search-container">
        <li className="input-container">
          <input
            className="input"
            type="text"
            onChange={courseAutocomplete}
            placeholder="New Course"
            maxLength={255}
            size={20}
            value={newCourseString}
          />
          <CourseRemove onClick={() => updateNewCourseString("")} />
          {courseSuggestions()}
        </li>
        <button
          type="button"
          onClick={addCourseHandler}
          disabled={newCourse === undefined}
        >
          Add Course
        </button>
      </div>
      <div className="course-container">
        {courses.map((course, i) => (
          <li className="course" key={i}>
            {course.value}
            <CourseRemove onClick={() => removeCourseHandler(i)} />
          </li>
        ))}
      </div>
    </ul>
  );
};

export default CourseEdit;
