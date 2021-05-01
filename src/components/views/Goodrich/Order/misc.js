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
    case Goodrich.PaymentMethod.SwipePlusCash:
      return "Swipe + Cash";
    case Goodrich.PaymentMethod.SwipePlusCreditCard:
      return "Swipe + Credit Card";
    case Goodrich.PaymentMethod.Unknown:
    default:
      return "Unknown Payment Method";
  }
};

export const isPaymentSwipe = (pm) => {
  return (
    pm === Goodrich.PaymentMethod.Swipe ||
    pm === Goodrich.PaymentMethod.SwipePlusCash ||
    pm === Goodrich.PaymentMethod.SwipePlusCreditCard
  );
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

export const calculatePrice = (order) => {
  if (!order || !order.items || order.items.length === 0) return null;

  // If in a combo deal, calculate price by finding the maximum price drink,
  // bagel, and spread in the order and set those total to $5.
  if (order.comboDeal) {
    const items = [...order.items];
    const drinks = items.filter((oi) => oi.item.category === "Drink");
    const bagels = items.filter((oi) => oi.item.category === "Bagel");
    const spreads = items.filter((oi) => oi.item.category === "Spread");

    // Validate combo deal
    if (drinks.length < 1 || bagels.length < 1 || spreads.length < 1)
      return null;

    const maxDrink = drinks.reduce((prev, curr) =>
      curr.item.price > prev.item.price ? curr : prev
    );
    const maxBagel = bagels.reduce((prev, curr) =>
      curr.item.price > prev.item.price ? curr : prev
    );
    const maxSpread = spreads.reduce((prev, curr) =>
      curr.item.price > prev.item.price ? curr : prev
    );

    items.splice(items.indexOf(maxDrink), 1);
    items.splice(items.indexOf(maxBagel), 1);
    items.splice(items.indexOf(maxSpread), 1);

    const otherItemsPrice =
      items.length > 0
        ? items
            .map((oi) => {
              return oi.item.price;
            })
            .reduce((a, v) => a + v)
        : 0;

    return 5.0 + otherItemsPrice;
  }

  // If not in a combo deal, calculate price by summing up the prices of
  // each item
  return order.items
    .map((oi) => {
      return oi.item.price;
    })
    .reduce((a, v) => a + v);
};
