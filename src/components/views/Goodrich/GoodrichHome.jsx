// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getWSO, getCurrUser } from "../../../selectors/auth";
import { actions } from "redux-router5";

// Additional imports
import { WSO } from "wso-api-client";
import moment from "moment";
import OrderCard from "./OrderCard";

const GoodrichHome = ({ navigateTo, wso }) => {
  const [userOrders, updateUserOrders] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadUserOrders = async () => {
      try {
        const userOrdersResponse = await wso.goodrichService.listUserOrders();
        if (isMounted) {
          updateUserOrders(userOrdersResponse.data);
        }
      } catch (error) {
        navigateTo("error", { error });
      }
    };

    loadUserOrders();

    return () => {
      isMounted = false;
    };
  }, [navigateTo, wso]);

  return (
    <div className="container">
      <article className="facebook-results">
        <section>
          <h3>Goodrich Order Online</h3>
          <p>
            Goodrich is the student-run coffee house on campus. Located right by
            Currier Quad, it is a hub for all students!{" "}
            <b>
              Goodrich will be open for all weekends through the end of the
              semester from 8:30am-11:30am.
            </b>
            &nbsp;You cannot order there and must place an order ahead of time
            on here.
          </p>
          <button
            type="button"
            onClick={() => {
              navigateTo("goodrich.order");
            }}
          >
            Create a New Order!
          </button>
        </section>

        <section
          style={{
            marginTop: "1em",
          }}
        >
          <h3>Today&apos;s Orders</h3>

          <div className="goodrich-user-order">
            {userOrders &&
              userOrders
                .filter((order) => {
                  return order.date === moment().format("YYYY-MM-DD");
                })
                .map((order) => <OrderCard order={order} />)}
          </div>
          <br />

          <h3>Previous Orders</h3>

          <div className="goodrich-user-order">
            {userOrders &&
              userOrders
                .filter((order) => {
                  return order.date !== moment().format("YYYY-MM-DD");
                })
                .map((order) => <OrderCard order={order} />)}
          </div>
        </section>
      </article>
    </div>
  );
};

GoodrichHome.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  wso: PropTypes.instanceOf(WSO).isRequired,
};

GoodrichHome.defaultProps = {};

const mapStateToProps = (state) => ({
  currUser: getCurrUser(state),
  wso: getWSO(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GoodrichHome);
