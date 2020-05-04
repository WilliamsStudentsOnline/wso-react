import {
  UPDATE_TOKEN,
  UPDATE_USER,
  REMOVE_CREDS,
  UPDATE_REMEMBER,
  UPDATE_API,
} from "../constants/actionTypes";

const doUpdateToken = (token) => ({
  type: UPDATE_TOKEN,
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
  doUpdateToken,
  doUpdateUser,
  doRemoveCreds,
  doUpdateRemember,
  doUpdateAPI,
};
