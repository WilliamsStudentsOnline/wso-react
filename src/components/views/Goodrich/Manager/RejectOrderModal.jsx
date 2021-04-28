// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getWSO } from "../../../../selectors/auth";

// Additional imports
import { Goodrich, WSO } from "wso-api-client";
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

// eslint-disable-next-line no-unused-vars
const RejectOrderModal = ({ modalOpen, closeModal, wso, order }) => {
  const [adminNotes, updateAdminNotes] = useState("");

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      await wso.goodrichService.updateOrder(order.id, {
        adminNotes,
        status: Goodrich.OrderStatus.Rejected,
      });
      closeModal(true);
    } catch (error) {
      alert(error.message);
    }
  };

  const renderChildren = () => {
    return (
      <>
        <h4>Reject Order #{order.id}</h4>
        <hr />

        <form onSubmit={(event) => submitHandler(event)}>
          <b>Admin Notes (rejection reason):</b>
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
              Reject Order
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
      contentLabel="Reject Order Modal"
    >
      {order && renderChildren()}
    </Modal>
  );
};

RejectOrderModal.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  wso: PropTypes.instanceOf(WSO).isRequired,
  order: PropTypes.object,
};

RejectOrderModal.defaultProps = {
  order: null,
};

const mapStateToProps = (state) => ({
  wso: getWSO(state),
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(RejectOrderModal);
