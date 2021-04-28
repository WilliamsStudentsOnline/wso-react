// React imports
import React, { useState } from "react";

// Redux imports
import { connect } from "react-redux";
import OrderCombo from "./Order/OrderCombo";
import OrderMenu from "./Order/OrderMenu";
import OrderCheckout from "./Order/OrderCheckout";

const GoodrichOrder = () => {
  const [order, updateOrder] = useState({});
  const [loc, updateLoc] = useState(0);

  const onComboFwd = () => {
    updateLoc(1);
  };
  const onMenuFwd = () => {
    updateLoc(2);
  };
  const onCheckoutFwd = () => {
    updateLoc(0);
  };

  const orderBody = () => {
    switch (loc) {
      case 1:
        return (
          <OrderMenu
            order={order}
            updateOrder={updateOrder}
            onFwd={onMenuFwd}
          />
        );
      case 2:
        return (
          <OrderCheckout
            order={order}
            updateOrder={updateOrder}
            onFwd={onCheckoutFwd}
          />
        );
      case 0:
      default:
        return (
          <OrderCombo
            order={order}
            updateOrder={updateOrder}
            onFwd={onComboFwd}
          />
        );
    }
  };

  return (
    <div className="container">
      <h3>New Order</h3>
      <br />
      <article className="facebook-results">
        <section>{orderBody()}</section>
      </article>
    </div>
  );
};

GoodrichOrder.propTypes = {};

GoodrichOrder.defaultProps = {};

const mapStateToProps = () => {};

export default connect(mapStateToProps)(GoodrichOrder);
