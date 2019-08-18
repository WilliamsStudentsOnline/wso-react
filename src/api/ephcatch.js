import axios from "axios";

// Lists all ephcatchers
const getEphcatchers = async (token, params) => {
  const response = await axios({
    url: "/api/v1/ephcatch/ephcatchers",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Gets one ephcatcher
const getEphcatcher = async (token, ephcatcherID) => {
  const response = await axios({
    url: `/api/v1/ephcatch/ephcatchers/${ephcatcherID}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Likes an ephcatcher
const likeEphcatcher = async (token, ephcatcherID) => {
  const response = await axios({
    url: `/api/v1/ephcatch/ephcatchers/${ephcatcherID}/like`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "post",
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Dislikes an ephcatcher
const unlikeEphcatcher = async (token, ephcatcherID) => {
  const response = await axios({
    url: `/api/v1/ephcatch/ephcatchers/${ephcatcherID}/unlike`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "post",
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Lists all matches
const getEphcatchMatches = async (token) => {
  const response = await axios({
    url: "/api/v1/ephcatch/matches",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

export {
  getEphcatchMatches,
  getEphcatcher,
  getEphcatchers,
  likeEphcatcher,
  unlikeEphcatcher,
};
