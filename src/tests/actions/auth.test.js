import {
  doRemoveCreds,
  doUpdateAPIToken,
  doUpdateIdentityToken,
  doUpdateRemember,
  doUpdateUser,
} from "../../actions/auth";
import {
  REMOVE_CREDS,
  UPDATE_API_TOKEN,
  UPDATE_IDEN_TOKEN,
  UPDATE_REMEMBER,
  UPDATE_USER,
} from "../../constants/actionTypes";

describe("Authentication actions", () => {
  it("updates api token", () => {
    const apiToken = "token";

    const expectedAction = {
      type: UPDATE_API_TOKEN,
      token: apiToken,
    };
    const action = doUpdateAPIToken(apiToken);

    expect(action).toEqual(expectedAction);
  });

  it("updates identity token", () => {
    const idenToken = "token";

    const expectedAction = {
      type: UPDATE_IDEN_TOKEN,
      token: idenToken,
    };
    const action = doUpdateIdentityToken(idenToken);

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
