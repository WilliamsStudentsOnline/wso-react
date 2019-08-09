// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";

const DormtrakRooms = ({ rooms, perPage }) => {
  const [page, updatePage] = useState(0);
  const displayRooms =
    rooms.length - 1 > (page + 1) * perPage
      ? rooms.slice(page * perPage, (page + 1) * perPage)
      : rooms.slice(page * perPage, rooms.length - 1);

  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const privateBathrooms = (room) => {
    if (!room.private_bathroom) return null;
    let bathroomDesc = "Yes. ";
    if (room.bathroom_desc) bathroomDesc += room.bathroom_desc;
    return (
      <>
        <small>
          <strong>Private bathroom&nbsp;</strong>
        </small>
        {bathroomDesc}
      </>
    );
  };

  const clickHandler = (number) => {
    if (number === -1 && page > 0) {
      updatePage(page - 1);
    } else if (number === 1 && rooms.length - (page + 1) * perPage > 0) {
      updatePage(page + 1);
    }
  };

  const commonRooms = (room) => {
    let crDesc = "";
    if (room.common_room_access) {
      crDesc = "Yes. ";
      if (room.common_room_desc) {
        crDesc += room.common_room_desc;
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

  const adjustableBeds = (room) => {
    if (!room.bed_adjustable) return null;
    let desc = "";

    if (room.bed_adjustable) {
      desc = "Yes";
    } else {
      desc = "Unavailable";
    }

    return (
      <>
        <small>
          <strong>Adjustable bed:&nbsp;</strong>
        </small>
        {desc}
        <br />
      </>
    );
  };

  return displayRooms ? (
    <>
      <div>
        <button
          type="button"
          onClick={() => clickHandler(-1)}
          disabled={page === 0}
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => clickHandler(1)}
          disabled={rooms.length - (page + 1) * perPage <= 0}
        >
          Next
        </button>
      </div>
      {displayRooms.map((room) => {
        return (
          <React.Fragment key={room.number}>
            <strong>{`${room.number} ${room.room_type}`}</strong>
            <br />
            <div id={room.number}>
              <small>
                <strong>Floor:&nbsp;</strong>
              </small>
              {room.floor_number === 0 ? "Basement" : room.floor_number}
              <br />
              <small>
                <strong>Area:&nbsp;</strong>
              </small>
              {`${room.area} sq. ft.`}
              <br />
              {["faces", "noise", "closet", "flooring"].map((attr) => {
                if (room[attr] !== null) {
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
      <button
        type="button"
        onClick={() => clickHandler(-1)}
        disabled={page === 0}
      >
        Previous
      </button>
      <button
        type="button"
        onClick={() => clickHandler(1)}
        disabled={rooms.length - (page + 1) * perPage <= 0}
      >
        Next
      </button>
    </>
  ) : (
    <>No room-level information yet!</>
  );
};

DormtrakRooms.propTypes = {
  rooms: PropTypes.arrayOf(PropTypes.object).isRequired,
  perPage: PropTypes.number.isRequired,
};

export default DormtrakRooms;
