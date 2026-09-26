// React imports
import React from "react";
import PropTypes from "prop-types";

// Component imports
import "../../stylesheets/Notification.css";

// Redux (Selector, Reducer, Actions) imports
import { connect } from "react-redux";
import { removeNotif } from "../../../actions/schedulerUtils";
import { SUCCESS, WARNING, FAILURE } from "../../../constants/actionTypes";

const Notification = ({ notifType, title, body, removeNotification }) => {
  const getStyle = () => {
    switch (notifType) {
      case SUCCESS:
        return { borderTop: "2px solid var(--status-success)" };
      case WARNING:
        return { borderTop: "2px solid var(--status-warning)" };
      case FAILURE:
        return { borderTop: "2px solid var(--status-danger)" };
      default:
        return {};
    }
  };

  const handler = () => {
    removeNotification({ notifType, title, body });
  };

  return (
    <div className="notification" style={getStyle()}>
      <div className="row notification-title">{title}</div>
      <div className="row notification-body">{body}</div>
      <div className="row notification-ack">
        <button onClick={handler} type="button">
          Close
        </button>
      </div>
    </div>
  );
};

Notification.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  notifType: PropTypes.string.isRequired,
  removeNotification: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  removeNotification: (notification) => dispatch(removeNotif(notification)),
});

export default connect(null, mapDispatchToProps)(Notification);
