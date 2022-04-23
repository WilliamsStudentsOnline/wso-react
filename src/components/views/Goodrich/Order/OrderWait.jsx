// React imports
import React, { useEffect, useState } from "react";

// Redux imports
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { actions } from "redux-router5";
import { doGoodrichOrderLeaseUpdate } from "../../../../actions/goodrich";
import { getWSO } from "../../../../selectors/auth";
import { WSO } from "wso-api-client";
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

const OrderWait = ({ goodrichOrderLeaseUpdate, navigateTo, wso }) => {
  const [openModal, updateOpenModal] = useState(false);
  const [errorMessage, updateErrorMessage] = useState("");

  const loadLease = async () => {
    try {
      const orderLeaseResp = await wso.goodrichService.getOrderLease();
      goodrichOrderLeaseUpdate(orderLeaseResp.data);
      navigateTo("goodrich.order.combo");
    } catch (error) {
      // if it's just we don't have any leases (2171), ignore error.
      // Otherwise,
      if (error.errorCode !== 2171) {
        // If no more slots, open modal saying that.
        // If goodrich closed today, open modal saying that.
        // Otherwise, error on error page
        if (error.errorCode === 2170) {
          updateErrorMessage("Goodrich has no more open slots today!");
          updateOpenModal(true);
        } else if (error.errorCode === 2140) {
          updateErrorMessage("Goodrich is closed today!");
          updateOpenModal(true);
        } else {
          navigateTo("error", { error }, { replace: true });
        }
      }
    }
  };

  useEffect(() => {
    goodrichOrderLeaseUpdate({});
  }, []);

  useEffect(() => {
    loadLease();
    const refreshInterval = setInterval(() => {
      loadLease();
    }, 1500);

    return () => {
      clearInterval(refreshInterval);
    };
  }, [navigateTo, wso]);

  return (
    <>
      <h4>Please wait here for a spot to order at Goodrich.</h4>
      <p>
        This page will automatically refresh with when you have an order slot.
        Once in, you will have 2 minutes to choose your order before your time
        expires. If you see a 2 minute countdown timer (and you place your order
        within those 2 minutes), your order will go through.
      </p>
      <Modal
        isOpen={openModal}
        onRequestClose={() => {
          navigateTo("goodrich");
        }}
        style={modalStyles}
        contentLabel="Error"
      >
        <h4>Error!</h4>
        <p>{errorMessage}</p>
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

OrderWait.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  goodrichOrderLeaseUpdate: PropTypes.func.isRequired,
  wso: PropTypes.instanceOf(WSO).isRequired,
};

OrderWait.defaultProps = {};

const mapStateToProps = (state) => ({
  wso: getWSO(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
  goodrichOrderLeaseUpdate: (newLease) =>
    dispatch(doGoodrichOrderLeaseUpdate(newLease)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderWait);
