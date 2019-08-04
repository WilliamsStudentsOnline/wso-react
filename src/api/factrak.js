import axios from "axios";

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

  console.log(response);
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

  if (max === -1 || response.length < max) {
    return response;
  } else {
    return response.slice(0, max);
  }
};

export { getAreasOfStudy, getDepartments, getSurveys };
