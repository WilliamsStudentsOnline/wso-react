import axios from "axios";

// Gets Ephmatch availability
const getEphmatchAvailability = async (token) => {
  const response = await axios({
    url: "/api/v2/ephmatch/availability",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// :ists all Ephmatch-eligible students that user has matched with
const getEphmatchMatches = async (token) => {
  const response = await axios({
    url: "/api/v2/ephmatch/matches",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Gets Ephmatch profile of self
const getSelfEphmatchProfile = async (token) => {
  const response = await axios({
    url: `/api/v2/ephmatch/profile`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Get Ephmatch profile
const getEphmatchProfile = async (token, profileUserID) => {
  const response = await axios({
    url: `/api/v2/ephmatch/profiles/${profileUserID}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Get Ephmatch profiles
const getEphmatchProfiles = async (token, params) => {
  const response = await axios({
    url: `/api/v2/ephmatch/profiles`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Create an Ephmatch profile
const createEphmatchProfile = async (token, params) => {
  const response = await axios({
    url: `/api/v2/ephmatch/profile`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: params,
    method: "post",
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Delete own Ephmatch profile
const deleteEphmatchProfile = async (token) => {
  const response = await axios({
    url: `/api/v2/ephmatch/profile`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "delete",
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Update own Ephmatch profile
const updateEphmatchProfile = async (token, params) => {
  const response = await axios({
    url: `/api/v2/ephmatch/profile`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: params,
    method: "patch",
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Likes an ephmatcher
const likeEphmatcher = async (token, profileUserID) => {
  const response = await axios({
    url: `/api/v2/ephmatch/profiles/${profileUserID}/like`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "post",
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Unlikes an ephmatcher
const unlikeEphmatcher = async (token, profileUserID) => {
  const response = await axios({
    url: `/api/v2/ephmatch/profiles/${profileUserID}/unlike`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "post",
  }).catch((error) => {
    return error.response;
  });

  return response;
};

export {
  getEphmatchAvailability,
  getEphmatchMatches,
  getEphmatchProfile,
  getEphmatchProfiles,
  getSelfEphmatchProfile,
  unlikeEphmatcher,
  likeEphmatcher,
  updateEphmatchProfile,
  deleteEphmatchProfile,
  createEphmatchProfile,
};
