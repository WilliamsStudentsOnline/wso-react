// React imports
import React, { useState, useEffect } from "react";

// Redux/ Routing imports
import { useAppSelector } from "../../../lib/store";
import { getWSO } from "../../../reducers/authSlice";
import { Link, useSearchParams } from "react-router-dom";

const DormtrakSearch = () => {
  const wso = useAppSelector(getWSO);
  const [searchParams] = useSearchParams();

  const [dorms, updateDorms] = useState(null);

  useEffect(() => {
    const loadDorms = async () => {
      const queryParams = {
        q: searchParams?.get("q"),
        preload: ["neighborhood"],
      };

      try {
        const dormsResponse = await wso.dormtrakService.listDorms(queryParams);
        updateDorms(dormsResponse.data.sort((a, b) => a.name > b.name));
      } catch {
        updateDorms([]);
      }
    };

    loadDorms();
  }, [wso, searchParams?.get("q")]);

  return (
    <article className="facebook-results">
      <section>
        {!dorms || dorms.length === 0 ? (
          <>
            <br />
            <h1 className="no-matches-found">No matches were found.</h1>
          </>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Building</th>
                <th>Neighborhood</th>
              </tr>
            </thead>
            <tbody>
              {dorms.map((dorm) => (
                <tr key={dorm.id}>
                  <td>
                    <Link to={`/dormtrak/dorms/${dorm.id}`}>{dorm.name}</Link>
                  </td>

                  <td>
                    <Link
                      to={`/dormtrak/neighborhoods/${dorm.neighborhood.id}`}
                    >
                      {dorm.neighborhood.name}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </article>
  );
};

export default DormtrakSearch;
