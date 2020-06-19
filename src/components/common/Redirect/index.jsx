import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { actions } from "redux-router5";

// Component that allows us to redirect!
const Redirect = ({ navigateTo, opts, params, to }) => {
  useEffect(() => {
    navigateTo(to, params, opts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};

Redirect.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  opts: PropTypes.object,
  params: PropTypes.object,
  to: PropTypes.string,
};

Redirect.defaultProps = {
  opts: {},
  params: {},
  to: "home",
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(null, mapDispatchToProps)(Redirect);
