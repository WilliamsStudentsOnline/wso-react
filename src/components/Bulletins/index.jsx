// React imports
import React from "react";
import PropTypes from "prop-types";
import BulletinLayout from "./BulletinLayout";
import BulletinIndex from "./BulletinIndex";
import BulletinShow from "./BulletinShow";
import BulletinForm from "./BulletinForm";

// Redux imports
import { connect } from "react-redux";

// External Imports
import { createRouteNodeSelector } from "redux-router5";
import {
  bulletinTypeLostAndFound,
  bulletinTypeJob,
  bulletinTypeRide,
  bulletinTypeExchange,
  bulletinTypeAnnouncement,
} from "../../constants/general";
import { getAPIToken } from "../../selectors/auth";

const BulletinMain = ({ route }) => {
  const BulletinBody = (bulletinType) => {
    const splitRoute = route.name.split(".");

    if (splitRoute.length < 2) {
      return <BulletinIndex type={bulletinType} />;
    }

    switch (splitRoute[1]) {
      case "show":
        return <BulletinShow />;
      case "new":
      case "edit":
        return <BulletinForm />;
      default:
        return <BulletinIndex type={bulletinType} />;
    }
  };

  // Check that this is a valid route with 'type' params
  if (route.params && route.params.type) {
    // Check that the type is valid
    const validBulletinTypes = [
      bulletinTypeLostAndFound,
      bulletinTypeRide,
      bulletinTypeJob,
      bulletinTypeExchange,
      bulletinTypeAnnouncement,
    ];

    if (validBulletinTypes.indexOf(route.params.type) !== -1) {
      return (
        <BulletinLayout type={route.params.type}>
          {BulletinBody(route.params.type)}
        </BulletinLayout>
      );
    }
  }

  return null;
};

BulletinMain.propTypes = {
  route: PropTypes.object.isRequired,
};

BulletinMain.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("bulletins");

  return (state) => ({
    token: getAPIToken(state),
    ...routeNodeSelector(state),
  });
};

export default connect(mapStateToProps)(BulletinMain);
