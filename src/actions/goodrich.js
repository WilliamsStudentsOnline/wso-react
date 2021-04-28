import {
  GOODRICH_ORDER_UPDATE,
  GOODRICH_UPDATE_MANAGER_ORDERS,
} from "../constants/actionTypes";

const doGoodrichOrderUpdate = (order) => ({
  type: GOODRICH_ORDER_UPDATE,
  order,
});

const doGoodrichUpdateManagerOrders = (managerOrders) => ({
  type: GOODRICH_UPDATE_MANAGER_ORDERS,
  managerOrders,
});

export { doGoodrichOrderUpdate, doGoodrichUpdateManagerOrders };
