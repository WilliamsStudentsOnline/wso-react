// React imports
import React, { useEffect, useState } from "react";

// Redux imports
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Goodrich, WSO } from "wso-api-client";
import { getCurrUser, getWSO } from "../../../../selectors/auth";
import { actions } from "redux-router5";
import Modal from "react-modal";
import {
  calculatePrice,
  formatItemName,
  formatPrice,
  paymentMethodString,
} from "./misc";
import moment from "moment";
import { doGoodrichOrderUpdate } from "../../../../actions/goodrich";
import {
  getGoodrichOrder,
  getGoodrichOrderLease,
} from "../../../../selectors/goodrich";
import { modalStyles } from "../../../../constants/goodrich";

const OrderCheckout = ({
  order,
  goodrichOrderUpdate,
  wso,
  navigateTo,
  currUser,
  orderLease,
}) => {
  const [slotList, updateSlotList] = useState([]);
  const [openModal, updateOpenModal] = useState(false);
  const [openTSModal, updateOpenTSModal] = useState(false);
  const [openItemsOutModal, updateOpenItemsOutModal] = useState(false);

  const [timeSlot, updateTimeSlot] = useState("");
  const [paymentMethod, updatePaymentMethod] = useState(0);
  const [williamsID, updateWilliamsID] = useState("");
  const [notes, updateNotes] = useState("");
  const [phoneNumber, updatePhoneNumber] = useState("");
  const [modalError, updateModalError] = useState(null);

  const loadSlotList = async () => {
    try {
      const slotListResp = await wso.goodrichService.listTimeSlots();
      if (!slotListResp.data || slotListResp.data.length === 0) {
        updateOpenTSModal(true);
        return;
      }
      if (slotListResp.data.findIndex((sl) => sl.openSpots > 0) === -1) {
        updateOpenTSModal(true);
        return;
      }

      updateSlotList(slotListResp.data);
    } catch (error) {
      navigateTo("error", { error }, { replace: true });
    }
  };

  const paymentIsSwipe = () => {
    return (
      paymentMethod === Goodrich.PaymentMethod.Swipe ||
      paymentMethod === Goodrich.PaymentMethod.SwipePlusCash ||
      paymentMethod === Goodrich.PaymentMethod.SwipePlusCreditCard
    );
  };

  const calculateOwed = () => {
    return Math.max(calculatePrice(order) - (paymentIsSwipe() ? 5 : 0), 0);
  };

  useEffect(() => {
    updateWilliamsID(currUser.williamsID || "");
    updatePhoneNumber(currUser.cellPhone || "");
  }, [navigateTo, wso, currUser]);

  useEffect(() => {
    loadSlotList();
    const refreshInterval = setInterval(() => {
      loadSlotList();
    }, 3000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, [navigateTo, wso]);

  const renderTimeSlots = () => {
    return (
      <>
        <select
          className="select-course-info"
          onChange={(event) => updateTimeSlot(event.target.value)}
          value={timeSlot}
          required
        >
          <option value="" disabled hidden>
            Select a Pickup Time Slot
          </option>
          {slotList &&
            slotList.map((t) => {
              return (
                <option
                  value={t.formatted}
                  key={t.formatted}
                  disabled={t.openSpots <= 0}
                >
                  {t.formatted} ({t.openSpots} spots)
                </option>
              );
            })}
        </select>
      </>
    );
  };

  const renderPaymentMethods = () => {
    const validPaymentMethods =
      calculatePrice(order) > 5
        ? [
            Goodrich.PaymentMethod.SwipePlusCreditCard,
            Goodrich.PaymentMethod.SwipePlusCash,
            Goodrich.PaymentMethod.CreditCard,
            Goodrich.PaymentMethod.Cash,
          ]
        : [
            Goodrich.PaymentMethod.Swipe,
            Goodrich.PaymentMethod.CreditCard,
            Goodrich.PaymentMethod.Cash,
          ];
    return (
      <>
        {calculatePrice(order) > 5 && (
          <p
            className="cl-warning"
            style={{
              fontWeight: "600",
            }}
          >
            Your subtotal is more than $5.00, so you cannot pay with exclusively
            a swipe. But, you can pay part of your order with a swipe!
          </p>
        )}
        <select
          className="select-course-info"
          onChange={(event) =>
            updatePaymentMethod(parseInt(event.target.value, 10))
          }
          value={paymentMethod}
          required
        >
          <option value={0} disabled hidden>
            Select a Payment Method Slot
          </option>
          {validPaymentMethods.map((t) => {
            return (
              <option value={t} key={t}>
                {paymentMethodString(t)}
              </option>
            );
          })}
        </select>
        {(paymentIsSwipe() ||
          paymentMethod === Goodrich.PaymentMethod.Points) && (
          <>
            <h5>Williams ID Number</h5>
            <input
              type="text"
              required
              value={williamsID}
              onChange={(event) => updateWilliamsID(event.target.value)}
              placeholder="Your W# ID number"
            />
          </>
        )}
      </>
    );
  };

  const showError = (e) => {
    updateModalError(e);
    updateOpenModal(true);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      await wso.goodrichService.createOrder({
        comboDeal: order.comboDeal,
        date: moment().format("YYYY-MM-DD"),
        idNumber: williamsID,
        items: order.items.map((i) => ({ ...i, item: null })),
        notes,
        paymentMethod,
        phoneNumber,
        timeSlot,
        leaseID: orderLease.id,
      });
      goodrichOrderUpdate({});
      navigateTo("goodrich");
    } catch (e) {
      if (e.errorCode === 2141 || e.errorCode === 2134) {
        // If no menu item (out of stock or unavailable), open modal
        updateOpenItemsOutModal(true);
      } else {
        showError(e);
      }
    }
  };

  return (
    <>
      <form onSubmit={(event) => submitHandler(event)}>
        <h5>Pickup Time</h5>
        {renderTimeSlots()}

        <h5>Notes</h5>
        <textarea
          value={notes}
          onChange={(event) => updateNotes(event.target.value)}
          placeholder="Notes for Goodrich employees"
        />

        <h5>Phone Number</h5>
        <input
          type="text"
          required
          value={phoneNumber}
          onChange={(event) => updatePhoneNumber(event.target.value)}
          placeholder="Cell Phone Number"
        />

        <h5
          style={{
            marginTop: "2em",
          }}
        >
          Payment Method
        </h5>
        {renderPaymentMethods()}

        <h5
          style={{
            marginTop: "2em",
          }}
        >
          Summary
        </h5>
        <div className="summary">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th className="price">Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items &&
                order.items.map((oi) => {
                  return (
                    <tr>
                      <td>{formatItemName(oi)}</td>
                      <td className="price">{formatPrice(oi.item.price)}</td>
                    </tr>
                  );
                })}
              {paymentIsSwipe() && (
                <>
                  <tr className="subtotal">
                    <td>Subtotal:</td>
                    <td className="price">
                      {formatPrice(calculatePrice(order))}
                    </td>
                  </tr>
                  <tr className="">
                    <td>Meal Swipe</td>
                    <td className="price">({formatPrice(5.0)})</td>
                  </tr>
                </>
              )}
              <tr className="subtotal">
                <td>
                  <b>Total Owed:</b>
                </td>
                <td className="price">
                  <b>{formatPrice(calculateOwed())}</b>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <button
          style={{
            marginTop: "1em",
          }}
          type="submit"
        >
          Submit Order
        </button>
      </form>

      <Modal
        isOpen={openModal}
        onRequestClose={() => {
          updateOpenModal(false);
        }}
        style={modalStyles}
        contentLabel="Error"
      >
        <h4>Error!</h4>
        <p>{modalError && modalError.message}</p>
        <button
          onClick={() => {
            updateOpenModal(false);
          }}
          type="button"
        >
          Close
        </button>
      </Modal>
      <Modal
        isOpen={openTSModal}
        style={modalStyles}
        contentLabel="Error Time Slots"
        onRequestClose={() => {
          navigateTo("goodrich");
        }}
      >
        <h4>Error!</h4>
        <p>No time slots remaining today.</p>
        <button
          onClick={() => {
            navigateTo("goodrich");
          }}
          type="button"
        >
          Go Back
        </button>
      </Modal>
      <Modal
        isOpen={openItemsOutModal}
        style={modalStyles}
        contentLabel="Error Out of Menu Item"
        onRequestClose={() => {
          updateOpenItemsOutModal(false);
          navigateTo("goodrich.order.menu");
        }}
      >
        <h4>Error!</h4>
        <p>
          One or more of your menu items is out of stock or unavailable. Please
          go back to the menu and choose again.
        </p>
        <button
          onClick={() => {
            updateOpenItemsOutModal(false);
            navigateTo("goodrich.order.menu");
          }}
          type="button"
        >
          Go Back To Menu
        </button>
      </Modal>
    </>
  );
};

OrderCheckout.propTypes = {
  wso: PropTypes.instanceOf(WSO).isRequired,
  currUser: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  goodrichOrderUpdate: PropTypes.func.isRequired,
  order: PropTypes.object.isRequired,
  orderLease: PropTypes.object,
};

OrderCheckout.defaultProps = {
  orderLease: {},
};

const mapStateToProps = (state) => ({
  wso: getWSO(state),
  currUser: getCurrUser(state),
  order: getGoodrichOrder(state),
  orderLease: getGoodrichOrderLease(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
  goodrichOrderUpdate: (newOrder) => dispatch(doGoodrichOrderUpdate(newOrder)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderCheckout);
