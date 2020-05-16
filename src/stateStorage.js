export const loadState = (stateName) => {
  try {
    const serializedState = localStorage.getItem(stateName);
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (stateName, state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(stateName, serializedState);
  } catch (err) {
    // Ignore write errors.
  }
};

export const removeStateFromStorage = (stateName) => {
  localStorage.removeItem(stateName);
  sessionStorage.removeItem(stateName);
};
