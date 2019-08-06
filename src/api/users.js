import axios from "axios";

// Returns all the users
const getAllUsers = async (token) => {
  const response = await axios({
    url: "/api/v1/users",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    console.log(error.response);
  });

  const users = response.data.data;
  return users;
};

// Returns current user
const getUser = async (unixID = "me", token) => {
  console.log(token);
  const response = await axios({
    url: `/api/v1/users/${unixID}`,
    headers: {
      Authorization: `Bearer ${token}`,
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
