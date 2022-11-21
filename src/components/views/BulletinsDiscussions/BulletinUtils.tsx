import {
  ModelsBulletin,
  ModelsBulletinRide,
} from "wso-api-client/lib/services/types";

export type Bulletin = ModelsBulletin | ModelsBulletinRide;

// Creates the Bulletin Title link
export const generateBulletinTitle = (bulletin: Bulletin) => {
  if (!bulletin) {
    return "(ERROR)";
  }

  let title;
  if ("type" in bulletin) {
    title = bulletin.title ?? "(No Title)";
  } else {
    const ride = bulletin as ModelsBulletinRide;
    if (ride.offer) {
      title = `${ride.source ?? "(Unspecified)"} to ${
        ride.destination ?? "(Unspecified)"
      } (Offer)`;
    } else {
      title = `${ride.source ?? "(Unspecified)"} to ${
        ride.destination ?? "(Unspecified)"
      } (Request)`;
    }
  }

  return title;
};

// Create the bulletin date
export const generateBulletinDate = (bulletin: Bulletin) => {
  if (!bulletin) {
    return "(ERROR)";
  }

  let date;
  if ("type" in bulletin) {
    // normal ModelsBulletin type
    date = bulletin.startDate;
  } else {
    date = (bulletin as ModelsBulletinRide).date;
  }

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  if (date) {
    return new Date(date).toLocaleDateString("en-US", dateOptions);
  } else {
    return new Date(0).toLocaleDateString("en-US", dateOptions);
  }
};
