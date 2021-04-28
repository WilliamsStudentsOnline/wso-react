import {
  GOODRICH_ORDER_UPDATE,
  GOODRICH_UPDATE_MANAGER_ORDERS,
} from "../constants/actionTypes";

const INITIAL_STATE = {
  order: {},
  managerOrders: [],
};

const goodrichOrderUpdate = (state, order) => {
  return { ...state, order };
};

const goodrichUpdateManagerOrders = (state, managerOrders) => {
  return { ...state, managerOrders };
};

function goodrichReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GOODRICH_ORDER_UPDATE:
      return goodrichOrderUpdate(state, action.order);
    case GOODRICH_UPDATE_MANAGER_ORDERS:
      return goodrichUpdateManagerOrders(state, action.managerOrders);
    default:
      return state;
  }
}

export default goodrichReducer;
