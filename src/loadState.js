export const loadState = (stateName) => {
  try {
    let serializedState = localStorage.getItem(stateName);
    // If no saved state found return undefined.
    // Note that you cannot return null, because an undefined input
    // causes the second argument to be treated as empty, whereas
    // a null input causes the second argument to be treated as null
    if (serializedState === null) {
      serializedState = sessionStorage.getItem(stateName);
      if (serializedState === null) {
        return undefined;
      }
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (stateName, state, useLocalStorage) => {
  try {
    const serializedState = JSON.stringify(state);
    if (useLocalStorage) {
      localStorage.setItem(stateName, serializedState);
    } else {
      sessionStorage.setItem(stateName, serializedState);
    }
  } catch (err) {
    // Ignore write errors.
  }
};
