const getGoodrichOrder = ({ goodrichState }) => goodrichState.order;
const getGoodrichManagerOrders = ({ goodrichState }) =>
  goodrichState.managerOrders;
const getGoodrichOrderLease = ({ goodrichState }) => goodrichState.orderLease;

export { getGoodrichOrder, getGoodrichManagerOrders, getGoodrichOrderLease };
