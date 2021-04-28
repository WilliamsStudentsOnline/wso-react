// React imports
import React from "react";

// Redux imports
import { connect } from "react-redux";
import { actions } from "redux-router5";
import PlacedTable from "./Manager/PlacedTable";
import OngoingTable from "./Manager/OngoingTable";

const GoodrichManager = () => {
  return (
    <div className="container">
      <article className="facebook-results">
        <section>
          <h3>Placed Orders</h3>

          <PlacedTable />
        </section>
        <section>
          <h3>Ongoing Orders</h3>

          <OngoingTable />
        </section>
      </article>
    </div>
  );
};

GoodrichManager.propTypes = {};

GoodrichManager.defaultProps = {};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GoodrichManager);
