import axios from "axios";

// Get Random WSO
const getRandomWSO = async () => {
  const response = await axios({
    url: "/api/v2/words",
    method: "get",
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// eslint-disable-next-line
export { getRandomWSO };
