// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

// External Imports
import { getCurrUser, getToken } from "../../../selectors/auth";
import {
  getBulletin,
  patchBulletin,
  postBulletin,
  patchRide,
  postRide,
  getRide,
} from "../../../api/bulletins";
import { checkAndHandleError } from "../../../lib/general";

// External Imports
import { createRouteNodeSelector, actions } from "redux-router5";
import DatePicker from "react-date-picker";

import "../../stylesheets/DatePicker.css";

const BulletinForm = ({ token, currUser, route, navigateTo }) => {
  const [type, updateType] = useState("");

  // For non-rides bulletins
  const [title, updateTitle] = useState("");

  // For rides
  const [source, updateSource] = useState("");
  const [destination, updateDestination] = useState("");
  const [offer, updateOffer] = useState(false);

  const [startDate, updateStartDate] = useState(new Date());
  const [body, updateBody] = useState("");
  const [errors, updateErrors] = useState([]);

  // Equivalent to ComponentDidMount
  useEffect(() => {
    const loadBulletin = async () => {
      let bulletinResponse;

      if (route.params.type === "ride") {
        bulletinResponse = await getRide(token, route.params.bulletinID);
      } else {
        bulletinResponse = await getBulletin(token, route.params.bulletinID);
      }

      if (checkAndHandleError(bulletinResponse)) {
        const bulletinData = bulletinResponse.data.data;

        if (bulletinData.userID === currUser.id) {
          updateBody(bulletinData.body);
          if (route.params.type === "ride") {
            updateSource(bulletinData.source);
            updateDestination(bulletinData.destination);
            updateOffer(bulletinData.offer);
            updateStartDate(bulletinData.date);
          } else {
            updateTitle(bulletinData.title);
            updateStartDate(bulletinData.startDate);
          }
        } else {
          navigateTo("403");
        }
      }
    };

    // Load Bulletin if it is a proper path
    if (route.name === "bulletins.edit") {
      if (route.params.bulletinID) {
        loadBulletin();
      } else {
        navigateTo("403");
      }
    }

    if (route.params.type) {
      updateType(route.params.type);
    } else {
      updateType("rides");
    }
  }, [
    token,
    currUser.id,
    navigateTo,
    route.name,
    route.params.bulletinID,
    route.params.type,
  ]);

  const startDateField = () => {
    if (type !== "announcement" && type !== "ride") return null;

    return (
      <div className="field">
        <h5>
          <b>Show my post starting on</b>
        </h5>
        <DatePicker
          value={startDate}
          onChange={(date) => updateStartDate(date)}
        />
      </div>
    );
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    // Parse integers here rather than below to minimize the expensive operation
    let response;

    if (type === "ride") {
      const rideParams = {
        type,
        source,
        offer,
        destination,
        body,
        date: startDate,
      };
      response =
        route.name === "bulletins.edit"
          ? await patchRide(token, route.params.bulletinID, rideParams)
          : await postRide(token, rideParams);
    } else {
      const bulletinParams = { type, title, body, startDate };
      response =
        route.name === "bulletins.edit"
          ? await patchBulletin(token, route.params.bulletinID, bulletinParams)
          : await postBulletin(token, bulletinParams);
    }

    if (checkAndHandleError(response)) {
      navigateTo("bulletins.show", { type, bulletinID: response.data.data.id });
    } else if (response.data.error.errors) {
      updateErrors(response.data.error.errors);
    } else {
      updateErrors([response.data.error.message]);
    }
  };

  return (
    <article className="list-creation">
      <section>
        <form onSubmit={submitHandler}>
          <br />
          {errors && errors.length > 0 ? (
            <div id="errors">
              <b>Please correct the following error(s):</b>
              {errors.map((msg) => (
                <p key={msg}>{msg}</p>
              ))}
            </div>
          ) : null}

          {type === "ride" ? (
            <>
              <div className="field">
                <label htmlFor="ride_offer">
                  <input
                    type="checkbox"
                    checked={offer}
                    onChange={(event) => updateOffer(event.target.checked)}
                  />
                  I&apos;m offering this ride
                </label>
              </div>

              <div className="field">
                <h5>
                  <b>Source</b>
                </h5>
                <input
                  type="text"
                  value={source}
                  onChange={(event) => updateSource(event.target.value)}
                />
              </div>

              <div className="field">
                <h5>
                  <b>Destination</b>
                </h5>
                <input
                  type="text"
                  value={destination}
                  onChange={(event) => updateDestination(event.target.value)}
                />
              </div>
            </>
          ) : (
            <div className="field">
              <h5>
                <b>Title</b>
              </h5>
              <input
                type="text"
                value={title}
                onChange={(event) => updateTitle(event.target.value)}
              />
            </div>
          )}

          {startDateField()}

          <div className="field">
            <h5>
              <b>Message</b>
            </h5>
            <textarea
              value={body}
              onChange={(event) => updateBody(event.target.value)}
            />
          </div>

          <input
            type="submit"
            value="Submit"
            className="submit"
            data-disable-with="Submit"
          />
        </form>
      </section>
    </article>
  );
};

BulletinForm.propTypes = {
  token: PropTypes.string.isRequired,
  currUser: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
};

BulletinForm.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("bulletins");

  return (state) => ({
    token: getToken(state),
    currUser: getCurrUser(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BulletinForm);
