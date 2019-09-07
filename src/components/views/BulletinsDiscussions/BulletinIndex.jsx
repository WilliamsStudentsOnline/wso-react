// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { getToken, getCurrUser } from "../../../selectors/auth";

import { getBulletins, getRides } from "../../../api/bulletins";

import { connect } from "react-redux";

import { checkAndHandleError } from "../../../lib/general";
import { Link } from "react-router5";

const BulletinIndex = ({ type, token, currUser }) => {
  const [bulletins, updateBulletins] = useState([]);

  useEffect(() => {
    const loadBulletins = async () => {
      const params = {
        type,
        preload: ["user"],
        limit: 20,
        start: new Date(),
      };
      const bulletinsResponse = await getBulletins(token, params);
      if (checkAndHandleError(bulletinsResponse)) {
        updateBulletins(bulletinsResponse.data.data);
      }
    };

    const loadRides = async () => {
      const params = {
        preload: ["user"],
        limit: 20,
        start: new Date(),
      };
      const ridesResponse = await getRides(token, params);
      if (checkAndHandleError(ridesResponse)) {
        updateBulletins(ridesResponse.data.data);
      }
    };

    // Different because the api endpoints are different
    if (type === "ride") loadRides();
    else loadBulletins();
  }, [token, type]);

  const dateOptions = { year: "numeric", month: "long", day: "numeric" };

  return (
    <article className="main-table">
      <section>
        {bulletins.length === 0 ? (
          <h1 className="no-posts">No Posts</h1>
        ) : (
          <table>
            <thead>
              <tr>
                <th className="col-60">Summary</th>
                <th className="col-6020">Posted by</th>
                <th className="col-20">Date</th>
              </tr>
            </thead>
            <tbody>
              {bulletins.map((bulletin) => (
                <tr key={bulletin.id}>
                  <td className="col-60">
                    <Link
                      routeName="bulletins.show"
                      routeParams={{ type, bulletinID: bulletin.id }}
                      routeOptions={{ reload: true }}
                    >
                      {bulletin.type
                        ? bulletin.title
                        : `${bulletin.source} to ${bulletin.destination} (${
                            bulletin.offer ? "Offer" : "Request"
                          })`}
                    </Link>

                    {currUser.id === bulletin.user.id || currUser.admin ? (
                      <>
                        &nbsp;[&nbsp;
                        <Link
                          routeName="bulletins.edit"
                          routeParams={{ bulletinID: bulletin.id, type }}
                        >
                          Edit
                        </Link>
                        &nbsp;|&nbsp;
                        <a
                          data-confirm="Are you sure?"
                          rel="nofollow"
                          data-method="delete"
                          href={`/bulletins/${bulletin.id}`}
                        >
                          Delete
                        </a>
                        &nbsp;]
                      </>
                    ) : null}
                  </td>
                  <td className="col-20">{bulletin.user.name}</td>
                  <td className="col-20">
                    {bulletin.type
                      ? new Date(bulletin.startDate).toLocaleDateString(
                          "en-US",
                          dateOptions
                        )
                      : new Date(bulletin.date).toLocaleDateString(
                          "en-US",
                          dateOptions
                        )}
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

BulletinIndex.propTypes = {
  type: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  currUser: PropTypes.object.isRequired,
};

BulletinIndex.defaultProps = {};

const mapStateToProps = (state) => ({
  token: getToken(state),
  currUser: getCurrUser(state),
});

export default connect(mapStateToProps)(BulletinIndex);
