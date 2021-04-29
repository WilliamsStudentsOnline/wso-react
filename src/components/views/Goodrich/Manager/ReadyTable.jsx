// React imports
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getWSO } from "../../../../selectors/auth";
import { actions } from "redux-router5";

// Additional imports
import { WSO, Goodrich } from "wso-api-client";
import { useTable, useExpanded } from "react-table";
import {
  formatItemName,
  formatTimeSlot,
  paymentMethodString,
} from "../Order/misc";
import { FaCaretRight, FaCaretDown } from "react-icons/fa";
import { getGoodrichManagerOrders } from "../../../../selectors/goodrich";
import moment from "moment";

const ReadyTable = ({ wso, refreshOrders, orders }) => {
  const [data, updateData] = useState([]);

  useEffect(() => {
    const sortedOrders = orders
      .filter((o) => o.status === Goodrich.OrderStatus.Ready)
      .sort((a, b) => {
        const aTime = moment(a.timeSlot, "HH:mm");
        const bTime = moment(b.timeSlot, "HH:mm");
        return aTime.diff(bTime);
      });
    updateData(sortedOrders);
  }, [orders]);

  const setOrderPaid = async (id) => {
    try {
      await wso.goodrichService.updateOrder(id, {
        status: Goodrich.OrderStatus.Paid,
      });
      refreshOrders();
    } catch (error) {
      alert(error.message);
    }
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
        Header: "Order ID",
        accessor: "id", // accessor is the "key" in the data
      },
      {
        Header: "Pickup Time",
        accessor: "timeSlot",
        Cell: (props) => <div> {formatTimeSlot(props.value)} </div>,
      },
      {
        Header: "Price",
        accessor: (d) => `${d.totalPrice}${d.comboDeal ? " (combo)" : ""}`,
        Cell: (props) => <div> ${props.value} </div>,
      },
      {
        Header: "Payment Method",
        accessor: "paymentMethod",
        Cell: (props) => <div> {paymentMethodString(props.value)} </div>,
      },
      {
        Header: "Unix",
        accessor: "user.unixID",
      },
    ],
    []
  );

  const renderRowSubComponent = React.useCallback(
    ({ row }) => (
      <div>
        <div className="goodrich-expand-info">
          <br />
          <h5>Items:</h5>
          {row.original.items && (
            <ul>
              {row.original.items.map((item) => {
                return <li>- {formatItemName(item)}</li>;
              })}
            </ul>
          )}

          <br />
          {row.original.notes && (
            <>
              <h5>Notes:</h5>
              <p>{row.original.notes}</p>
            </>
          )}

          {row.original.adminNotes && (
            <>
              <h5>Admin Notes:</h5>
              <p>{row.original.adminNotes}</p>
            </>
          )}

          <h5>Payment Method:</h5>
          <p>{paymentMethodString(row.original.paymentMethod)}</p>
          {(row.original.paymentMethod === Goodrich.PaymentMethod.Swipe ||
            row.original.paymentMethod === Goodrich.PaymentMethod.Points) && (
            <>
              <h5>Williams ID:</h5>
              <p>{row.original.idNumber}</p>
            </>
          )}

          <h5>Phone Number:</h5>
          <p>{row.original.phoneNumber}</p>
        </div>
        <div className="goodrich-expand-btns">
          <button onClick={() => setOrderPaid(row.original.id)} type="button">
            Set Order Paid
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
      data,
      columns,
      autoResetExpanded: false,
    },
    useExpanded
  );

  return (
    <>
      <table {...getTableProps()}>
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
              // eslint-disable-next-line react/jsx-props-no-spreading
              <React.Fragment key={row.getRowProps().key}>
                <tr>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
                <tr>
                  <td colSpan={visibleColumns.length}>
                    <div>
                      <span>
                        <b>Items: </b>
                        {row.original.items &&
                          row.original.items
                            .map((item) => {
                              return formatItemName(item);
                            })
                            .join(", ")}
                      </span>
                    </div>
                    {row.isExpanded && renderRowSubComponent({ row })}
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

ReadyTable.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  wso: PropTypes.instanceOf(WSO).isRequired,
  orders: PropTypes.arrayOf(PropTypes.object).isRequired,
  refreshOrders: PropTypes.func.isRequired,
};

ReadyTable.defaultProps = {};

const mapStateToProps = (state) => ({
  wso: getWSO(state),
  orders: getGoodrichManagerOrders(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReadyTable);
