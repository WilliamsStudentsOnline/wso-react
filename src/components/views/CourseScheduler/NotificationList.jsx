// React imports
import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// Component imports
import Notification from "./Notification";
import "../../stylesheets/NotificationList.css";

// Redux (Selector, Reducer, Actions) imports
import { getNotifications } from "../../../selectors/schedulerUtils";

const NotificationList = ({ notifications }) => {
  return (
    <div className="notification-list">
      {(notifications || []).map((notification) => (
        <Notification
          title={notification.title}
          body={notification.body}
          notifType={notification.notifType}
          key={notification.body}
        />
      ))}
    </div>
  );
};

NotificationList.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
      notifType: PropTypes.string.isRequired,
    })
  ).isRequired,
};

const mapStateToProps = (state) => ({
  notifications: getNotifications(state),
});

export default connect(mapStateToProps)(NotificationList);
