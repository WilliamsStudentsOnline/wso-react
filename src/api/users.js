import axios from "axios";

// Returns all the users
const getAllUsers = async () => {
  const response = await axios({
    url: "/api/v1/users",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("WSOAuthToken"),
    },
  }).catch((error) => {
    console.log(error.response);
  });

  const users = response.data.data;
  return users;
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
    console.log(error.response);
    return null;
  });

  const currUser = response.data.data;
  return currUser;
};

export { getAllUsers, getUser };
