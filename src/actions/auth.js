import {
  UPDATE_API_TOKEN,
  REMOVE_CREDS,
  UPDATE_IDEN_TOKEN,
  UPDATE_REMEMBER,
  UPDATE_USER,
  UPDATE_WSO,
} from "../constants/actionTypes";

/**
 * Action to update Identity token.
 *
 * @param {String} token - Identity Token
 */
const doUpdateIdentityToken = (token) => ({
  type: UPDATE_IDEN_TOKEN,
  token,
});

/**
 * Action to update API token.
 *
 * @param {String} token - API Token
 */
const doUpdateAPIToken = (token) => ({
  type: UPDATE_API_TOKEN,
  token,
});

/**
 * Action to update information on the current user.
 *
 * @param newUser - current User
 */
const doUpdateUser = (newUser) => ({
  type: UPDATE_USER,
  newUser,
});

/**
 * Action to remove all credentials and user information.
 */
const doRemoveCreds = () => ({
  type: REMOVE_CREDS,
});

/**
 * Action to update whether the user token should be persisted.
 */
const doUpdateRemember = (remember) => ({
  type: UPDATE_REMEMBER,
  remember,
});

/**
 * Action to update the API.
 */
const doUpdateWSO = (wso) => ({
  type: UPDATE_WSO,
  wso,
});

export {
  doUpdateIdentityToken,
  doUpdateAPIToken,
  doUpdateUser,
  doRemoveCreds,
  doUpdateRemember,
  doUpdateWSO,
};
