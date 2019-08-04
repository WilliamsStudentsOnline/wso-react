import axios from "axios";

// Refreshes the auth token
const refreshToken = async () => {
  console.log("Refreshing Token");
  const response = await axios({
    url: "/api/v1/auth/refresh-token",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("WSOAuthToken"),
    },
  }).catch((error) => {
    console.log(error);
    return null;
  });
  return response;
};

// Updates the auth token with new scopes.
const updateToken = () => {
  console.log("Updating Token");
  axios({
    url: "/api/v1/auth/update-token",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("WSOAuthToken"),
    },
  })
    .then((response) => {
      // If authentication succeeds, get the token and store it in local storage
      localStorage.setItem("WSOAuthToken", response.data.data.token);
      localStorage.setItem("WSOAuthExpiry", response.data.data.expire);
      return response;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
};

// Authenticates the user and stores the token in WebStorage
const getToken = async (unixID = "admin", password = "doesntmatter") => {
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
  console.log(response);
  // If authentication succeeds, get the token and store it in local storage
  localStorage.setItem("WSOAuthToken", response.data.data.token);
  localStorage.setItem("WSOAuthExpiry", response.data.data.expire);
  return response;
};

// Initalize token at the start of session. Four possibilities: 1) Token does not exist -> initialize
// 2) Token exists but expired -> Initialize 3) Token has less than 1 hour remaining -> refresh,
// 4) Token has > 1h remaining -> do nothing
// @TODO: Examine if I can refactor it further.
const initializeSession = async () => {
  //Checks for presence of previous WSO auth token
  if (!localStorage.getItem("WSOAuthToken")) {
    return getToken();
  } else {
    const response = await tokenExpiryHandler();
    return response;
  }
};

// Remove the authentication token and expiry timings
const removeTokens = () => {
  if (localStorage.getItem("WSOAuthToken")) {
    localStorage.removeItem("WSOAuthToken");
  }
  if (localStorage.getItem("WSOAuthExpiry")) {
    localStorage.removeItem("WSOAuthExpiry");
  }
};

// Helper method to check the expiry of the authToken, refreshing if necessary
const tokenExpiryHandler = () => {
  const expiryDate = Date.parse(localStorage.getItem("WSOAuthExpiry"));
  console.log(expiryDate);
  if (expiryDate) {
    const now = Date.now();

    if (expiryDate - now < 0) {
      return getToken();
    } else {
      //if (expiryDate - now < 1800000) {
      return refreshToken();
    }
  } else {
    // Get a new token if for some reason the expiry date does not exist or is invalid
    return getToken();
  }
};

export {
  initializeSession,
  tokenExpiryHandler,
  updateToken,
  removeTokens,
  getToken,
};
