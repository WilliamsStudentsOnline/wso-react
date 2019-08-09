import axios from "axios";

// Lists all areas of study (note plural)
const getAreasOfStudy = async (token) => {
  const response = await axios({
    url: "/api/v1/factrak/areas-of-study",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// List one area of study (note singular)
const getAreaOfStudy = async (token, area) => {
  const response = await axios({
    url: `/api/v1/factrak/areas-of-study/${area}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// List all the departments
const getDepartments = async (token) => {
  const response = await axios({
    url: "/api/v1/factrak/departments",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Lists all surveys
const getSurveys = async (token) => {
  const response = await axios({
    url: "/api/v1/factrak/surveys",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Gets all the professors of an area of study
const getProfsOfAOS = async (token, area) => {
  const response = await axios({
    url: `/api/v1/factrak/areas-of-study/${area}/professors`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Gets all the courses of an area of study
const getCoursesOfAOS = async (token, area) => {
  const response = await axios({
    url: `/api/v1/factrak/areas-of-study/${area}/courses`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Lists all flagged surveys
const getFlagged = async (token) => {
  const response = await axios({
    url: `/api/v1/factrak/admin/surveys`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
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
    return error.response;
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
    return error.response;
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
    return error.response;
  });

  return response;
};

// Get Factrak course
const getCourse = async (token, courseID) => {
  const response = await axios({
    url: `/api/v1/factrak/courses/${courseID}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Get surveys belonging to a factrak course.
const getCourseSurveys = async (token, courseID, professorID = -1) => {
  let request;

  try {
    const parsedID = parseInt(professorID, 10);
    if (parsedID === -1 || typeof parsedID !== "number") {
      request = {
        url: `/api/v1/factrak/courses/${courseID}/surveys`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    } else {
      request = {
        url: `/api/v1/factrak/courses/${courseID}/surveys`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { professorID: parsedID },
      };
    }

    const response = await axios(request).catch((error) => {
      return error.response;
    });

    return response;
  } catch (err) {
    return err;
  }
};

// Gets the list of professors who teach a particular course
const getCourseProfs = async (token, courseID) => {
  const response = await axios({
    url: `/api/v1/factrak/courses/${courseID}/professors`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Gets the survey agreement statistics
const getSurveyAgreements = async (token, surveyID) => {
  const response = await axios({
    url: `/api/v1/factrak/surveys/${surveyID}/agreement`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
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
    return error.response;
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
    return error.response;
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
    return error.response;
  });

  return response;
};

// Get Professor by Professor ID
const getProfessor = async (token, professorID, courseID = -1) => {
  let request;
  if (courseID === -1 || typeof courseID !== "number") {
    request = {
      url: `/api/v1/factrak/professors/${professorID}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  } else {
    request = {
      url: `/api/v1/factrak/professors/${professorID}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { courseID },
    };
  }

  const response = await axios(request).catch((error) => {
    return error.response;
  });

  return response;
};

// Get Survey
const getSurvey = async (token, surveyID) => {
  const response = await axios({
    url: `/api/v1/factrak/surveys/${surveyID}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Get Department
const getDepartment = async (token, departmentID) => {
  const response = await axios({
    url: `/api/v1/factrak/departments/${departmentID}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Get Professor Ratings.
const getProfessorRatings = async (token, professorID, courseID = -1) => {
  let request;
  if (courseID === -1 || typeof courseID !== "number") {
    request = {
      url: `/api/v1/factrak/professors/${professorID}/ratings`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  } else {
    request = {
      url: `/api/v1/factrak/professors/${professorID}/ratings`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { courseID },
    };
  }

  const response = await axios(request).catch((error) => {
    return error.response;
  });

  return response;
};

// Get Professor Surveys.
const getProfessorSurveys = async (token, professorID, courseID = -1) => {
  let request;
  if (courseID === -1 || typeof courseID !== "number") {
    request = {
      url: `/api/v1/factrak/professors/${professorID}/surveys`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  } else {
    request = {
      url: `/api/v1/factrak/professors/${professorID}/surveys`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { courseID },
    };
  }

  const response = await axios(request).catch((error) => {
    return error.response;
  });

  return response;
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
    return error.response;
  });

  return response;
};

// Updates Survey
const patchSurvey = async (token, updateParams, surveyID) => {
  const response = await axios({
    url: `/api/v1/factrak/surveys/${surveyID}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "patch",
    data: updateParams,
  }).catch((error) => {
    return error.response;
  });

  return response;
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
  patchSurvey,
};
