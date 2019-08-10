import axios from "axios";

// Get rankings of dorms by specific metrics
const getDormtrakRankings = async (token) => {
  const response = await axios({
    url: "/api/v1/dormtrak/rankings",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Get the list of all dormtrak neighborhoods
const getDormtrakNeighborhoods = async (token) => {
  const response = await axios({
    url: "/api/v1/dormtrak/neighborhoods",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Get a specific dormtrak neighborhood
const getDormtrakNeighborhood = async (token, neighborhoodID) => {
  const response = await axios({
    url: `/api/v1/dormtrak/neighborhoods/${neighborhoodID}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Get the list of all dormtrak dorms
const getDormtrakDorms = async (token) => {
  const response = await axios({
    url: "/api/v1/dormtrak/dorms",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Get the dorm corresponding to a specific dormID
const getDormtrakDorm = async (token, dormID) => {
  const response = await axios({
    url: `/api/v1/dormtrak/dorms/${dormID}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Get the dorm facts for a specific dorm
const getDormtrakDormFacts = async (token, dormID) => {
  const response = await axios({
    url: `/api/v1/dormtrak/dorms/${dormID}/facts`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Get the dorm rooms for a specific dorm
const getDormtrakDormRooms = async (token, dormID) => {
  const response = await axios({
    url: `/api/v1/dormtrak/dorms/${dormID}/rooms`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Get all dormtrak reviews
const getDormtrakDormReviews = async (token) => {
  const response = await axios({
    url: `/api/v1/dormtrak/reviews`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Creates a dormtrak review
const postDormtrakDormReviews = async (token, createParams) => {
  const response = await axios({
    url: `/api/v1/dormtrak/reviews`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: createParams,
    method: "post",
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Get a specific dormtrak review
const getDormtrakDormReview = async (token, reviewID) => {
  const response = await axios({
    url: `/api/v1/dormtrak/reviews/${reviewID}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Deletes a specific Dormtrak survey
const deleteDormtrakDormReview = async (token, reviewID) => {
  const response = await axios({
    url: `/api/v1/dormtrak/reviews/${reviewID}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "delete",
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Patches a specific dormtrak survey
const patchDormtrakDormReview = async (token, reviewID) => {
  const response = await axios({
    url: `/api/v1/dormtrak/reviews/${reviewID}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

export {
  getDormtrakRankings,
  getDormtrakNeighborhoods,
  getDormtrakNeighborhood,
  getDormtrakDorms,
  getDormtrakDorm,
  getDormtrakDormFacts,
  getDormtrakDormRooms,
  getDormtrakDormReviews,
  postDormtrakDormReviews,
  getDormtrakDormReview,
  deleteDormtrakDormReview,
  patchDormtrakDormReview,
};