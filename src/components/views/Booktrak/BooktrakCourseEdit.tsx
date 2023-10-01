// React imports
import React, { useState } from "react";
import { AutocompleteACEntry } from "wso-api-client/lib/services/types";
import { useAppSelector } from "../../../lib/store";
import { getWSO } from "../../../lib/authSlice";

const CourseRemove = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <button type="button" onClick={onClick} className="tag-remove">
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
  updateErrors: React.Dispatch<React.SetStateAction<string[]>>;
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

  //   // Unsure if this is the best way to implement this.
  //   const updateCourses = async (updatedCourses) => {
  //     const params = {
  //       tags: updatedTags,
  //     };

  //     try {
  //       await wso.userService.updateUserTags("me", params);
  //       updateTags(updatedTags);
  //       updateNewTag("");
  //       updateErrors([]);
  //     } catch (error) {
  //       updateErrors([error.message]);
  //     }
  //   };

  const addCourseHandler = () => {
    if (newCourse) {
      if (courses.filter((course) => course === newCourse).length) {
        updateErrors(["Unable to add the same course twice."]);
        return;
      }

      const updatedCourses = Object.assign([], courses);
      updatedCourses.push(newCourse);
      updateCourses(updatedCourses);
      updateNewCourseString("");
      updateNewCourse(undefined);
    } else {
      updateErrors([]);
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
        <table className="tag-suggestions">
          <tbody>
            {suggestions.map((suggestion) => (
              <tr key={suggestion.id}>
                <td>
                  <button
                    type="button"
                    className="autocomplete-option"
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
    <ul
      id="tag-list"
      style={{
        padding: 0,
      }}
    >
      <li className="fb-tag" style={{ display: "flex", marginLeft: 0 }}>
        <input
          className="tag-input"
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
      {courses.map((course, i) => (
        <li className="fb-tag" key={i}>
          {course.value}
          <CourseRemove onClick={() => removeCourseHandler(i)} />
        </li>
      ))}
    </ul>
  );
};

export default CourseEdit;
