import axios from "axios";

// Lists all areas of study (note plural)
const getAreasOfStudy = async (token) => {
  const response = await axios({
    url: "/api/v1/factrak/areas-of-study",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    console.log(error.response);
    return null;
  });

  const areasOfStudy = response.data.data;

  return areasOfStudy;
};

// List one area of study (note singular)
const getAreaOfStudy = async (token, area) => {
  const response = await axios({
    url: `/api/v1/factrak/areas-of-study/${area}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    console.log(error.response);
    return null;
  });

  const areaOfStudy = response.data.data;

  return areaOfStudy;
};

// List all the departments
const getDepartments = async (token) => {
  const response = await axios({
    url: "/api/v1/factrak/departments",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    console.log(error.response);
    return null;
  });

  const departments = response.data.data;

  return departments;
};

// Lists all surveys
const getSurveys = async (token, max = -1) => {
  const response = await axios({
    url: "/api/v1/factrak/surveys",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    console.log(error.response);
    return null;
  });

  const surveys = response.data.data;

  if (max === -1 || surveys.length < max) {
    return surveys;
  }

  return surveys.slice(0, max);
};

// Gets all the professors of an area of study
const getProfsOfAOS = async (token, area) => {
  const response = await axios({
    url: `/api/v1/factrak/areas-of-study/${area}/professors`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    console.log(error.response);
    return null;
  });

  const profsOfAOS = response.data.data;

  return profsOfAOS;
};

// Gets all the courses of an area of study
const getCoursesOfAOS = async (token, area) => {
  const response = await axios({
    url: `/api/v1/factrak/areas-of-study/${area}/courses`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    console.log(error.response);
    return null;
  });

  const coursesOfAOS = response.data.data;

  return coursesOfAOS;
};

// Lists all flagged surveys
const getFlagged = async (token) => {
  const response = await axios({
    url: `/api/v1/factrak/admin/surveys`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    console.log(error.response);
    return null;
  });

  console.log(response);
  const flaggedSurveys = response.data.data;

  return flaggedSurveys;
};

// Unflag survey
const unflagSurvey = async (token, surveyID) => {
  const response = await axios({
    url: `/api/v1/factrak/admin/surveys/${surveyID}/flag`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "delete",
  }).catch((error) => {
    console.log(error.response);
    return null;
  });
  return response;
};

// Delete survey
const deleteSurvey = async (token, surveyID) => {
  const response = await axios({
    url: `/api/v1/factrak/surveys/${surveyID}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "delete",
  }).catch((error) => {
    console.log(error.response);
    return null;
  });
  return response;
};

// Get User's surveys
const getUserSurveys = async (token, userID) => {
  const response = await axios({
    url: `/api/v1/factrak/users/${userID}/surveys`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    console.log(error.response);
    return null;
  });

  console.log(response);
  const userSurveys = response.data.data;

  return userSurveys;
};

// Update Factrak Policy acceptance
// const updateFactrakPolicyAcceptance = async (token, userID) => {
//   // @TODO
// };

// Get Factrak course
const getCourse = async (token, courseID) => {
  const response = await axios({
    url: `/api/v1/factrak/courses/${courseID}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    console.log(error.response);
    return null;
  });

  console.log(response);
  const factrakCourse = response.data.data;

  return factrakCourse;
};

// Get surveys belonging to a factrak course.
const getCourseSurveys = async (token, courseID) => {
  const response = await axios({
    url: `/api/v1/factrak/courses/${courseID}/surveys`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    console.log(error.response);
    return null;
  });

  const courseSurveys = response.data.data;

  return courseSurveys;
};

// Gets the list of professors who teach a particular course
const getCourseProfs = async (token, courseID) => {
  const response = await axios({
    url: `/api/v1/factrak/courses/${courseID}/professors`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    console.log(error.response);
    return null;
  });

  const courseProfs = response.data.data;

  return courseProfs;
};

// Gets the survey agreement statistics
const getSurveyAgreements = async (token, surveyID) => {
  const response = await axios({
    url: `/api/v1/factrak/surveys/${surveyID}/agreement`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    console.log(error.response);
    return null;
  });

  if (response === null) return null;
  const surveyAgreements = response.data.data;

  return surveyAgreements;
};

// Creates survey agreement
const postSurveyAgreement = async (token, surveyID, createParams) => {
  const response = await axios({
    url: `/api/v1/factrak/surveys/${surveyID}/agreement`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: createParams,
    method: "post",
  }).catch((error) => {
    console.log(error.response);
    return null;
  });

  return response;
};

// Update survey agreement
const patchSurveyAgreement = async (token, surveyID, updateParams) => {
  const response = await axios({
    url: `/api/v1/factrak/surveys/${surveyID}/agreement`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: updateParams,
    method: "patch",
  }).catch((error) => {
    console.log(error.response);
    return null;
  });

  return response;
};

// Flag Survey
const flagSurvey = async (token, surveyID) => {
  const response = await axios({
    url: `/api/v1/factrak/surveys/${surveyID}/flag`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "post",
  }).catch((error) => {
    console.log(error.response);
    return null;
  });

  return response;
};

// Get Professor by Professor ID
const getProfessor = async (token, professorID) => {
  const response = await axios({
    url: `/api/v1/factrak/professors/${professorID}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    console.log(error.response);
    return null;
  });

  const professor = response.data.data;

  return professor;
};

// Get Survey
const getSurvey = async (token, surveyID) => {
  const response = await axios({
    url: `/api/v1/factrak/surveys/${surveyID}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    console.log(error.response);
    return null;
  });

  const survey = response.data.data;

  return survey;
};

// Get Department
const getDepartment = async (token, departmentID) => {
  const response = await axios({
    url: `/api/v1/factrak/departments/${departmentID}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    console.log(error.response);
    return null;
  });

  const department = response.data.data;

  return department;
};

// Get Professor Ratings. @TODO Takes in an optional course Id
const getProfessorRatings = async (token, professorID) => {
  const response = await axios({
    url: `/api/v1/factrak/professors/${professorID}/ratings`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    console.log(error.response);
    return null;
  });

  const ratings = response.data.data;

  return ratings;
};

// Get Professor Surveys. @TODO Takes in an optional course Id
const getProfessorSurveys = async (token, professorID) => {
  const response = await axios({
    url: `/api/v1/factrak/professors/${professorID}/surveys`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    console.log(error.response);
    return null;
  });

  const surveys = response.data.data;

  return surveys;
};

// Create New Survey
const postSurvey = async (token, createParams) => {
  const response = await axios({
    url: `/api/v1/factrak/surveys`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "post",
    data: createParams,
  }).catch((error) => {
    console.log(error.response);
    return null;
  });

  const survey = response.data.data;

  return survey;
};

export {
  getAreasOfStudy,
  getDepartments,
  getSurveys,
  getSurvey,
  getProfsOfAOS,
  getCoursesOfAOS,
  getAreaOfStudy,
  getFlagged,
  getUserSurveys,
  getCourse,
  getCourseSurveys,
  getCourseProfs,
  getSurveyAgreements,
  postSurveyAgreement,
  patchSurveyAgreement,
  unflagSurvey,
  flagSurvey,
  deleteSurvey,
  getProfessor,
  getDepartment,
  getProfessorRatings,
  getProfessorSurveys,
  postSurvey,
};
