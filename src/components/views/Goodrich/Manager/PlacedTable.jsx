// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getWSO } from "../../../../selectors/auth";
import { actions } from "redux-router5";

// Additional imports
import { WSO, Goodrich } from "wso-api-client";
import { useTable, useExpanded } from "react-table";
import { formatItemName, paymentMethodString } from "../Order/misc";
import { FaCaretRight, FaCaretDown } from "react-icons/fa";

const PlacedTable = ({ navigateTo, wso }) => {
  const [data, updateData] = useState([]);

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
        Header: "Requested Time",
        accessor: "preferredTime",
      },
      {
        Header: "Price",
        accessor: "totalPrice",
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

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const ordersResponse = await wso.goodrichService.listOrders({
          statuses: [Goodrich.OrderStatus.Placed],
        });
        if (isMounted) {
          updateData(ordersResponse.data);
        }
      } catch (error) {
        navigateTo("error", { error });
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [navigateTo, wso]);

  const renderRowSubComponent = React.useCallback(
    ({ row }) => (
      <div>
        <div className="goodrich-expand-info">
          <h5>Items:</h5>
          <ul>
            {row.original.items.map((item) => {
              return <li>- {formatItemName(item)}</li>;
            })}
          </ul>

          <br />
          <h5>Notes:</h5>
          <p>{row.original.notes}</p>

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
          <button type="button" className="accept">
            Accept
          </button>
          <button type="button" className="reject">
            Reject
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
  } = useTable({ columns, data }, useExpanded);

  return (
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
            <React.Fragment {...row.getRowProps()}>
              <tr>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
              {/*
                    If the row is in an expanded state, render a row with a
                    column that fills the entire length of the table.
                  */}
              {row.isExpanded ? (
                <tr>
                  <td colSpan={visibleColumns.length}>
                    {/*
                          Inside it, call our renderRowSubComponent function. In reality,
                          you could pass whatever you want as props to
                          a component like this, including the entire
                          table instance. But for this example, we'll just
                          pass the row
                        */}
                    {renderRowSubComponent({ row })}
                  </td>
                </tr>
              ) : null}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
};

PlacedTable.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  wso: PropTypes.instanceOf(WSO).isRequired,
};

PlacedTable.defaultProps = {};

const mapStateToProps = (state) => ({
  wso: getWSO(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PlacedTable);
