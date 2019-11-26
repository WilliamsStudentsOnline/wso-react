import {
  doUpdateToken,
  doUpdateUser,
  doRemoveCreds,
  doUpdateRemember,
} from "../../actions/auth";
import {
  UPDATE_TOKEN,
  UPDATE_USER,
  REMOVE_CREDS,
  UPDATE_REMEMBER,
} from "../../constants/actionTypes";

describe("Authentication actions", () => {
  it("updates tokens", () => {
    const response = "token";

    const expectedAction = {
      type: UPDATE_TOKEN,
      response,
    };
    const action = doUpdateToken(response);

    expect(action).toEqual(expectedAction);
  });

  it("updates user", () => {
    const newUser = { name: "user test" };

    const expectedAction = {
      type: UPDATE_USER,
      newUser,
    };
    const action = doUpdateUser(newUser);

    expect(action).toEqual(expectedAction);
  });

  it("removes credentials", () => {
    const expectedAction = {
      type: REMOVE_CREDS,
    };
    const action = doRemoveCreds();

    expect(action).toEqual(expectedAction);
  });

  it("updates option to remember user", () => {
    const remember = true;

    const expectedAction = {
      type: UPDATE_REMEMBER,
      remember,
    };
    const action = doUpdateRemember(remember);

    expect(action).toEqual(expectedAction);
  });
});
