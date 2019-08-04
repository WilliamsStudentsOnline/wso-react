import {
  UPDATE_TOKEN,
  UPDATE_USER,
  REMOVE_CREDS,
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

export { doUpdateToken, doUpdateUser, doRemoveCreds };
