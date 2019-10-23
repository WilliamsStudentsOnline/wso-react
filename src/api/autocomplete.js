import axios from "axios";

// Get autocomplete results for tags
const autocompleteTags = async (token, query) => {
  const response = await axios({
    url: "/api/v2/autocomplete/tag",
    headers: {
      "Authorization-Token": `Bearer ${token}`,
    },
    params: {
      q: query,
      limit: 5,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

// Get autocomplete results for Factrak (Professors, Courses)
const autocompleteFactrak = async (token, query) => {
  const response = await axios({
    url: "/api/v2/autocomplete/factrak",
    headers: {
      "Authorization-Token": `Bearer ${token}`,
    },
    params: {
      q: query,
    },
  }).catch((error) => {
    return error.response;
  });

  return response;
};

export { autocompleteTags, autocompleteFactrak };
