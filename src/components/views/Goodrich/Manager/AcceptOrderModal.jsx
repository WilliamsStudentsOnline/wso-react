// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getWSO } from "../../../../selectors/auth";

// Additional imports
import { Goodrich, WSO } from "wso-api-client";
import Modal from "react-modal";
import moment from "moment";
import {
  goodrichCloseMoment,
  goodrichOpenMoment,
} from "../../../../constants/goodrich";
import { formatPickupTime } from "../Order/misc";

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

// eslint-disable-next-line no-unused-vars
const AcceptOrderModal = ({ modalOpen, closeModal, wso, order }) => {
  const [adminNotes, updateAdminNotes] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [pickupTime, updatePickupTime] = useState("");

  const renderPickupTimes = () => {
    const opening = moment()
      .startOf("date")
      .add(goodrichOpenMoment);
    const closing = moment()
      .startOf("date")
      .add(goodrichCloseMoment);

    const idx = opening.clone();
    const validTimes = [];
    while (idx.isSameOrBefore(closing)) {
      if (idx.isBefore(moment())) {
        idx.add(moment.duration(10, "minutes"));
        continue;
      }
      validTimes.push(idx.clone());
      idx.add(moment.duration(10, "minutes"));
    }

    return (
      <select
        className="select-course-info"
        onChange={(event) => updatePickupTime(event.target.value)}
        value={pickupTime}
        required
      >
        <option value="" disabled hidden>
          Select Pickup Time
        </option>
        {validTimes.map((t) => {
          return (
            <option value={t.format()} key={t.format()}>
              {t.format("hh:mm a (MM/DD)")}
            </option>
          );
        })}
      </select>
    );
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      await wso.goodrichService.updateOrder(order.id, {
        adminNotes,
        pickupTime,
        status: Goodrich.OrderStatus.Accepted,
      });
      closeModal(true);
    } catch (error) {
      alert(error.message);
    }
  };

  const renderChildren = () => {
    return (
      <>
        <h4>Accept Order #{order.id}</h4>
        <hr />

        <form onSubmit={(event) => submitHandler(event)}>
          <b>User&apos;s Preferred Pickup Time:</b>
          <p>{formatPickupTime(order.preferredTime)}</p>

          <b>Pickup Time:</b>
          {renderPickupTimes()}

          <b>Admin Notes:</b>
          <textarea
            style={{ minHeight: "100px" }}
            placeholder="Put any notes here"
            value={adminNotes}
            onChange={(event) => updateAdminNotes(event.target.value)}
          />

          <div className="goodrich-modal-btn-row">
            <button onClick={closeModal} type="button">
              Cancel
            </button>
            <button
              type="submit"
              style={{
                float: "right",
              }}
            >
              Accept Order
            </button>
          </div>
        </form>
      </>
    );
  };

  return (
    <Modal
      isOpen={modalOpen}
      onRequestClose={closeModal}
      style={modalStyles}
      contentLabel="Accept Order Modal"
    >
      {order && renderChildren()}
    </Modal>
  );
};

AcceptOrderModal.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  wso: PropTypes.instanceOf(WSO).isRequired,
  order: PropTypes.object,
};

AcceptOrderModal.defaultProps = {
  order: null,
};

const mapStateToProps = (state) => ({
  wso: getWSO(state),
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(AcceptOrderModal);
