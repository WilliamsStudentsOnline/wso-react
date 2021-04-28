// React imports
import React, { useEffect, useState } from "react";

// Redux imports
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { WSO } from "wso-api-client";
import { getWSO } from "../../../../selectors/auth";
import { actions } from "redux-router5";
import Modal from "react-modal";

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

// eslint-disable-next-line no-unused-vars
const OrderMenu = ({ order, updateOrder, onFwd, wso, navigateTo }) => {
  // eslint-disable-next-line no-unused-vars
  const [menu, updateMenu] = useState([]);
  const [selectedItems, updateSelectedItems] = useState([]);
  const [openModal, updateOpenModal] = useState(false);

  const getItemByID = (id) => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < menu.length; i++) {
      if (menu[i].id === id) {
        return menu[i];
      }
    }
    return null;
  };

  const comboInvalid = () => {
    if (!order.comboDeal) return false;

    if (selectedItems.length !== 3) return true;

    const numItems = {
      bagels: 0,
      drinks: 0,
      spreads: 0,
      other: 0,
    };

    for (const itemID of selectedItems) {
      const m = getItemByID(itemID);
      switch (m.category) {
        case "Bagel":
          numItems.bagels += 1;
          break;
        case "Drink":
          numItems.drinks += 1;
          break;
        case "Spread":
          numItems.spreads += 1;
          break;
        default:
          numItems.other += 1;
          break;
      }
    }

    return (
      numItems.bagels !== 1 ||
      numItems.drinks !== 1 ||
      numItems.spreads !== 1 ||
      numItems.other !== 0
    );
  };

  const onSubmit = () => {
    if (order.comboDeal && comboInvalid()) {
      updateOpenModal(true);
      return;
    }

    updateOrder({
      itemIDs: selectedItems,
      ...order,
    });
    onFwd();
  };

  const onCheckboxChange = (e, menuItemID) => {
    if (e.target.checked) {
      updateSelectedItems([...selectedItems, menuItemID]);
    } else {
      updateSelectedItems((prev) =>
        prev.filter((currItem) => currItem !== menuItemID)
      );
    }
  };

  const getSubtotal = () => {
    if (order.comboDeal) return comboInvalid() ? "n/A" : "5.00";

    return selectedItems.length > 0
      ? selectedItems
          .map((id) => {
            const m = getItemByID(id);
            return m.price;
          })
          .reduce((a, v) => a + v)
      : 0;
  };

  const loadData = async () => {
    try {
      const menuResp = await wso.goodrichService.listMenu();
      updateMenu(menuResp.data);
    } catch (error) {
      navigateTo("error", { error });
    }
  };

  useEffect(() => {
    loadData();
  }, [navigateTo, wso]);

  return (
    <>
      <h4>Drinks</h4>
      <div>
        {menu
          .filter((m) => {
            return m.category === "Drink";
          })
          .map((m) => {
            return (
              <>
                <label
                  htmlFor={`menuitem${m.id}`}
                  style={{
                    fontWeight: "normal",
                    paddingBottom: "0.2em",
                  }}
                >
                  <input
                    type="checkbox"
                    id={`menuitem${m.id}`}
                    value={m.id}
                    onChange={(e) => onCheckboxChange(e, m.id)}
                  />
                  {m.title} {m.type && `(${m.type})`} - ${m.price}
                </label>
              </>
            );
          })}
      </div>

      <h4>Bagels</h4>
      <div>
        {menu
          .filter((m) => {
            return m.category === "Bagel";
          })
          .map((m) => {
            return (
              <>
                <label
                  htmlFor={`menuitem${m.id}`}
                  style={{
                    fontWeight: "normal",
                    paddingBottom: "0.2em",
                  }}
                >
                  <input
                    type="checkbox"
                    id={`menuitem${m.id}`}
                    value={m.id}
                    onChange={(e) => onCheckboxChange(e, m.id)}
                  />
                  {m.title} {m.type && `(${m.type})`} - ${m.price}
                </label>
              </>
            );
          })}
      </div>

      <h4>Spreads</h4>
      <div>
        {menu
          .filter((m) => {
            return m.category === "Spread";
          })
          .map((m) => {
            return (
              <>
                <label
                  htmlFor={`menuitem${m.id}`}
                  style={{
                    fontWeight: "normal",
                    paddingBottom: "0.2em",
                  }}
                >
                  <input
                    type="checkbox"
                    id={`menuitem${m.id}`}
                    value={m.id}
                    onChange={(e) => onCheckboxChange(e, m.id)}
                  />
                  {m.title} {m.type && `(${m.type})`} - ${m.price}
                </label>
              </>
            );
          })}
      </div>

      <h4>Food Items</h4>
      <div>
        {menu
          .filter((m) => {
            return m.category === "Food";
          })
          .map((m) => {
            return (
              <>
                <label
                  htmlFor={`menuitem${m.id}`}
                  style={{
                    fontWeight: "normal",
                    paddingBottom: "0.2em",
                  }}
                >
                  <input
                    type="checkbox"
                    id={`menuitem${m.id}`}
                    value={m.id}
                    onChange={(e) => onCheckboxChange(e, m.id)}
                  />
                  {m.title} {m.type && `(${m.type})`} - ${m.price}
                </label>
              </>
            );
          })}
      </div>

      <br />
      <h4>Summary</h4>
      <ul>
        {selectedItems &&
          selectedItems.map((id) => {
            const m = getItemByID(id);
            return (
              <li key={`subtotal${m.id}`}>
                - {m.title} {m.type && `(${m.type})`}
              </li>
            );
          })}
      </ul>
      <b>Subtotal: ${getSubtotal()}</b>
      <br />

      {order.comboDeal && comboInvalid() && (
        <p
          style={{
            color: "red",
          }}
        >
          Cannot get the combo deal with these items. Please have exactly 1
          drink, 1 bagel, 1 spread.
        </p>
      )}

      <button
        style={{
          marginTop: "1em",
        }}
        onClick={onSubmit}
        type="button"
      >
        Go to Checkout
      </button>

      <Modal
        isOpen={openModal}
        onRequestClose={() => {
          updateOpenModal(false);
        }}
        style={modalStyles}
        contentLabel="Combo Pricing Invalid"
      >
        <h4>Error!</h4>
        <p>
          This selection of items is invalid for the $5 combo. Please have only
          1 drink, 1 bagel, 1 spread.
        </p>
        <button
          onClick={() => {
            updateOpenModal(false);
          }}
          type="button"
        >
          Close
        </button>
      </Modal>
    </>
  );
};

OrderMenu.propTypes = {
  order: PropTypes.object.isRequired,
  updateOrder: PropTypes.func.isRequired,
  onFwd: PropTypes.func.isRequired,
  wso: PropTypes.instanceOf(WSO).isRequired,
  navigateTo: PropTypes.func.isRequired,
};

OrderMenu.defaultProps = {};

const mapStateToProps = (state) => ({
  wso: getWSO(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderMenu);
