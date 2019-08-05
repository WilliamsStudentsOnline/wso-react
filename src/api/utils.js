import axios from "axios";

// Refreshes the auth token
const refreshToken = async (token) => {
  console.log("Refreshing Token");
  const response = await axios({
    url: "/api/v1/auth/refresh-token",
    headers: {
      Authorization: "Bearer " + token,
    },
  }).catch((error) => {
    console.log(error);
    return null;
  });
  return response;
};

// Updates the auth token with new scopes.
const updateToken = async (token) => {
  console.log("Updating Token");
  const response = await axios({
    url: "/api/v1/auth/update-token",
    headers: {
      Authorization: "Bearer " + token,
    },
  }).catch((error) => {
    console.log(error);
    return null;
  });

  return response;
};

// Authenticates the user and returnx the token.
const getToken = async (unixID, password) => {
  if (!unixID || !password) {
    return null;
  }
  console.log("Obtaining Token");
  const response = await axios({
    url: "/api/v1/auth/login",
    method: "post",
    data: {
      unixID,
      password,
    },
  }).catch((error) => {
    console.log(error);
    return null;
  });
  return response;
};

// Helper method to check the expiry of the authToken, refreshing if necessary
const tokenExpiryHandler = (token, expiry) => {
  try {
    const expiryDate = Date.parse(expiry);
    if (expiryDate) {
      const now = Date.now();

      if (expiryDate - now < 1800000) return refreshToken(token);
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
};

export { tokenExpiryHandler, updateToken, getToken };
