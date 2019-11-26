import {
  doSubmenuChange,
  updateGAPI,
  updateSignIn,
  addNotif,
  removeNotif,
  changeSem,
  changeTimeFormat,
} from "../../actions/schedulerUtils";

describe("util action", () => {
  it("changes submenu state", () => {
    const newState = "Catalog";

    const expectedAction = {
      type: "SUBMENU_CHANGE",
      newState,
    };
    const action = doSubmenuChange(newState);

    expect(action).toEqual(expectedAction);
  });

  it("updates Google API status", () => {
    const gapi = { loaded_0: null, loaded_1: null };

    const expectedAction = {
      type: "UPDATE_GAPI",
      gapi,
    };
    const action = updateGAPI(gapi);

    expect(action).toEqual(expectedAction);
  });

  it("update sign-in status", () => {
    const signedIn = true;

    const expectedAction = {
      type: "UPDATE_SIGNIN",
      signedIn,
    };
    const action = updateSignIn(signedIn);

    expect(action).toEqual(expectedAction);
  });

  it("adds notifications", () => {
    const notification = {
      type: "SUCCESS",
      title: "Title",
      body: "Body",
    };

    const expectedAction = {
      type: "ADD_NOTIF",
      notification,
    };
    const action = addNotif(notification);

    expect(action).toEqual(expectedAction);
  });

  it("removes notifications", () => {
    const notification = {
      type: "SUCCESS",
      title: "Title",
      body: "Body",
    };

    const expectedAction = {
      type: "REMOVE_NOTIF",
      notification,
    };
    const action = removeNotif(notification);

    expect(action).toEqual(expectedAction);
  });

  it("changes semester", () => {
    const semester = 1;

    const expectedAction = {
      type: "CHANGE_SEMESTER",
      semester,
    };
    const action = changeSem(semester);

    expect(action).toEqual(expectedAction);
  });

  it("changes time format", () => {
    const twelveHour = true;

    const expectedAction = {
      type: "CHANGE_TIME_FORMAT",
      twelveHour,
    };
    const action = changeTimeFormat(twelveHour);

    expect(action).toEqual(expectedAction);
  });
});
