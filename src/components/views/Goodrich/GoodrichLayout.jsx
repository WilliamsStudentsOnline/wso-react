// React imports
import React from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getWSO, getCurrUser } from "../../../selectors/auth";
import { actions } from "redux-router5";

// Additional imports
import { Link } from "react-router5";
import { containsOneOfScopes, scopes } from "../../../lib/general";

const GoodrichLayout = ({ children, token }) => {
  return (
    <div className="">
      <header>
        <div className="page-head">
          <h1>
            <Link routeName="goodrich">Goodrich</Link>
          </h1>
          <ul>
            <li>
              <Link routeName="goodrich">Home</Link>
            </li>
            <li>
              <Link routeName="goodrich.order">New Order</Link>
            </li>
            {containsOneOfScopes(token, [scopes.ScopeGoodrichManager]) && (
              <>
                <li>
                  <Link routeName="goodrich.manager">Manager</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </header>
      {children}
    </div>
  );
};

GoodrichLayout.propTypes = {
  children: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
};

GoodrichLayout.defaultProps = {};

const mapStateToProps = (state) => ({
  currUser: getCurrUser(state),
  wso: getWSO(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GoodrichLayout);
