// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";
import PaginationButtons from "../../PaginationButtons";

// Additional imports
import { capitalize } from "../../../lib/general";

const DormtrakRooms = ({ rooms }) => {
  const perPage = 15; // Number of results per page

  const [page, updatePage] = useState(0);
  const displayRooms =
    rooms.length - 1 > (page + 1) * perPage
      ? rooms.slice(page * perPage, (page + 1) * perPage)
      : rooms.slice(page * perPage, rooms.length - 1);

  // Returns Private bathroom descriptions
  const privateBathrooms = (room) => {
    if (!room.privateBathroom) return null;
    let bathroomDesc = "Yes. ";
    if (room.bathroomDesc) bathroomDesc += room.bathroomDesc;
    return (
      <>
        <small>
          <strong>Private bathroom&nbsp;</strong>
        </small>
        {bathroomDesc}
      </>
    );
  };

  // Handles clicking of the next/previous page
  const clickHandler = (number) => {
    if (number === -1 && page > 0) {
      updatePage(page - 1);
    } else if (number === 1 && rooms.length - (page + 1) * perPage > 0) {
      updatePage(page + 1);
    }
  };

  // Generates the description of the common room.
  const commonRooms = (room) => {
    let crDesc = "";
    if (room.commonRoomAccess) {
      crDesc = "Yes. ";
      if (room.commonRoomDesc) {
        crDesc += room.commonRoomDesc;
      }
    } else {
      crDesc = "No. ";
    }
    return (
      <>
        <small>
          <strong>Common room:&nbsp;</strong>
        </small>
        {crDesc}
        <br />
      </>
    );
  };

  // Generates descriptions for whether the beds are adjustable
  const adjustableBeds = (room) => {
    if (!room.bedAdjustable) return null;
    return (
      <>
        <small>
          <strong>Adjustable bed:&nbsp;</strong>
        </small>
        {room.bedAdjustable ? "Yes" : "Unavailable"}
        <br />
      </>
    );
  };

  return displayRooms ? (
    <>
      <PaginationButtons
        clickHandler={clickHandler}
        page={page}
        total={rooms.length}
        perPage={perPage}
      />
      {displayRooms.map((room) => {
        return (
          <React.Fragment key={room.number}>
            <strong>{`${room.number} (${room.roomType})`}</strong>
            <br />
            <div id={room.number}>
              <small>
                <strong>Floor:&nbsp;</strong>
              </small>
              {room.floorNumber === 0 ? "Basement" : room.floorNumber}
              <br />
              <small>
                <strong>Area:&nbsp;</strong>
              </small>
              {`${room.area} sq. ft.`}
              <br />
              {["faces", "noise", "closet", "flooring"].map((attr) => {
                if (room[attr] !== undefined && room[attr] !== null) {
                  return (
                    <React.Fragment key={attr}>
                      <small>
                        <strong>{`${capitalize(attr)}: `}</strong>
                      </small>
                      {room[attr]}
                      <br />
                    </React.Fragment>
                  );
                }

                return null;
              })}
              {adjustableBeds(room)}
              {commonRooms(room)}
              {privateBathrooms(room)}
            </div>
            <br />
          </React.Fragment>
        );
      })}
      <PaginationButtons
        clickHandler={clickHandler}
        page={page}
        total={rooms.length}
        perPage={perPage}
      />
    </>
  ) : (
    "No room-level information yet!"
  );
};

DormtrakRooms.propTypes = {
  rooms: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default DormtrakRooms;
