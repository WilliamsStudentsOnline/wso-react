import axios from "axios";
// @TODO: think about the response.

// Lists all areas of study
const getAreasOfStudy = async (token) => {
  const response = await axios({
    url: "/api/v1/factrak/areas-of-study",
    headers: {
      Authorization: "Bearer " + token,
    },
  }).catch((error) => {
    console.log(error);
    return null;
  });

  return response;
};

// List one area of study
// @TODO Think about naming? Will this be confusing?
const getAreaOfStudy = async (token, area) => {
  const response = await axios({
    url: `/api/v1/factrak/areas-of-study/${area}`,
    headers: {
      Authorization: "Bearer " + token,
    },
  }).catch((error) => {
    console.log(error);
    return null;
  });

  return response;
};

const getDepartments = async (token) => {
  const response = await axios({
    url: "/api/v1/factrak/departments",
    headers: {
      Authorization: "Bearer " + token,
    },
  }).catch((error) => {
    console.log(error);
    return null;
  });

  console.log(response);
  return response;
};

// Lists all surveys
const getSurveys = async (token, max = -1) => {
  const response = await axios({
    url: "/api/v1/factrak/surveys",
    headers: {
      Authorization: "Bearer " + token,
    },
  }).catch((error) => {
    console.log(error);
    return null;
  });

  if (max === -1 || response.data.data.length < max) {
    return response.data.data;
  } else {
    return response.data.data.slice(0, max);
  }
};

// Gets all the professors of an area of study
const getProfsOfAOS = async (token, area) => {
  const response = await axios({
    url: `/api/v1/factrak/areas-of-study/${area}/professors`,
    headers: {
      Authorization: "Bearer " + token,
    },
  }).catch((error) => {
    console.log(error);
    return null;
  });

  console.log(response);

  return response.data.data;
};

// Gets all the courses of an area of study
const getCoursesOfAOS = async (token, area) => {
  const response = await axios({
    url: `/api/v1/factrak/areas-of-study/${area}/courses`,
    headers: {
      Authorization: "Bearer " + token,
    },
  }).catch((error) => {
    console.log(error);
    return null;
  });

  console.log(response);

  return response.data.data;
};

export {
  getAreasOfStudy,
  getDepartments,
  getSurveys,
  getProfsOfAOS,
  getCoursesOfAOS,
  getAreaOfStudy,
};
