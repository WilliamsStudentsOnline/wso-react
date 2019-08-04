import { UPDATE_NOTICE, UPDATE_WARNING } from "../constants/actionTypes";

const doUpdateWarning = (warning) => ({
  type: UPDATE_WARNING,
  warning,
});

const doUpdateNotice = (notice) => ({
  type: UPDATE_NOTICE,
  notice,
});

export { doUpdateNotice, doUpdateWarning };
