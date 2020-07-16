// React Imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import PaginationButtons from "../../common/PaginationButtons";
import FacebookGridUser from "../FacebookGridUser";

// Redux/ Router imports
import { connect } from "react-redux";
import { getWSO } from "../../../selectors/auth";
import { createRouteNodeSelector, actions } from "redux-router5";
// import { Link } from "react-router5";

// Additional Imports
import { userTypeStudent } from "../../../constants/general";
import {
  EuiCheckbox,
  EuiFlexGrid,
  EuiFlexGroup,
  EuiFlexItem,
  // EuiSpacer,
} from "@elastic/eui";
// import { htmlIdGenerator } from "@elastic/eui/lib/services";
import styles from "./FacebookHome.module.scss";
import FacebookAltLayout from "../FacebookAltLayout";
import FacebookLayout from "../FacebookLayout";

const FacebookHome = ({ navigateTo, route, wso }) => {
  const [results, updateResults] = useState(null);
  const perPage = 20;
  const [page, updatePage] = useState(0);
  const [total, updateTotal] = useState(0);
  const [isResultsLoading, updateResultLoadStatus] = useState(false);

  // loads the next set of users
  const loadUsers = async (newPage) => {
    if (!route.params.q) {
      updateResults([]);
      updateTotal(0);
      return;
    }

    const queryParams = {
      q: route.params.q,
      limit: perPage,
      offset: perPage * newPage,
      preload: ["dorm", "office"],
    };
    try {
      const resultsResponse = await wso.userService.listUsers(queryParams);

      updateResults(resultsResponse.data);
      updateTotal(resultsResponse.paginationTotal || 0);
    } catch {
      updateResults([]);
      updateTotal(0);
    }

    updateResultLoadStatus(false);
  };

  useEffect(() => {
    if (route.params.q) {
      updateResultLoadStatus(true);
    }
    updateTotal(0);
    loadUsers(0);
    updatePage(0);
    // eslint-disable-next-line
  }, [wso, route.params.q]);

  // Handles clicking of the next/previous page
  const clickHandler = (number) => {
    if (number === -1 && page > 0) {
      loadUsers(page - 1);
      updatePage(page - 1);
    } else if (number === 1 && total - (page + 1) * perPage > 0) {
      loadUsers(page + 1);
      updatePage(page + 1);
    }
  };

  // Generates the user's room, might be phased out with ListView
  // const listUserRoom = (user) => {
  //   if (user.type === userTypeStudent && user.dormVisible && user.dormRoom) {
  //     return `${user.dormRoom.dorm.name} ${user.dormRoom.number}`;
  //   }
  //   if (user.type !== userTypeStudent && user.office) {
  //     return user.office.number;
  //   }
  //   return null;
  // };

  // Generates the user's class year
  const classYear = (user) => {
    if (!user.classYear || user.type !== userTypeStudent) return null;
    if (user.offCycle) return `'${(user.classYear - 1) % 100}.5`;

    return `'${user.classYear % 100}`;
  };

  // Displays results in a list view when there are too many results, might be phased out
  // const ListView = () => {
  //   return (
  //     <>
  //       <table>
  //         <thead>
  //           <tr>
  //             <th>Name</th>
  //             <th className="unix-column">Unix</th>
  //             <th>Room/Office</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {results.map((user) => {
  //             return (
  //               <tr key={user.id}>
  //                 <td>
  //                   <Link
  //                     routeName="facebook.users"
  //                     routeParams={{ userID: user.id }}
  //                   >
  //                     {user.name} {classYear(user)}
  //                   </Link>
  //                 </td>
  //                 <td>{user.unixID}</td>
  //                 <td>{listUserRoom(user)}</td>
  //               </tr>
  //             );
  //           })}
  //         </tbody>
  //       </table>
  //       <PaginationButtons
  //         clickHandler={clickHandler}
  //         page={page}
  //         total={total}
  //         perPage={perPage}
  //       />
  //     </>
  //   );
  // };

  const [yearFilter, updateYearFilter] = useState({
    2021: false,
    2022: false,
    2023: false,
    2024: false,
  });

  const onChange = (year) => {
    const updatedYearFilter = { ...yearFilter, year: !yearFilter[year] };
    updateYearFilter(updatedYearFilter);
  };

  const [roleFilter, updateRoleFilter] = useState({
    1: false,
    2: false,
    3: false,
  });

  const onChange2 = (role) => {
    const updatedRoleFilter = { ...roleFilter, role: !roleFilter[role] };
    updateRoleFilter(updatedRoleFilter);
  };

  // Displays results in a grid view when there aren't too many results
  const GridView = () => {
    return (
      <>
        <div className={styles.gridWrap}>
          <div className={styles.results}>{total} results found</div>
          <br />
          <EuiFlexGroup classname={styles.bigGroup}>
            <EuiFlexGrid
              className={styles.flexGrid}
              columns={2}
              direction="column"
            >
              {results.map((user) => (
                <EuiFlexItem className={styles.info} key={user.id} grow={false}>
                  <FacebookGridUser
                    gridUser={user}
                    gridUserClassYear={classYear(user)}
                    key={user.id}
                    wso={wso}
                  />
                </EuiFlexItem>
              ))}
            </EuiFlexGrid>
            <EuiFlexItem className={styles.checkboxes}>
              Year
              <EuiFlexItem className={styles.checkboxGroup}>
                <EuiCheckbox
                  id={21}
                  label="2021"
                  checked={yearFilter[2021]}
                  onChange={() => onChange(2021)}
                />
                <EuiCheckbox
                  id={22}
                  label="2022"
                  checked={yearFilter[2022]}
                  onChange={() => updateYearFilter(2022)}
                />
                <EuiCheckbox
                  id={23}
                  label="2023"
                  checked={yearFilter[2023]}
                  onChange={() => onChange(2023)}
                />
                <EuiCheckbox
                  id={24}
                  label="2024"
                  checked={yearFilter[2024]}
                  onChange={() => updateYearFilter(2024)}
                />
              </EuiFlexItem>
              <h6>Off-cycle years are rounded up</h6>
              Role
              <EuiFlexItem className={styles.checkboxGroup}>
                <EuiCheckbox
                  id={1}
                  label="Student"
                  checked={roleFilter[1]}
                  onChange={() => onChange2(1)}
                />
                <EuiCheckbox
                  id={2}
                  label="Faculty"
                  checked={roleFilter[2]}
                  onChange={() => onChange2(2)}
                />
                <EuiCheckbox
                  id={3}
                  label="Staff"
                  checked={roleFilter[3]}
                  onChange={() => onChange2(3)}
                />
              </EuiFlexItem>
            </EuiFlexItem>
          </EuiFlexGroup>
        </div>
        <PaginationButtons
          clickHandler={clickHandler}
          page={page}
          total={total}
          perPage={perPage}
        />
      </>
    );
  };

  // Returns the results of the search
  const FacebookResults = () => {
    if (!results || isResultsLoading) {
      return <h1 className={styles.matchesFound}>Loading...</h1>;
    }

    if (total === 0)
      return <h1 className={styles.matchesFound}>No matches were found.</h1>;

    if (total === 1) {
      navigateTo(
        "facebook.users",
        { userID: results[0].id },
        { replace: true }
      );
    }

    return GridView();
  };

  if (!route.params.q) {
    return <FacebookLayout />;
  }

  return (
    <FacebookAltLayout>
      <article className="facebook-results">
        <section>
          <br />
          {FacebookResults()}
        </section>
      </article>
    </FacebookAltLayout>
  );
};

FacebookHome.propTypes = {
  wso: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
};

FacebookHome.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("facebook");

  return (state) => ({
    wso: getWSO(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FacebookHome);
