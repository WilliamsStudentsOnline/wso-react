import type {
  GoodrichOrderLease,
  ModelsGoodrichOrder,
} from "wso-api-client/lib/generated/types";
import {
  GOODRICH_ORDER_LEASE_UPDATE,
  GOODRICH_ORDER_UPDATE,
  GOODRICH_UPDATE_MANAGER_ORDERS,
} from "../constants/actionTypes";

export interface GoodrichState {
  order: ModelsGoodrichOrder;
  managerOrders: ModelsGoodrichOrder[];
  orderLease: GoodrichOrderLease;
}

type GoodrichAction =
  | { type: typeof GOODRICH_ORDER_UPDATE; order: ModelsGoodrichOrder }
  | {
      type: typeof GOODRICH_UPDATE_MANAGER_ORDERS;
      managerOrders: ModelsGoodrichOrder[];
    }
  | {
      type: typeof GOODRICH_ORDER_LEASE_UPDATE;
      orderLease: GoodrichOrderLease;
    };

const INITIAL_STATE: GoodrichState = {
  order: {},
  managerOrders: [],
  orderLease: {},
};

const goodrichOrderUpdate = (
  state: GoodrichState,
  order: ModelsGoodrichOrder
): GoodrichState => {
  return { ...state, order };
};

const goodrichUpdateManagerOrders = (
  state: GoodrichState,
  managerOrders: ModelsGoodrichOrder[]
): GoodrichState => {
  return { ...state, managerOrders };
};

const goodrichOrderLeaseUpdate = (
  state: GoodrichState,
  orderLease: GoodrichOrderLease
): GoodrichState => {
  return { ...state, orderLease };
};

function goodrichReducer(
  state: GoodrichState = INITIAL_STATE,
  action: GoodrichAction
): GoodrichState {
  switch (action.type) {
    case GOODRICH_ORDER_UPDATE:
      return goodrichOrderUpdate(state, action.order);
    case GOODRICH_UPDATE_MANAGER_ORDERS:
      return goodrichUpdateManagerOrders(state, action.managerOrders);
    case GOODRICH_ORDER_LEASE_UPDATE:
      return goodrichOrderLeaseUpdate(state, action.orderLease);
    default:
      return state;
  }
}

export default goodrichReducer;
