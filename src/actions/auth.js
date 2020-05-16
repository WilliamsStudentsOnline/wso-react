import {
  UPDATE_IDEN_TOKEN,
  UPDATE_API_TOKEN,
  UPDATE_USER,
  REMOVE_CREDS,
  UPDATE_REMEMBER,
  UPDATE_API,
} from "../constants/actionTypes";

const doUpdateIdentityToken = (token) => ({
  type: UPDATE_IDEN_TOKEN,
  token,
});

const doUpdateAPIToken = (token) => ({
  type: UPDATE_API_TOKEN,
  token,
});

const doUpdateUser = (newUser) => ({
  type: UPDATE_USER,
  newUser,
});

const doRemoveCreds = () => ({
  type: REMOVE_CREDS,
});

const doUpdateRemember = (remember) => ({
  type: UPDATE_REMEMBER,
  remember,
});

const doUpdateAPI = (api) => ({
  type: UPDATE_API,
  api,
});

export {
  doUpdateIdentityToken,
  doUpdateAPIToken,
  doUpdateUser,
  doRemoveCreds,
  doUpdateRemember,
  doUpdateAPI,
};
