import {
  UPDATE_API_TOKEN,
  REMOVE_CREDS,
  UPDATE_IDEN_TOKEN,
  UPDATE_REMEMBER,
  UPDATE_USER,
  UPDATE_WSO,
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
