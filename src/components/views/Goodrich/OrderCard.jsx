import React from "react";

import PropTypes from "prop-types";
import {
  formatItemName,
  formatPrice,
  isPaymentSwipe,
  orderStatusString,
  paymentMethodString,
} from "./Order/misc";
import { Goodrich } from "wso-api-client";

const OrderCard = ({ order }) => {
  const itemNames = (items) => {
    return items.map((i) => formatItemName(i)).join(", ");
  };

  return (
    <aside key={order.id} className="goodrich-user-order-card">
      <div
        style={{
          width: "80%",
          float: "left",
        }}
      >
        <h4>Order #{order.id}</h4>
        <div>
          <p>{itemNames(order.items || [])}</p>
          <p
            style={{
              marginBottom: "0",
            }}
          >
            <b>Payment:</b> {paymentMethodString(order.paymentMethod)}
            {order.paymentMethod !== Goodrich.PaymentMethod.Swipe &&
              order.paymentMethod !== Goodrich.PaymentMethod.Points && (
                <>
                  ,{" "}
                  {isPaymentSwipe(order.paymentMethod)
                    ? formatPrice(Math.max(order.totalPrice - 5, 0))
                    : formatPrice(order.totalPrice)}{" "}
                  owed
                  {isPaymentSwipe(order.paymentMethod) &&
                    ` (${formatPrice(order.totalPrice)} total)`}
                </>
              )}
          </p>
          <p
            style={{
              fontWeight: "600",
              fontSize: "1em",
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: "darkgrey",
              marginBottom: "0",
            }}
          >
            {order.timeSlot} ({order.date})
          </p>
        </div>
      </div>
      <div
        style={{
          textAlign: "right",
          width: "20%",
          float: "right",
        }}
      >
        <h4>{orderStatusString(order.status)}</h4>
      </div>
    </aside>
  );
};

OrderCard.propTypes = {
  order: PropTypes.object.isRequired,
};

export default OrderCard;
