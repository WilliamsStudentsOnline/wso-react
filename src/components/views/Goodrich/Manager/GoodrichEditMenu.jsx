// React imports
import React, { useEffect, useState } from "react";

// Redux imports
import { connect } from "react-redux";
import { actions } from "redux-router5";
import { WSO } from "wso-api-client";
import PropTypes from "prop-types";
import { getWSO } from "../../../../selectors/auth";
import MenuTable from "./MenuTable";

const GoodrichEditMenu = ({ navigateTo, wso }) => {
  const [data, updateData] = useState([]);

  const loadData = async () => {
    try {
      const menuResp = await wso.goodrichService.listMenu({
        all: true,
      });
      updateData(menuResp.data);
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
          <h3>Goodrich Menu</h3>

          <MenuTable menu={data} refreshMenu={loadData} />
        </section>
      </article>
    </div>
  );
};

GoodrichEditMenu.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  wso: PropTypes.instanceOf(WSO).isRequired,
};

GoodrichEditMenu.defaultProps = {};

const mapStateToProps = (state) => ({
  wso: getWSO(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GoodrichEditMenu);
