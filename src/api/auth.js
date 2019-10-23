import axios from "axios";

// Refreshes the auth token
const refreshToken = async (token) => {
  const response = await axios({
    url: "/api/v2/auth/refresh-token",
    headers: {
      "Authorization-Token": `Bearer ${token}`,
    },
    method: "post",
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Updates the auth token with new scopes.
const updateTokenAPI = async (token) => {
  const response = await axios({
    url: "/api/v2/auth/update-token",
    headers: {
      "Authorization-Token": `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Authenticates the user and returnx the token.
const getToken = async (unixID, password) => {
  if (!unixID || !password) {
    return null;
  }
  const response = await axios({
    url: "/api/v2/auth/login",
    method: "post",
    data: {
      unixID,
      password,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Get on/off-campus tokens, do not log in
const getCampusToken = async () => {
  const response = await axios({
    url: "/api/v2/auth/login",
    method: "post",
    data: {
      unixID: "invalid",
      password: "invalid",
      useIP: true,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Helper method to check the expiry of the authToken, refreshing if necessary
const tokenExpiryHandler = async (token, expiry) => {
  try {
    const expiryDate = new Date(expiry);
    if (expiryDate) {
      const now = Date.now();

      if (expiryDate - now < 3600000) {
        const refreshResponse = await refreshToken(token);
        if (refreshResponse && !refreshResponse.data.error) return true;

        return false;
      }

      return true;
    }
  } catch (err) {
    return false;
  }
  return false;
};

export { tokenExpiryHandler, updateTokenAPI, getToken, getCampusToken };
