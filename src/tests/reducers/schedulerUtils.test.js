import deepFreeze from "deep-freeze";
import utilReducer from "../../reducers/schedulerUtils";
import {
  SUBMENU_CHANGE,
  UPDATE_GAPI,
  UPDATE_SIGNIN,
  ADD_NOTIF,
  REMOVE_NOTIF,
  CHANGE_SEMESTER,
  CHANGE_TIME_FORMAT,
  TOGGLE_ORIENTATION,
} from "../../constants/actionTypes";

describe("Utility reducer", () => {
  it("changes semester", () => {
    const semester = 1;

    const action = {
      type: CHANGE_SEMESTER,
      semester,
    };

    const previousState = { semester: 0, error: null };
    const expectedNewState = { semester, error: null };

    deepFreeze(previousState);
    const changedState = utilReducer(previousState, action);

    expect(changedState).toEqual(expectedNewState);
  });

  it("changes time format", () => {
    const twelveHour = true;

    const action = {
      type: CHANGE_TIME_FORMAT,
      twelveHour,
    };

    const previousState = { twelveHour: false, error: null };
    const expectedNewState = { twelveHour, error: null };

    deepFreeze(previousState);
    const changedState = utilReducer(previousState, action);

    expect(changedState).toEqual(expectedNewState);
  });

  it("changes active menu", () => {
    const newState = "Catalog";

    const action = {
      type: SUBMENU_CHANGE,
      newState,
    };

    const previousState = { active: "Timetable", error: null };
    const expectedNewState = { active: newState, error: null };

    deepFreeze(previousState);
    const changedState = utilReducer(previousState, action);

    expect(changedState).toEqual(expectedNewState);
  });

  it("adds notifications", () => {
    const notification = {
      type: "SUCCESS",
      title: "Title",
      body: "Body",
    };

    const action = {
      type: ADD_NOTIF,
      notification,
    };

    const previousState = { notifications: [], error: null };
    const expectedNewState = { notifications: [notification], error: null };

    deepFreeze(previousState);
    const newState = utilReducer(previousState, action);

    expect(newState).toEqual(expectedNewState);
  });

  it("removes notifications", () => {
    const notification = {
      type: "SUCCESS",
      title: "Title",
      body: "Body",
    };

    const action = {
      type: REMOVE_NOTIF,
      notification,
    };

    const previousState = { notifications: [notification], error: null };
    const expectedNewState = { notifications: [], error: null };

    deepFreeze(previousState);
    const newState = utilReducer(previousState, action);

    expect(newState).toEqual(expectedNewState);
  });

  it("updates gapi", () => {
    const gapi = {
      loaded_0: null,
      loaded_1: null,
    };

    const action = {
      type: UPDATE_GAPI,
      gapi,
    };

    const previousState = { gapi: null, error: null };
    const expectedNewState = { gapi, error: null };

    deepFreeze(previousState);
    const newState = utilReducer(previousState, action);

    expect(newState).toEqual(expectedNewState);
  });

  it("Updates Sign-in status", () => {
    const signedIn = true;

    const action = {
      type: UPDATE_SIGNIN,
      signedIn,
    };

    const previousState = { signedIn: false, error: null };
    const expectedNewState = { signedIn, error: null };

    deepFreeze(previousState);
    const newState = utilReducer(previousState, action);

    expect(newState).toEqual(expectedNewState);
  });

  it("Toggles Orientation", () => {
    const action = {
      type: TOGGLE_ORIENTATION,
    };

    const previousState = { horizontal: true };
    const expectedNewState = { horizontal: false };

    deepFreeze(previousState);
    const newState = utilReducer(previousState, action);

    expect(newState).toEqual(expectedNewState);
  });
});
