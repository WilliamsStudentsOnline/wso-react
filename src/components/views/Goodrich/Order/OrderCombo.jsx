// React imports
import React from "react";

// Redux imports
import { connect } from "react-redux";
import PropTypes from "prop-types";

// eslint-disable-next-line no-unused-vars
const OrderCombo = ({ order, updateOrder, onFwd }) => {
  const onSubmit = (useCombo) => {
    updateOrder({
      comboDeal: useCombo,
      ...order,
    });
    onFwd();
  };

  return (
    <>
      <h4>Would you like to use the combo deal?</h4>
      <p>The combo order includes a bagel, a spread, and a drink.</p>
      <div className="goodrich-modal-btn-row">
        <button onClick={() => onSubmit(true)} type="button">
          Yes
        </button>
        <button
          onClick={() => onSubmit(false)}
          type="button"
          style={{
            marginLeft: "3em",
          }}
        >
          No
        </button>
      </div>
    </>
  );
};

OrderCombo.propTypes = {
  order: PropTypes.object.isRequired,
  updateOrder: PropTypes.func.isRequired,
  onFwd: PropTypes.func.isRequired,
};

OrderCombo.defaultProps = {};

const mapStateToProps = () => {};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(OrderCombo);
