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

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const formatPrice = (price) => {
  return priceFormatter.format(price);
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
  const itemNote = `, ${item.note}`;
  const itemType = ` (${item.item.type}${item.note ? itemNote : ""})`;
  return `${item.item.title}${item.item.type ? itemType : ""}`;
};

export const formatTimeSlot = (timeSlot) => {
  return moment(timeSlot, "HH:mm").format("hh:mm a");
};
