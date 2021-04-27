import { Goodrich } from "wso-api-client";

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
    case Goodrich.OrderStatus.Accepted:
      return "Accepted";
    case Goodrich.OrderStatus.Rejected:
      return "Rejected";
    case Goodrich.OrderStatus.InProgress:
      return "In-Progress";
    case Goodrich.OrderStatus.Completed:
      return "Completed";
    case Goodrich.OrderStatus.PickedUp:
      return "Picked-Up";
    case Goodrich.OrderStatus.Unknown:
    default:
      return "Unknown Order Status";
  }
};

export const formatItemName = (item) => {
  return item.title;
};
