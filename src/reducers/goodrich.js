import { GOODRICH_ORDER_UPDATE } from "../constants/actionTypes";

const INITIAL_STATE = {
  order: {},
};

const goodrichOrderUpdate = (state, order) => {
  return { ...state, order };
};

function goodrichReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GOODRICH_ORDER_UPDATE:
      return goodrichOrderUpdate(state, action.order);
    default:
      return state;
  }
}

export default goodrichReducer;
