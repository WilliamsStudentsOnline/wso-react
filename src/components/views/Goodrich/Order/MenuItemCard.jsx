import React, { useState } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";
import { formatPrice } from "./misc";

const MenuItemCard = ({
  menuItem,
  defaultChecked,
  defaultMilk,
  onToggle,
  onNoteChanged,
  milkList,
}) => {
  const [checked, updateChecked] = useState(defaultChecked);
  const [milk, updateMilk] = useState(defaultMilk || "Regular Milk");

  const genNote = () => {
    if (menuItem.category === "Drink") {
      return milk;
    }
    return "";
  };

  const onClick = (e) => {
    if (onToggle) onToggle(e, !checked, genNote());

    updateChecked(!checked);
  };

  return (
    <div className="menu-item-card">
      <button
        className={classNames(
          checked ? "bg-info" : "bg-dark-accent-pop",
          "menu-item-button"
        )}
        onClick={onClick}
        type="button"
      >
        {checked ? "Remove" : "Add"}
      </button>
      <p
        style={{
          margin: "0px",
        }}
      >
        {menuItem.title} {menuItem.type && `(${menuItem.type})`}
        <br />
        {formatPrice(menuItem.price)}
      </p>

      {menuItem.category === "Drink" && checked && (
        <div className="menu-item-collapsable">
          <h5
            className="small-info-header"
            style={{
              marginBottom: "0.75em",
            }}
          >
            Milk:
          </h5>
          <select
            className="select-menu-item-info"
            value={milk}
            onChange={(e) => {
              updateMilk(e.target.value);
              if (onNoteChanged) onNoteChanged(e.target.value);
            }}
          >
            {milkList.map((mi) => (
              <option value={mi.title} key={mi.title}>
                {mi.title}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

MenuItemCard.propTypes = {
  menuItem: PropTypes.object.isRequired,
  defaultChecked: PropTypes.bool,
  onToggle: PropTypes.func,
  onNoteChanged: PropTypes.func,
  milkList: PropTypes.arrayOf(PropTypes.object),
  defaultMilk: PropTypes.string,
};

MenuItemCard.defaultProps = {
  defaultChecked: false,
  onToggle: null,
  onNoteChanged: null,
  milkList: [],
  defaultMilk: null,
};

export default MenuItemCard;
