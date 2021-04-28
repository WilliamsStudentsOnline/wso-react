// React imports
import React from "react";

// Redux imports
import { connect } from "react-redux";
import OrderCombo from "./Order/OrderCombo";
import OrderMenu from "./Order/OrderMenu";
import OrderCheckout from "./Order/OrderCheckout";
import PropTypes from "prop-types";
import { actions, createRouteNodeSelector } from "redux-router5";
import Modal from "react-modal";
import moment from "moment";
import { goodrichDates } from "../../../constants/goodrich";

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

const GoodrichOrder = ({ route, navigateTo }) => {
  const openModal = goodrichDates.indexOf(moment().format("MM/DD/YYYY")) === -1;

  const orderBody = () => {
    const splitRoute = route.name.split(".");
    if (splitRoute.length !== 3) return <OrderCombo />;

    switch (splitRoute[2]) {
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
        <h3>New Order</h3>
        <br />
        <article className="facebook-results">
          <section>{orderBody()}</section>
        </article>
      </div>
      <Modal
        isOpen={openModal}
        onRequestClose={() => {
          navigateTo("goodrich");
        }}
        style={modalStyles}
        contentLabel="Error"
      >
        <h4>Error!</h4>
        <p>Goodrich is closed today!</p>
        <button
          onClick={() => {
            navigateTo("goodrich");
          }}
          type="button"
        >
          Go Back
        </button>
      </Modal>
    </>
  );
};

GoodrichOrder.propTypes = {
  route: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
};

GoodrichOrder.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("goodrich.order");

  return (state) => ({
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GoodrichOrder);
