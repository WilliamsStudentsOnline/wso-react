// React imports
import React from "react";

// Redux imports
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { actions } from "redux-router5";
import { doGoodrichOrderUpdate } from "../../../../actions/goodrich";

const OrderCombo = ({ goodrichOrderUpdate, navigateTo }) => {
  const onSubmit = (useCombo) => {
    goodrichOrderUpdate({
      comboDeal: useCombo,
    });
    navigateTo("goodrich.order.menu");
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
  navigateTo: PropTypes.func.isRequired,
  goodrichOrderUpdate: PropTypes.func.isRequired,
};

OrderCombo.defaultProps = {};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
  goodrichOrderUpdate: (newOrder) => dispatch(doGoodrichOrderUpdate(newOrder)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderCombo);
