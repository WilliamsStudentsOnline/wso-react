// React imports
import React, { useEffect, useState } from "react";

// Redux imports
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { WSO } from "wso-api-client";
import { getWSO } from "../../../../selectors/auth";
import { actions } from "redux-router5";
import Modal from "react-modal";
import { doGoodrichOrderUpdate } from "../../../../actions/goodrich";
import { getGoodrichOrder } from "../../../../selectors/goodrich";
import { calculatePrice, formatItemName, formatPrice } from "./misc";
import MenuItemCard from "./MenuItemCard";

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

const OrderMenu = ({ order, goodrichOrderUpdate, wso, navigateTo }) => {
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

  const getNumItemSections = () => {
    const numItems = {
      bagels: 0,
      drinks: 0,
      spreads: 0,
      other: 0,
    };

    for (const orderItem of selectedItems) {
      const m = getItemByID(orderItem.id);
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

    return numItems;
  };

  const comboInvalid = () => {
    if (!order.comboDeal) return false;

    if (selectedItems.length < 3) return true;

    const numItems = getNumItemSections();

    return numItems.bagels < 1 || numItems.drinks < 1 || numItems.spreads < 1;
  };

  const comboOver = () => {
    if (!order.comboDeal) return false;

    if (comboInvalid()) return false;

    if (selectedItems.length > 3) return true;

    const numItems = getNumItemSections();

    return (
      numItems.bagels > 1 ||
      numItems.drinks > 1 ||
      numItems.spreads > 1 ||
      numItems.other > 0
    );
  };

  const onSubmit = () => {
    if (order.comboDeal && comboInvalid()) {
      updateOpenModal(true);
      return;
    }

    goodrichOrderUpdate({
      ...order,
      items: selectedItems,
    });
    navigateTo("goodrich.order.checkout");
  };

  const onMenuItemClick = (checked, orderItem) => {
    if (checked) {
      updateSelectedItems([...selectedItems, orderItem]);
    } else {
      updateSelectedItems((prev) =>
        prev.filter((currItem) => currItem.id !== orderItem.id)
      );
    }
  };

  const onMenuItemNoteChanged = (id, value, noteObject) => {
    updateSelectedItems((prev) => {
      const next = [...prev];
      const idx = next.findIndex((currItem) => currItem.id === id);
      if (idx !== -1) {
        next[idx] = { ...next[idx], note: value, noteObject };
      }

      return next;
    });
  };

  const getSubtotal = () => {
    if (comboInvalid()) return "n/A";

    const subtotal = calculatePrice({ ...order, items: selectedItems });
    if (subtotal === null) return "n/A";

    return formatPrice(subtotal);
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
  useEffect(() => {
    updateSelectedItems(order.items || []);
  }, [order]);

  return (
    <>
      <h4 className="menu-section-header">Drinks</h4>
      <div>
        {menu &&
          menu
            .filter((m) => {
              return m.category === "Drink";
            })
            .map((m) => {
              const foundItem = selectedItems.find((si) => si.id === m.id);
              return (
                <MenuItemCard
                  menuItem={m}
                  menu={menu}
                  onToggle={(e, v, note) =>
                    onMenuItemClick(v, { id: m.id, note, item: m })
                  }
                  defaultChecked={!!foundItem}
                  defaultNote={foundItem && foundItem.noteObject}
                  onNoteChanged={(v, noteObj) =>
                    onMenuItemNoteChanged(m.id, v, noteObj)
                  }
                />
              );
            })}
      </div>

      <h4 className="menu-section-header">Bagels</h4>
      <div>
        {menu &&
          menu
            .filter((m) => {
              return m.category === "Bagel";
            })
            .map((m) => {
              const foundItem = selectedItems.find((si) => si.id === m.id);
              return (
                <MenuItemCard
                  menuItem={m}
                  menu={menu}
                  onToggle={(e, v, note) =>
                    onMenuItemClick(v, { id: m.id, note, item: m })
                  }
                  defaultChecked={!!foundItem}
                  defaultNote={foundItem && foundItem.noteObject}
                  onNoteChanged={(v, noteObj) =>
                    onMenuItemNoteChanged(m.id, v, noteObj)
                  }
                />
              );
            })}
      </div>

      <h4 className="menu-section-header">Spreads</h4>
      <div>
        {menu &&
          menu
            .filter((m) => {
              return m.category === "Spread";
            })
            .map((m) => {
              const foundItem = selectedItems.find((si) => si.id === m.id);
              return (
                <MenuItemCard
                  menuItem={m}
                  menu={menu}
                  onToggle={(e, v, note) =>
                    onMenuItemClick(v, { id: m.id, note, item: m })
                  }
                  defaultChecked={!!foundItem}
                  defaultNote={foundItem && foundItem.noteObject}
                  onNoteChanged={(v, noteObj) =>
                    onMenuItemNoteChanged(m.id, v, noteObj)
                  }
                />
              );
            })}
      </div>

      <h4 className="menu-section-header">Food Items</h4>
      <div>
        {menu &&
          menu
            .filter((m) => {
              return m.category === "Food";
            })
            .map((m) => {
              const foundItem = selectedItems.find((si) => si.id === m.id);
              return (
                <MenuItemCard
                  menuItem={m}
                  menu={menu}
                  onToggle={(e, v, note) =>
                    onMenuItemClick(v, { id: m.id, note, item: m })
                  }
                  defaultChecked={!!foundItem}
                  defaultNote={foundItem && foundItem.noteObject}
                  onNoteChanged={(v, noteObj) =>
                    onMenuItemNoteChanged(m.id, v, noteObj)
                  }
                />
              );
            })}
      </div>

      <br />
      {menu && menu.length && (
        <>
          <h4>Summary</h4>
          <ul>
            {selectedItems &&
              selectedItems.map((oi) => {
                const m = getItemByID(oi.id);
                return (
                  <li key={`subtotal${m.id}`}>
                    - {formatItemName({ ...oi, item: m })}
                  </li>
                );
              })}
          </ul>
          <b>Subtotal: {getSubtotal()}</b>
          <br />

          {order.comboDeal && comboInvalid() && (
            <p className="cl-danger">
              Not enough items to make a combo deal! Please have at least 1
              drink, 1 bagel, and 1 spread.
            </p>
          )}
          {order.comboDeal && comboOver() && (
            <p className="cl-warning">
              Your order consists of the combo plus some extra items, so the
              total will be more than the combo price. You can still pay with a
              swipe, but you will need to pay part of your order with cash/card.
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
        </>
      )}

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
          This selection of items is invalid for the $5 combo. Please have at
          least 1 drink, 1 bagel, 1 spread.
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
  wso: PropTypes.instanceOf(WSO).isRequired,
  navigateTo: PropTypes.func.isRequired,
  goodrichOrderUpdate: PropTypes.func.isRequired,
  order: PropTypes.object.isRequired,
};

OrderMenu.defaultProps = {};

const mapStateToProps = (state) => ({
  wso: getWSO(state),
  order: getGoodrichOrder(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
  goodrichOrderUpdate: (newOrder) => dispatch(doGoodrichOrderUpdate(newOrder)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderMenu);
