// React imports
import React, { useState, useEffect } from "react";

// Redux imports
import { connect } from "react-redux";
import OrderCombo from "./Order/OrderCombo";
import OrderMenu from "./Order/OrderMenu";
import OrderCheckout from "./Order/OrderCheckout";
import PropTypes from "prop-types";
import { actions, createRouteNodeSelector } from "redux-router5";
import OrderWait from "./Order/OrderWait";
import { getGoodrichOrderLease } from "../../../selectors/goodrich";
import Modal from "react-modal";

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const GoodrichOrder = ({ route, orderLease, navigateTo }) => {
  const [minutes, updateMinutes] = useState(0);
  const [seconds, updateSeconds] = useState(0);
  const [openModal, updateOpenModal] = useState(false);

  const rtIsWait = (name) => {
    return name === "goodrich.order.wait" || name === "goodrich.order";
  };

  useEffect(() => {
    if (openModal && rtIsWait(route.name)) {
      updateOpenModal(false);
      updateMinutes(0);
      updateSeconds(0);
    } else if (!rtIsWait(route.name) && (!orderLease || !orderLease.expiry)) {
      updateOpenModal(true);
    }
  }, [route]);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      if (orderLease && orderLease.expiry) {
        const exp = new Date(orderLease.expiry);
        const now = new Date();
        const dist = exp.getTime() - now.getTime();
        updateMinutes(
          Math.max(Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60))),
          0
        );
        updateSeconds(Math.max(Math.floor((dist % (1000 * 60)) / 1000)), 0);

        if (dist <= 0) {
          updateOpenModal(true);
          clearInterval(countdownInterval);
        }
      }
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, [orderLease]);

  const orderBody = () => {
    const splitRoute = route.name.split(".");
    if (splitRoute.length <= 2) return <OrderWait />;

    switch (splitRoute[2]) {
      case "wait":
        return <OrderWait />;
      case "menu":
        return <OrderMenu />;
      case "checkout":
        return <OrderCheckout />;
      case "combo":
      default:
        return <OrderCombo />;
    }
  };

  return (
    <>
      <div className="container">
        <article className="facebook-results">
          <section>
            <h3>New Order</h3>
            <br />
            {orderLease && orderLease.expiry && (minutes > 0 || seconds > 0) && (
              <>
                <p className="cl-warning">
                  Time Remaining: {minutes}:{seconds < 10 && "0"}
                  {seconds}
                </p>
              </>
            )}
          </section>
          <section>{orderBody()}</section>
          <Modal
            isOpen={openModal}
            onRequestClose={() => {
              navigateTo("goodrich.order", {}, { reload: true });
            }}
            style={modalStyles}
            contentLabel="Error"
          >
            <h4>Order Time Expired</h4>
            <p>
              Your order time has expired. You can go back to the queue and
              start again.
            </p>
            <button
              onClick={() => {
                navigateTo("goodrich.order", {}, { reload: true });
              }}
              type="button"
            >
              Go Back to Queue
            </button>
          </Modal>
        </article>
      </div>
    </>
  );
};

GoodrichOrder.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  route: PropTypes.object.isRequired,
  orderLease: PropTypes.object,
};

GoodrichOrder.defaultProps = {
  orderLease: {},
};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("goodrich.order");

  return (state) => ({
    ...routeNodeSelector(state),
    orderLease: getGoodrichOrderLease(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GoodrichOrder);
