// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getWSO, getCurrUser } from "../../../selectors/auth";
import { actions } from "redux-router5";

// Additional imports
import { WSO } from "wso-api-client";

const GoodrichHome = ({ navigateTo, wso }) => {
  const [userOrders, updateUserOrders] = useState(null);

  const itemNames = (items) => {
    console.log(items);
    return items.map((i) => i.title).join(", ");
  };

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
          <h3>Welcome to Dormtrak</h3>
          <p>
            Dormtrak is a system where students can share their thoughts about
            dorm buildings and rooms, as well as find out everything there is to
            know about housing at Williams. Much of our information is pulled
            from surveys that students fill out, so by filling out the survey
            for your building, you help all of us make the most informed
            decision we can about where to live.
          </p>
        </section>

        <section>
          <h3>Previous Orders</h3>

          <div className="goodrich-user-order">
            {userOrders &&
              userOrders.map((order) => (
                <aside
                  key={order.id}
                  className="goodrich-user-order-card"
                  style={{
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      width: "80%",
                      float: "left",
                    }}
                  >
                    <h4>Order #{order.id}</h4>
                    <ul>
                      <li>{itemNames(order.items)}</li>
                      <li>{order.pickupTime}</li>
                    </ul>
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      width: "20%",
                      float: "right",
                    }}
                  >
                    <h4>{order.status}</h4>
                  </div>
                </aside>
              ))}
          </div>

          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Status</th>
                <th>Pickup Time</th>
                <th>Price</th>
                <th>Payment Method</th>
                <th>Items</th>
              </tr>
            </thead>
            <tbody>
              {userOrders &&
                userOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.status}</td>
                    <td>{order.pickupTime}</td>
                    <td>{order.totalPrice}</td>
                    <td>{order.paymentMethod}</td>
                    <td>{JSON.stringify(order.items)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
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
