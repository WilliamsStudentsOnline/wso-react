import axios from "axios";

// List bulletins
const getBulletins = async (token, params) => {
  const response = await axios({
    url: "/api/v1/bulletin/bulletins",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Get single bulletin by ID
const getBulletin = async (token, bulletinID) => {
  const response = await axios({
    url: `/api/v1/bulletin/bulletins/${bulletinID}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Create bulletins
const postBulletins = async (token, params) => {
  const response = await axios({
    url: "/api/v1/bulletin/bulletins",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
    method: "post",
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Delete single bulletin by ID
const deleteBulletin = async (token, bulletinID) => {
  const response = await axios({
    url: `/api/v1/bulletin/bulletins/${bulletinID}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "delete",
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Update bulletin
const patchBulletin = async (token, bulletinID, params) => {
  const response = await axios({
    url: `/api/v1/bulletin/bulletins/${bulletinID}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
    method: "patch",
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// List Discussions
const getDiscussions = async (token, params) => {
  const response = await axios({
    url: "/api/v1/bulletin/discussions",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Get single discussion by ID
const getDiscussion = async (token, discussionID) => {
  const response = await axios({
    url: `/api/v1/bulletin/discussions/${discussionID}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Get discussion posts
const getDiscussionPosts = async (token, discussionID) => {
  const response = await axios({
    url: `/api/v1/bulletin/discussions/${discussionID}/posts`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Create post
const postPost = async (token, createParams) => {
  const response = await axios({
    url: `/api/v1/bulletin/posts`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "post",
    params: createParams,
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Get single post
const getPost = async (token, postID) => {
  const response = await axios({
    url: `/api/v1/bulletin/posts/${postID}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Deletes single post
const deletePost = async (token, postID) => {
  const response = await axios({
    url: `/api/v1/bulletin/posts/${postID}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "delete",
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Update post
const patchPost = async (token, postID, updateParams) => {
  const response = await axios({
    url: `/api/v1/bulletin/posts/${postID}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: updateParams,
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// List rides
const getRides = async (token) => {
  const response = await axios({
    url: `/api/v1/bulletin/rides`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Create ride
const postRide = async (token, createParams) => {
  const response = await axios({
    url: `/api/v1/bulletin/rides`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "patch",
    params: createParams,
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Get ride
const getRide = async (token, rideID) => {
  const response = await axios({
    url: `/api/v1/bulletin/rides/${rideID}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Delete single ride
const deleteRide = async (token, postID) => {
  const response = await axios({
    url: `/api/v1/bulletin/posts/${postID}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "delete",
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Update single ride
const patchRide = async (token, postID, updateParams) => {
  const response = await axios({
    url: `/api/v1/bulletin/posts/${postID}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "patch",
    params: updateParams,
  }).catch((error) => {
    return error.response;
  });

  return response;
};

export {
  getBulletins,
  postBulletins,
  getBulletin,
  getDiscussion,
  deleteBulletin,
  patchBulletin,
  getDiscussions,
  getDiscussionPosts,
  postPost,
  getPost,
  deletePost,
  patchPost,
  getRide,
  getRides,
  postRide,
  deleteRide,
  patchRide,
};