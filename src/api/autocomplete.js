import axios from "axios";

// Get autocomplete results for Areas of Study
const autocompleteAOS = async (token, query) => {
  const response = await axios({
    url: "/api/v1/autocomplete/area-of-study",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      q: query,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Get autocomplete results for Courses
// Autocomplete will do autocomplete area of study until the AOS is fully written.
// E.g. csc will return ["csci"] but csci will return ["134", "136"].
const autocompleteCourses = async (token, query) => {
  const response = await axios({
    url: "/api/v1/autocomplete/course",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      q: query,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Get autocomplete results for {Professors
const autocompleteProfs = async (token, query) => {
  const response = await axios({
    url: "/api/v1/autocomplete/professor",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      q: query,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Get autocomplete results for tags
const autocompleteTags = async (token, query) => {
  const response = await axios({
    url: "/api/v1/autocomplete/tag",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      q: query,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

export {
  autocompleteAOS,
  autocompleteCourses,
  autocompleteProfs,
  autocompleteTags,
};
