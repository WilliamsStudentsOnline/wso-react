/**
 * This file stores the necessary logic to load and save items from the storage.
 */

/**
 * Loads the specified state from localStorage.
 *
 * @param stateName - Name of State to be retrieved.
 */
export const loadState = (stateName) => {
  try {
    const serializedState = localStorage.getItem(stateName);
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

/**
 * Saves the specific state into localStorage at stateName.
 *
 * @param stateName - Name of State to be saved.
 * @param state - The state to be saved.
 */
export const saveState = (stateName, state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(stateName, serializedState);
  } catch (err) {
    // Ignore write errors.
  }
};

/**
 * Removes the specified state from localStorage.
 *
 * @param stateName - Name of State to be removed.
 */
export const removeStateFromStorage = (stateName) => {
  localStorage.removeItem(stateName);
  sessionStorage.removeItem(stateName);
};
