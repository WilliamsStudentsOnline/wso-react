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

export {
  getAreasOfStudy,
  getDepartments,
  getSurveys,
  getProfsOfAOS,
  getCoursesOfAOS,
  getAreaOfStudy,
  getFlagged,
  getUserSurveys,
  unflagSurvey,
  deleteSurvey,
};
