const getCurrUser = ({ authState }) => authState.currUser;
const getExpiry = ({ authState }) => authState.expiry;
const getToken = ({ authState }) => authState.token;
const getScopes = ({ authState }) => authState.scopes;
const getTokenLevel = ({ authState }) => authState.tokenLevel;

export { getCurrUser, getExpiry, getToken, getScopes, getTokenLevel };
