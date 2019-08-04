import axios from "axios";

const getAreasOfStudy = async (token) => {
  const response = await axios({
    url: "/api/v1/factrak/areas-of-study",
    headers: {
      Authorization: "Bearer " + token,
    },
  }).catch((error) => {
    console.log(error);
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
  });

  console.log(response);
  return response;
};

export { getAreasOfStudy, getDepartments };
