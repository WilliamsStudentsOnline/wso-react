import React, { useState, useEffect } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";
import { formatPrice } from "./misc";

const formatNote = (menuItem, noteObj) => {
  const noteArr = [];
  if (menuItem.category === "Drink") {
    if (menuItem.title === "Loose Leaf Tea") {
      if (noteObj.teaFlavor) noteArr.push(noteObj.teaFlavor);
    }
    if (noteObj.milk) noteArr.push(noteObj.milk);
    if (noteObj.syrup) noteArr.push(noteObj.syrup);
  } else if (menuItem.category === "Food") {
    if (menuItem.title === "Skyr") {
      if (noteObj.skyrFlavor) noteArr.push(noteObj.skyrFlavor);
    }
  }

  return noteArr.length > 0 ? noteArr.join(", ") : "";
};

const noteDefaultProps = {
  milk: "",
  syrup: "",
  teaFlavor: "",
  skyrFlavor: "",
};

const MenuItemCard = ({
  menuItem,
  defaultChecked,
  defaultNote,
  onToggle,
  onNoteChanged,
  menu,
}) => {
  const [checked, updateChecked] = useState(defaultChecked);
  const [note, updateNote] = useState(defaultNote || noteDefaultProps);

  const onClick = (e) => {
    if (onToggle) onToggle(e, !checked, formatNote(note));

    updateChecked(!checked);
  };

  // Reset note if checked cleared
  useEffect(() => {
    // Reset only if now unchecked
    if (!checked) updateNote(defaultNote || noteDefaultProps);
  }, [checked]);

  const renderTeaFlavor = () => {
    const teaFlavors = menu.filter((n) => n.category === "TeaFlavor");
    if (!note.teaFlavor && teaFlavors.length > 0) {
      updateNote({ ...note, teaFlavor: teaFlavors[0].title });
    }
    return (
      <div>
        <h5
          className="small-info-header"
          style={{
            marginBottom: "0.75em",
          }}
        >
          Tea:
        </h5>
        <select
          className="select-menu-item-info"
          value={note.teaFlavor || ""}
          onChange={(e) => {
            updateNote({ ...note, teaFlavor: e.target.value });
          }}
        >
          {teaFlavors.map((mi) => (
            <option value={mi.title} key={mi.title}>
              {mi.title}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const renderDrinkCollapsable = () => {
    return (
      <>
        {menuItem.title === "Loose Leaf Tea" && renderTeaFlavor()}
        <div>
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
            value={note.milk || ""}
            onChange={(e) => {
              updateNote({ ...note, milk: e.target.value });
            }}
          >
            <option value="" key="default">
              No Preference/Usual
            </option>
            {menu
              .filter((n) => n.category === "Milk")
              .map((mi) => (
                <option value={mi.title} key={mi.title}>
                  {mi.title}
                </option>
              ))}
          </select>
        </div>

        <div>
          <h5
            className="small-info-header"
            style={{
              marginBottom: "0.75em",
            }}
          >
            Syrup:
          </h5>
          <select
            className="select-menu-item-info"
            value={note.syrup || ""}
            onChange={(e) => {
              updateNote({ ...note, syrup: e.target.value });
            }}
          >
            <option value="" key="default">
              No Syrup
            </option>
            {menu
              .filter((n) => n.category === "Syrup")
              .map((mi) => (
                <option value={mi.title} key={mi.title}>
                  {mi.title}
                </option>
              ))}
          </select>
        </div>
      </>
    );
  };

  const renderSkyrFlavor = () => {
    const skyrFlavors = menu.filter((n) => n.category === "SkyrFlavor");
    if (!note.skyrFlavor && skyrFlavors.length > 0) {
      updateNote({ ...note, skyrFlavor: skyrFlavors[0].title });
    }
    return (
      <div>
        <h5
          className="small-info-header"
          style={{
            marginBottom: "0.75em",
          }}
        >
          Flavor:
        </h5>
        <select
          className="select-menu-item-info"
          value={note.skyrFlavor || ""}
          onChange={(e) => {
            updateNote({ ...note, skyrFlavor: e.target.value });
          }}
        >
          {skyrFlavors.map((mi) => (
            <option value={mi.title} key={mi.title}>
              {mi.title}
            </option>
          ))}
        </select>
      </div>
    );
  };

  useEffect(() => {
    if (onNoteChanged) onNoteChanged(formatNote(menuItem, note), note);
  }, [note]);

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
        <div className="menu-item-collapsable">{renderDrinkCollapsable()}</div>
      )}
      {menuItem.category === "Food" && menuItem.title === "Skyr" && checked && (
        <div className="menu-item-collapsable">{renderSkyrFlavor()}</div>
      )}
    </div>
  );
};

MenuItemCard.propTypes = {
  menuItem: PropTypes.object.isRequired,
  defaultChecked: PropTypes.bool,
  onToggle: PropTypes.func,
  onNoteChanged: PropTypes.func,
  menu: PropTypes.arrayOf(PropTypes.object),
  defaultNote: PropTypes.shape({
    milk: PropTypes.string,
    syrup: PropTypes.string,
    teaFlavor: PropTypes.string,
    skyrFlavor: PropTypes.string,
  }),
};

MenuItemCard.defaultProps = {
  defaultChecked: false,
  onToggle: null,
  onNoteChanged: null,
  defaultNote: noteDefaultProps,
  menu: [],
};

export default MenuItemCard;
