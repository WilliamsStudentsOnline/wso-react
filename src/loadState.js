export const loadState = () => {
  try {
    const serializedState = localStorage.getItem("state");
    // If no saved state found return undefined.
    // Note that you cannot return null, because an undefined input
    // causes the second argument to be treated as empty, whereas
    // a null input causes the second argument to be treated as null
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch (err) {
    // Ignore write errors.
  }
};
