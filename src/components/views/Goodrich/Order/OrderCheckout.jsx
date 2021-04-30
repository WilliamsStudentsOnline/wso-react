// React imports
import React, { useEffect, useState } from "react";

// Redux imports
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Goodrich, WSO } from "wso-api-client";
import { getCurrUser, getWSO } from "../../../../selectors/auth";
import { actions } from "redux-router5";
import Modal from "react-modal";
import { paymentMethodString } from "./misc";
import moment from "moment";
import { doGoodrichOrderUpdate } from "../../../../actions/goodrich";
import { getGoodrichOrder } from "../../../../selectors/goodrich";

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

const OrderCheckout = ({
  order,
  goodrichOrderUpdate,
  wso,
  navigateTo,
  currUser,
}) => {
  // eslint-disable-next-line no-unused-vars
  const [slotList, updateSlotList] = useState([]);
  const [openModal, updateOpenModal] = useState(false);
  const [openTSModal, updateOpenTSModal] = useState(false);

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
      navigateTo("error", { error });
    }
  };

  useEffect(() => {
    loadSlotList();
    updateWilliamsID(currUser.williamsID || "");
    updatePhoneNumber(currUser.cellPhone || "");
  }, [navigateTo, wso, currUser]);

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
    return (
      <>
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
          {[
            Goodrich.PaymentMethod.Swipe,
            Goodrich.PaymentMethod.CreditCard,
            Goodrich.PaymentMethod.Cash,
          ].map((t) => {
            return (
              <option value={t} key={t}>
                {paymentMethodString(t)}
              </option>
            );
          })}
        </select>
        {(paymentMethod === Goodrich.PaymentMethod.Swipe ||
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
        items: order.items,
        notes,
        paymentMethod,
        phoneNumber,
        timeSlot,
      });
      goodrichOrderUpdate({});
      navigateTo("goodrich");
    } catch (e) {
      showError(e);
    }
  };

  return (
    <>
      <form onSubmit={(event) => submitHandler(event)}>
        <h5>Time</h5>
        {renderTimeSlots()}

        <h5>Payment Method</h5>
        {renderPaymentMethods()}

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
    </>
  );
};

OrderCheckout.propTypes = {
  wso: PropTypes.instanceOf(WSO).isRequired,
  currUser: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  goodrichOrderUpdate: PropTypes.func.isRequired,
  order: PropTypes.object.isRequired,
};

OrderCheckout.defaultProps = {};

const mapStateToProps = (state) => ({
  wso: getWSO(state),
  currUser: getCurrUser(state),
  order: getGoodrichOrder(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
  goodrichOrderUpdate: (newOrder) => dispatch(doGoodrichOrderUpdate(newOrder)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderCheckout);
