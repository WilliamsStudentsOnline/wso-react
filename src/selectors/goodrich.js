const getGoodrichOrder = ({ goodrichState }) => goodrichState.order;
const getGoodrichManagerOrders = ({ goodrichState }) =>
  goodrichState.managerOrders;
export { getGoodrichOrder, getGoodrichManagerOrders };
