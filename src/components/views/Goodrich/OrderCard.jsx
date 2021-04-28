import React from "react";

import PropTypes from "prop-types";
import { formatItemName, orderStatusString } from "./Order/misc";

const OrderCard = ({ order }) => {
  const itemNames = (items) => {
    return items.map((i) => formatItemName(i)).join(", ");
  };

  return (
    <aside
      key={order.id}
      className="goodrich-user-order-card"
      style={{
        textAlign: "left",
        marginTop: "1em",
      }}
    >
      <div
        style={{
          width: "80%",
          float: "left",
        }}
      >
        <h4>Order #{order.id}</h4>
        <ul>
          <li key="1">{itemNames(order.items)}</li>
          <li
            style={{
              fontWeight: "600",
              fontSize: "1em",
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: "darkgrey",
            }}
            key="2"
          >
            {order.timeSlot} ({order.date})
          </li>
        </ul>
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
