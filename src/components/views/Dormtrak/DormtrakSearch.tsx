// React imports
import React, { useState, useEffect } from "react";

// Redux/ Routing imports
import { useAppSelector } from "../../../lib/store";
import { getWSO } from "../../../lib/authSlice";
import { Link, useSearchParams } from "react-router-dom";
import { ModelsDorm } from "wso-api-client/lib/services/types";

const DormtrakSearch = () => {
  const wso = useAppSelector(getWSO);
  const [searchParams] = useSearchParams();

  const [dorms, updateDorms] = useState<ModelsDorm[]>([]);

  useEffect(() => {
    const loadDorms = async () => {
      const q = searchParams.get("q");
      const queryParams = {
        q: q ? q : undefined,
        preload: ["neighborhood"],
      };

      try {
        const dormsResponse = await wso.dormtrakService.listDorms(queryParams);
        updateDorms(
          dormsResponse.data
            ? dormsResponse.data.sort((a, b) =>
                a.name && b.name ? a.name.localeCompare(b.name) : 1
              )
            : []
        );
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
                      to={`/dormtrak/neighborhoods/${dorm?.neighborhood?.id}`}
                    >
                      {dorm?.neighborhood?.name}
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
