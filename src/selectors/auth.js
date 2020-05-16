const getAPIToken = ({ authState }) => authState.apiToken;
const getCurrUser = ({ authState }) => authState.currUser;
const getExpiry = ({ authState }) => authState.expiry;
const getIdentityToken = ({ authState }) => authState.identityToken;
const getScopes = ({ authState }) => authState.scope;
const getTokenLevel = ({ authState }) => authState.tokenLevel;
const getWSO = ({ authState }) => authState.wso;

export {
  getAPIToken,
  getCurrUser,
  getExpiry,
  getIdentityToken,
  getScopes,
  getTokenLevel,
  getWSO,
};
