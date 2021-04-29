import { Goodrich } from "wso-api-client";
import moment from "moment";

export const paymentMethodString = (paymentMethod) => {
  switch (paymentMethod) {
    case Goodrich.PaymentMethod.Swipe:
      return "Swipe";
    case Goodrich.PaymentMethod.Points:
      return "Points";
    case Goodrich.PaymentMethod.Cash:
      return "Cash";
    case Goodrich.PaymentMethod.CreditCard:
      return "Credit Card";
    case Goodrich.PaymentMethod.Unknown:
    default:
      return "Unknown Payment Method";
  }
};

export const orderStatusString = (orderStatus) => {
  switch (orderStatus) {
    case Goodrich.OrderStatus.Placed:
      return "Placed";
    case Goodrich.OrderStatus.Ready:
      return "Ready";
    case Goodrich.OrderStatus.Paid:
      return "Paid";
    case Goodrich.OrderStatus.Unknown:
    default:
      return "Unknown Order Status";
  }
};

export const formatItemName = (item) => {
  const itemType = ` (${item.type})`;
  return `${item.title}${item.type ? itemType : ""}`;
};

export const formatTimeSlot = (timeSlot) => {
  return moment(timeSlot, "HH:mm").format("hh:mm a");
};
