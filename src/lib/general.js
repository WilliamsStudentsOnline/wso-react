const checkAndHandleError = (navigateTo, response) => {
  if (response) {
    if (response.status && response.status === 200) {
      return true;
    }
    return false;
  }
  // handle error
  return false;
};

export default { checkAndHandleError };
