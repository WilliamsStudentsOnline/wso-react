import { GOODRICH_ORDER_UPDATE } from "../constants/actionTypes";

const doGoodrichOrderUpdate = (order) => ({
  type: GOODRICH_ORDER_UPDATE,
  order,
});

export default doGoodrichOrderUpdate;
