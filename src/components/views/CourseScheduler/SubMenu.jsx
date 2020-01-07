// React imports
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// Component imports
import "../../stylesheets/SubMenu.css";

// Redux (Selector, Reducer, Actions) imports
import { doSubmenuChange } from "../../../actions/schedulerUtils";
import { getCurrSubMenu } from "../../../selectors/schedulerUtils";

const SubMenu = ({ handler, active }) => {
  const checkSelected = (string) => {
    return active === string ? "" : "unselected";
  };

  const ListItem = ({ image, text, className }) => {
    const classes = `list-item ${className}`;
    return (
      <li className={classes}>
        <div onClick={() => handler(text)} role="presentation">
          <i className="material-icons">{image}</i>
          <div>{text}</div>
        </div>
      </li>
    );
  };

  ListItem.propTypes = {
    image: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
  };

  return (
    <div className="submenu">
      <div className="submenu-container">
        <ul>
          <ListItem
            image="calendar_today"
            text="Timetable"
            className={checkSelected("Timetable")}
          />
          <ListItem
            image="filter_none"
            text="Catalog"
            className={checkSelected("Catalog")}
          />
        </ul>
      </div>
    </div>
  );
};

SubMenu.propTypes = {
  handler: PropTypes.func.isRequired,
  active: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  active: getCurrSubMenu(state),
});

const mapDispatchToProps = (dispatch) => ({
  handler: (newState) => dispatch(doSubmenuChange(newState)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SubMenu);
