import { UPDATE_TOKEN, UPDATE_USER } from "../constants/actionTypes";

const doUpdateToken = (response) => ({
  type: UPDATE_TOKEN,
  response,
});

const doUpdateUser = (newUser) => ({
  type: UPDATE_USER,
  newUser,
});

export { doUpdateToken, doUpdateUser };
