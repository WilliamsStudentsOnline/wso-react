// React Imports
import React, { useState, useEffect } from "react";

// Redux/ Router imports
import { useAppSelector } from "../../../lib/store";
import { getWSO } from "../../../lib/authSlice";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

// Additional Imports
import { userTypeStudent } from "../../../constants/general";
import PaginationButtons from "../../PaginationButtons";
import FacebookGridUser from "./FacebookGridUser";
import { ResponsesGetUserResponseUser } from "wso-api-client/lib/services/types";

const FacebookHome = () => {
  const wso = useAppSelector(getWSO);

  const navigateTo = useNavigate();
  const [searchParams] = useSearchParams();

  const [results, updateResults] = useState<ResponsesGetUserResponseUser[]>([]);
  const perPage = 20;
  const [page, updatePage] = useState(0); // 0-indexed page number (i.e. 0 is the first page)
  const [total, updateTotal] = useState(0);
  const [isResultsLoading, updateResultLoadStatus] = useState(false);

  // loads the next set of users
  const loadUsers = async (newPage: number) => {
    if (!searchParams?.get("q")) {
      updateResults([]);
      updateTotal(0);
      return;
    }

    const queryParams = {
      q: searchParams.get("q") ?? undefined,
      limit: perPage,
      offset: perPage * newPage,
      preload: ["dorm", "office"],
    };
    try {
      const resultsResponse = await wso.userService.listUsers(queryParams);

      updateResults(resultsResponse.data ?? []);
      updateTotal(resultsResponse.paginationTotal || 0);
    } catch {
      updateResults([]);
      updateTotal(0);
    }

    updateResultLoadStatus(false);
  };

  useEffect(() => {
    if (searchParams?.get("q")) {
      updateResultLoadStatus(true);
    }
    updateTotal(0);
    loadUsers(0);
    updatePage(0);
    // eslint-disable-next-line
  }, [wso, searchParams?.get("q")]);

  // Handles clicking of the next/previous page
  const clickHandler = (number: number) => {
    if (number === -1 && page > 0) {
      loadUsers(page - 1);
      updatePage(page - 1);
    } else if (number === 1 && total - (page + 1) * perPage > 0) {
      loadUsers(page + 1);
      updatePage(page + 1);
    }
  };

  // Generates the user's room
  const listUserRoom = (user: ResponsesGetUserResponseUser) => {
    if (user.type === userTypeStudent && user.dormVisible && user.dormRoom) {
      return `${user.dormRoom?.dorm?.name} ${user.dormRoom.number}`;
    }
    if (user.type !== userTypeStudent && user.office) {
      return user.office.number;
    }
    return null;
  };

  // Generates the user's class year
  const classYear = (user: ResponsesGetUserResponseUser) => {
    if (!user.classYear || user.type !== userTypeStudent) return "";
    if (user.offCycle) return `'${(user.classYear - 1) % 100}.5`;

    return `'${user.classYear % 100}`;
  };

  // Displays results in a list view when there are too many results
  const ListView = () => {
    return (
      <>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th className="unix-column">Williams Username</th>
              <th>Room/Office</th>
            </tr>
          </thead>
          <tbody>
            {results &&
              results.map((user) => {
                return (
                  <tr key={user.id}>
                    <td>
                      <Link to={`/facebook/users/${user.id}`}>
                        {user.name} {classYear(user)}
                      </Link>
                    </td>
                    <td>{user.unixID}</td>
                    <td>{listUserRoom(user)}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <PaginationButtons
          clickHandler={clickHandler}
          page={page}
          total={total}
          perPage={perPage}
        />
      </>
    );
  };

  // Displays results in a grid view when there aren't too many results
  const GridView = () => {
    return (
      <div className="grid-wrap">
        {results.map((user) => (
          <FacebookGridUser
            gridUser={user}
            gridUserClassYear={classYear(user)}
            key={user.id}
          />
        ))}
      </div>
    );
  };

  // Returns the results of the search
  const FacebookResults = () => {
    if (isResultsLoading) {
      return (
        <>
          <br />
          <h1 className="no-matches-found">Loading...</h1>
        </>
      );
    }

    if (total === 0 && searchParams?.get("q"))
      return (
        <>
          <br />
          <h1 className="no-matches-found">No matches were found.</h1>
        </>
      );

    if (total === 1) {
      navigateTo(`/facebook/users/${results[0].id}`, { replace: true });
    }

    if (total < 10) return GridView();
    return ListView();
  };

  // This will act as a loading buffer
  if (!results) {
    return (
      <article className="facebook-results">
        <section>
          <br />
          <h1 className="no-matches-found">Loading...</h1>
        </section>
      </article>
    );
  }

  return (
    <article className="facebook-results">
      <section>{FacebookResults()}</section>
    </article>
  );
};

export default FacebookHome;
