import axios from "axios";

// Returns all the users
const getAllUsers = () => {
  axios({
    url: "/api/v1/users",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("WSOAuthToken"),
    },
  })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};

// Returns current user
const getUser = async (unixID = "me") => {
  const response = await axios({
    url: `/api/v1/users/${unixID}`,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("WSOAuthToken"),
    },
  }).catch((error) => {
    // @TODO figure out what the best way of dealing with the error is
    console.log(error);
    return null;
  });

  console.log(response);
  return response.data.data;
};

export { getAllUsers, getUser };
