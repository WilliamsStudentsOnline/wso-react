// React imports
import React, { useState, useEffect } from "react";

// Redux and routing imports
import { getWSO } from "../../../lib/authSlice";
import { useAppSelector } from "../../../lib/store";
import { useNavigate, useParams } from "react-router-dom";

// Additional Imports
import DatePicker from "react-date-picker";
import {
  bulletinTypeRide,
  bulletinTypeAnnouncement,
} from "../../../constants/general";
/// Keep this after the "react-date-picker" import so that this css style will take priority.
import "../../stylesheets/DatePicker.css";
import {
  ModelsBulletinRide,
  ModelsBulletin,
} from "wso-api-client/lib/services/types";

const BulletinForm = () => {
  const wso = useAppSelector(getWSO);

  const params = useParams();
  const navigateTo = useNavigate();

  // For non-rides bulletins
  const [title, updateTitle] = useState("");

  // For rides
  const [source, updateSource] = useState("");
  const [destination, updateDestination] = useState("");
  const [offer, updateOffer] = useState(false);

  // Common to all bulletins
  const [startDate, updateStartDate] = useState(new Date());
  const [type, updateType] = useState("");
  const [body, updateBody] = useState<string>("");
  const [errors, updateErrors] = useState<string[]>([]);

  // Equivalent to ComponentDidMount
  useEffect(() => {
    const loadBulletin = async () => {
      let bulletinResponse;

      const bulletinID = Number(params.bulletinID);

      try {
        if (params.type === bulletinTypeRide) {
          bulletinResponse = await wso.bulletinService.getRide(bulletinID);
        } else {
          bulletinResponse = await wso.bulletinService.getBulletin(bulletinID);
        }

        const bulletinData = bulletinResponse.data;

        updateBody(bulletinData?.body ?? "");
        if (params.type === bulletinTypeRide) {
          const rideData = bulletinData as ModelsBulletinRide;
          updateSource(rideData.source ?? "");
          updateDestination(rideData.destination ?? "");
          updateOffer(rideData.offer ?? false);
          updateStartDate(() => {
            if (rideData.date) {
              return new Date(rideData.date);
            }
            return new Date();
          });
        } else {
          const data = bulletinData as ModelsBulletin;
          updateTitle(data.title ?? "");
          updateStartDate(() => {
            if (data.startDate) {
              return new Date(data.startDate);
            }
            return new Date();
          });
        }
      } catch (error) {
        // We're only expecting 403 errors here
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((error as any).errorCode === 403) {
          navigateTo("/403", { replace: true });
        }
        // In any other error, the skeleton will just continue displaying.
      }
    };

    // Load Bulletin if it is a proper path
    // if (route.name === "bulletins.edit") {
    // TODO: right now we are figuring if edit by whether an ID has been passed in
    // can we use a prop?
    if (params.bulletinID) {
      loadBulletin();
    }
    //   else {
    //     navigateTo("404", {}, { replace: true });
    //   }
    // }

    if (params.type) {
      updateType(params.type);
    } else {
      updateType(bulletinTypeRide);
    }
  }, [wso, params.bulletinID, params.type]);

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
          onChange={(date: Date) => updateStartDate(date)}
        />
      </div>
    );
  };

  // Handles submissions
  const submitHandler: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();

    if (!body.trim()) {
      updateErrors(["Message is empty."]);
      return;
    }

    try {
      let response;

      // add 30s to date so that we wont have error abt too old post.
      const dateAdjusted = new Date(startDate.getTime() + 30000);

      if (type === bulletinTypeRide) {
        const rideParams = {
          type,
          source,
          offer,
          destination,
          body,
          date: dateAdjusted.toString(),
        };
        response =
          // TODO: right now we are figuring if edit by whether an ID has been passed in
          params.bulletinID
            ? await wso.bulletinService.updateRide(
                Number(params.bulletinID),
                rideParams
              )
            : await wso.bulletinService.createRide(rideParams);
      } else {
        const bulletinParams = {
          type,
          title,
          body,
          startDate: startDate.toString(),
        };
        response =
          // TODO: right now we are figuring if edit by whether an ID has been passed in
          params.bulletinID
            ? await wso.bulletinService.updateBulletin(
                Number(params.bulletinID),
                bulletinParams
              )
            : await wso.bulletinService.createBulletin(bulletinParams);
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      navigateTo(`/bulletins/${type}/${response!.data!.id}`);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateErrors((error as any).errors);
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

  // Generates fields specific to rides
  const rideDateField = () => {
    return (
      <div className="field">
        <h5>
          <b>I am offering/requesting a ride on</b>
        </h5>
        <DatePicker
          value={startDate}
          onChange={(date: Date) => updateStartDate(date)}
        />
      </div>
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
          {type === bulletinTypeRide ? rideDateField() : startDateField()}

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

export default BulletinForm;
