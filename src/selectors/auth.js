const getCurrUser = ({ authState }) => authState.currUser;
const getExpiry = ({ authState }) => authState.expiry;
const getToken = ({ authState }) => authState.token;
const getScopes = ({ authState }) => authState.scopes;

export { getCurrUser, getExpiry, getToken, getScopes };
