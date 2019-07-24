import axios from "axios";

// Refreshes the auth token
const refreshToken = () => {
  axios({
    url: "/api/v1/auth/refresh-token",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("WSOAuthToken"),
    },
  })
    .then((response) => {
      // If authentication succeeds, get the token and store it in local storage
      localStorage.setItem("WSOAuthToken", response.data.token);
      localStorage.setItem("WSOAuthExpiry", response.data.expire);
    })
    .catch((error) => {
      console.log(error);
    });
};

// Authenticates the user and stores the token in WebStorage
const getToken = (unixID = "admin", password = "doesntmatter") => {
  axios({
    url: "/api/v1/auth/login",
    method: "post",
    data: {
      unixID,
      password,
    },
  })
    .then((response) => {
      // If authentication succeeds, get the token and store it in local storage
      localStorage.setItem("WSOAuthToken", response.data.token);
      localStorage.setItem("WSOAuthExpiry", response.data.expire);
    })
    .catch((error) => {
      console.log(error);
    });
};

// Initializes the Token at the start of every session, refreshing or obtaining a new one where
// necessary
const initializeToken = () => {
  // Checks for presence of previous WSO auth token
  if (!localStorage.getItem("WSOAuthToken")) {
    getToken();
  } else {
    refreshToken();
  }
};

// Helper method to check the expiry of the authToken, refreshing if necessary
const checkExpiry = () => {
  const expiryDate = Date.parse(localStorage.getItem("WSOAuthExpiry"));
  if (expiryDate) {
    const now = Date.now();

    if (expiryDate - now < 3600000) {
      refreshToken();
    }
  } else {
    initializeToken();
  }
};

export { initializeToken, checkExpiry };
