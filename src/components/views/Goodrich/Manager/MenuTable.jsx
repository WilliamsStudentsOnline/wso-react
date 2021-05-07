// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getWSO } from "../../../../selectors/auth";
import { actions } from "redux-router5";

// Additional imports
import { WSO } from "wso-api-client";
import { useTable, useExpanded } from "react-table";
import { FaCaretRight, FaCaretDown } from "react-icons/fa";
import { formatPrice } from "../Order/misc";
import Modal from "react-modal";
import { modalStyles } from "../../../../constants/goodrich";

const MenuTable = ({ wso, refreshMenu, menu }) => {
  const [qtyModalOpen, updateQtyModalOpen] = useState(false);
  const [qtyModalItem, updateQtyModalItem] = useState({});
  const [qtyModalQty, updateQtyModalQty] = useState("");
  const [qtyModalQtyLimit, updateQtyModalQtyLimit] = useState("");

  const toggleOrderAvailability = async (id, itemAvailableNow) => {
    try {
      await wso.goodrichService.updateMenuItem(id, {
        available: !itemAvailableNow,
      });
      refreshMenu();
    } catch (error) {
      alert(error.message);
    }
  };

  const qtyModalSubmit = async (item, lim, qty) => {
    try {
      await wso.goodrichService.updateMenuItem(item.id, {
        quantityLimit: lim,
        quantity: qty,
      });
      refreshMenu();
    } catch (error) {
      alert(error.message);
    }
  };

  const openQtyModal = (item) => {
    updateQtyModalItem(item);
    updateQtyModalOpen(true);
    updateQtyModalQty(item.quantity ? item.quantity.toString() : "");
    updateQtyModalQtyLimit(item.quantityLimit ? "limit" : "nolimit");
  };

  const closeQtyModal = () => {
    updateQtyModalItem({});
    updateQtyModalOpen(false);
    updateQtyModalQty("");
    updateQtyModalQtyLimit("");
  };

  const columns = React.useMemo(
    () => [
      {
        // Make an expander cell
        Header: () => null, // No header
        id: "expander", // It needs an ID
        width: 30,
        Cell: ({ row }) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? (
              <FaCaretDown size="2em" className="message-icon" />
            ) : (
              <FaCaretRight size="2em" className="message-icon" />
            )}
          </span>
        ),
      },
      {
        Header: "Item ID",
        accessor: "id", // accessor is the "key" in the data
      },
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Type",
        accessor: "type",
      },
      {
        Header: "Category",
        accessor: "category",
      },
      {
        Header: "Price",
        accessor: "price",
        Cell: (props) => <div> {formatPrice(props.value)} </div>,
      },
      {
        Header: "Availability",
        accessor: "available",
        Cell: (props) => (
          <div> {props.value ? "Available" : "Unavailable"} </div>
        ),
      },

      {
        Header: "Quantity",
        accessor: (d) => {
          return d.quantityLimit ? d.quantity : "n/A";
        },
        Cell: (props) => <div> {props.value} </div>,
      },
    ],
    []
  );

  const renderRowSubComponent = React.useCallback(
    ({ row }) => (
      <div>
        <div>
          <button
            style={{
              marginRight: "1em",
            }}
            className="bg-dark-accent-pop"
            onClick={() => openQtyModal(row.original)}
            type="button"
          >
            Edit Item Quota/Quantity
          </button>

          <button
            onClick={() =>
              toggleOrderAvailability(row.original.id, row.original.available)
            }
            className={row.original.available ? "bg-warning" : "bg-success"}
            type="button"
          >
            Set Item to {row.original.available ? "Unavailable" : "Available"}
          </button>
        </div>
      </div>
    ),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
  } = useTable(
    {
      data: menu,
      columns,
      autoResetExpanded: false,
    },
    useExpanded
  );

  return (
    <>
      <table className="table-dynamic-width" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <React.Fragment key={row.getRowProps().key}>
                <tr>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
                <tr>
                  {row.isExpanded && (
                    <td colSpan={visibleColumns.length}>
                      {renderRowSubComponent({ row })}
                    </td>
                  )}
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      <Modal
        isOpen={qtyModalOpen}
        style={modalStyles}
        contentLabel="Edit Item Quantity"
        onRequestClose={() => {
          closeQtyModal();
        }}
        ariaHideApp={false}
      >
        <h4>Edit Item Quantity</h4>
        <br />
        <div>
          <p>Limit the quantity of this item?</p>
          <select
            className="select-course-info"
            onChange={(event) => updateQtyModalQtyLimit(event.target.value)}
            value={qtyModalQtyLimit}
            required
          >
            <option value="nolimit">No Limit</option>
            <option value="limit">Limit</option>
          </select>
          <input
            type="text"
            value={qtyModalQty}
            disabled={qtyModalQtyLimit === "nolimit"}
            onChange={(event) => updateQtyModalQty(event.target.value)}
            placeholder="Quantity of Items"
          />
        </div>
        <div>
          <button
            style={{
              marginRight: "1em",
            }}
            onClick={() => {
              closeQtyModal();
            }}
            type="button"
            className="bg-info"
          >
            Cancel
          </button>
          <button
            type="button"
            className="bg-success"
            onClick={() => {
              const parsedQty = parseInt(qtyModalQty, 10);
              if (Number.isNaN(parsedQty) && qtyModalQtyLimit === "limit") {
                alert("quantity is not a number");
                return;
              }
              qtyModalSubmit(
                qtyModalItem,
                qtyModalQtyLimit === "limit",
                qtyModalQty ? parsedQty : null
              );
              closeQtyModal();
            }}
          >
            Save
          </button>
        </div>
      </Modal>
    </>
  );
};

MenuTable.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  wso: PropTypes.instanceOf(WSO).isRequired,
  menu: PropTypes.arrayOf(PropTypes.object).isRequired,
  refreshMenu: PropTypes.func.isRequired,
};

MenuTable.defaultProps = {};

const mapStateToProps = (state) => ({
  wso: getWSO(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuTable);
