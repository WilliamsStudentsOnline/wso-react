// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./DatePicker.scss";

// Redux and routing imports
import { connect } from "react-redux";
import { getCurrUser, getWSO } from "../../../selectors/auth";
import { createRouteNodeSelector, actions } from "redux-router5";

// Additional Imports
import DatePicker from "react-date-picker";
import {
  bulletinTypeAnnouncement,
  bulletinTypeRide,
} from "../../../constants/general";

const BulletinForm = ({ wso, currUser, navigateTo, route }) => {
  // For non-rides bulletins
  const [title, updateTitle] = useState("");

  // For rides
  const [source, updateSource] = useState("");
  const [destination, updateDestination] = useState("");
  const [offer, updateOffer] = useState(false);

  // Common to all bulletins
  const [startDate, updateStartDate] = useState(new Date());
  const [type, updateType] = useState("");
  const [body, updateBody] = useState("");
  const [errors, updateErrors] = useState([]);

  // Equivalent to ComponentDidMount
  useEffect(() => {
    const loadBulletin = async () => {
      let bulletinResponse;

      try {
        if (route.params.type === bulletinTypeRide) {
          bulletinResponse = await wso.bulletinService.getRide(
            route.params.bulletinID
          );
        } else {
          bulletinResponse = await wso.bulletinService.getBulletin(
            route.params.bulletinID
          );
        }

        const bulletinData = bulletinResponse.data;

        updateBody(bulletinData.body);
        if (route.params.type === bulletinTypeRide) {
          updateSource(bulletinData.source);
          updateDestination(bulletinData.destination);
          updateOffer(bulletinData.offer);
          updateStartDate(bulletinData.date);
        } else {
          updateTitle(bulletinData.title);
          updateStartDate(bulletinData.startDate);
        }
      } catch (error) {
        // We're only expecting 403 errors here
        if (error.errorCode === 403) {
          navigateTo("403");
        }
        // In any other error, the skeleton will just continue displaying.
      }
    };

    // Load Bulletin if it is a proper path
    if (route.name === "bulletins.edit") {
      if (route.params.bulletinID) {
        loadBulletin();
      } else {
        navigateTo("404");
      }
    }

    if (route.params.type) {
      updateType(route.params.type);
    } else {
      updateType(bulletinTypeRide);
    }
  }, [
    wso,
    currUser.id,
    navigateTo,
    route.name,
    route.params.bulletinID,
    route.params.type,
  ]);

  // Date picker for the start date of the announcement
  const startDateField = () => {
    if (type !== bulletinTypeAnnouncement && type !== bulletinTypeRide)
      return null;

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

  // Handles submissions
  const submitHandler = async (event) => {
    event.preventDefault();

    if (!body.trim()) {
      updateErrors(["Message is empty."]);
      return;
    }

    try {
      let response;

      if (type === bulletinTypeRide) {
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
            ? await wso.bulletinService.updateRide(
                route.params.bulletinID,
                rideParams
              )
            : await wso.bulletinService.createRide(rideParams);
      } else {
        const bulletinParams = { type, title, body, startDate };
        response =
          route.name === "bulletins.edit"
            ? await wso.bulletinService.updateBulletin(
                route.params.bulletinID,
                bulletinParams
              )
            : await wso.bulletinService.createBulletin(bulletinParams);
      }

      navigateTo("bulletins.show", { type, bulletinID: response.data.id });
    } catch (error) {
      updateErrors(error.errors);
    }
  };

  // Generates the errors
  const generateErrors = () => {
    if (errors && errors.length > 0) {
      return (
        <div id="errors">
          <b>Please correct the following error(s):</b>
          {errors.map((msg) => (
            <p key={msg}>{msg}</p>
          ))}
        </div>
      );
    }

    return null;
  };

  // Generates fields specific to rides
  const rideSpecificFields = () => {
    return (
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
    );
  };

  // Non-ride specific fields
  const nonRideFields = () => {
    return (
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
    );
  };

  return (
    <article className="list-creation">
      <section>
        <form onSubmit={submitHandler}>
          <br />
          {generateErrors()}

          {type === bulletinTypeRide ? rideSpecificFields() : nonRideFields()}
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
  wso: PropTypes.object.isRequired,
  currUser: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  route: PropTypes.object.isRequired,
};

BulletinForm.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("bulletins");

  return (state) => ({
    wso: getWSO(state),
    currUser: getCurrUser(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BulletinForm);
