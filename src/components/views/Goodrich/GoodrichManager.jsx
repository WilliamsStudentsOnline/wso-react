// React imports
import React from "react";

// Redux imports
import { connect } from "react-redux";
import { actions } from "redux-router5";
import PlacedTable from "./Manager/PlacedTable";

const GoodrichManager = () => {
  return (
    <div className="container">
      <article className="facebook-results">
        <section>
          <h3>Placed Orders</h3>

          <PlacedTable />
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
