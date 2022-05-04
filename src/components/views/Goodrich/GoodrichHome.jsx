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
        navigateTo("error", { error }, { replace: true });
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
            We are excited to announce that Goodrich Coffee Bar is open for
            curbside pickup for the remainder of the semester!{" "}
            <b>
              We’re open for the first three weekends of May, from 8:30a-11:30a
              on Saturday and Sunday.{" "}
            </b>
            You will not be able to place orders at Goodrich Hall; instead{" "}
            please order ahead for scheduled pickup using this beautiful new{" "}
            contact-less ordering system. We accept swipe, cash, and credit.{" "}
            Feel free to eat your bagels and sip your lattes with your friends{" "}
            on the WCMA eyes, or take your order to go!
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
                .sort((a, b) => b.id - a.id)
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
                .sort((a, b) => b.id - a.id)
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
