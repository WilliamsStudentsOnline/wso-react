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
      <h4>Would you like to order the Goodrich Combo?</h4>
      <p>
        Would you like to order the Goodrich Combo? Hit ‘yes’ if you’d like to
        order a bagel, a spread, and a drink (any drink!) for a fixed price of
        $5. You can pay by swipe, cash, or credit. Hit ‘no’ if you’d like to
        create your own tab. You’ll be charged the price of each item. You can
        use a swipe for up to $5 of your total and can pay the rest by cash or
        credit.
      </p>
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
