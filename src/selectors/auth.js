const getCurrUser = ({ authState }) => authState.currUser;
const getExpiry = ({ authState }) => authState.expiry;
const getToken = ({ authState }) => authState.token;
const getScopes = ({ authState }) => authState.scope;
const getTokenLevel = ({ authState }) => authState.tokenLevel;
const getAPI = ({ authState }) => authState.api;

export { getCurrUser, getExpiry, getToken, getScopes, getTokenLevel, getAPI };
