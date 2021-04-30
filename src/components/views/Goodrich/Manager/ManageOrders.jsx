// React imports
import React, { useEffect } from "react";

// Redux imports
import { connect } from "react-redux";
import { actions } from "redux-router5";
import PlacedTable from "./PlacedTable";
import { WSO } from "wso-api-client";
import { doGoodrichUpdateManagerOrders } from "../../../../actions/goodrich";
import PropTypes from "prop-types";
import { getWSO } from "../../../../selectors/auth";
import moment from "moment";
import PaidTable from "./PaidTable";
import ReadyTable from "./ReadyTable";

const ManageOrders = ({ navigateTo, goodrichUpdateManagerOrders, wso }) => {
  const loadData = async () => {
    try {
      const ordersResponse = await wso.goodrichService.listOrders({
        date: moment().format("YYYY-MM-DD"),
      });
      goodrichUpdateManagerOrders(ordersResponse.data);
    } catch (error) {
      navigateTo("error", { error });
    }
  };

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      loadData();
    }, 5000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  useEffect(() => {
    loadData();
  }, [wso]);

  return (
    <div className="container">
      <article className="facebook-results">
        <section>
          <h3>Placed Orders</h3>

          <PlacedTable refreshOrders={loadData} />
        </section>
        <section>
          <h3>Ready Orders</h3>

          <ReadyTable refreshOrders={loadData} />
        </section>
        <section>
          <h3>Paid Orders</h3>

          <PaidTable />
        </section>
      </article>
    </div>
  );
};

ManageOrders.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  goodrichUpdateManagerOrders: PropTypes.func.isRequired,
  wso: PropTypes.instanceOf(WSO).isRequired,
};

ManageOrders.defaultProps = {};

const mapStateToProps = (state) => ({
  wso: getWSO(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
  goodrichUpdateManagerOrders: (newOrders) =>
    dispatch(doGoodrichUpdateManagerOrders(newOrders)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageOrders);
