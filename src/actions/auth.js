import {
  UPDATE_TOKEN,
  UPDATE_USER,
  REMOVE_CREDS,
  UPDATE_REMEMBER,
} from "../constants/actionTypes";

const doUpdateToken = (response) => ({
  type: UPDATE_TOKEN,
  response,
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

export { doUpdateToken, doUpdateUser, doRemoveCreds, doUpdateRemember };
