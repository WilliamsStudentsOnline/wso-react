// React imports
import React, { useState } from "react";
import PaginationButtons from "../../PaginationButtons";
import { Line } from "../../Skeleton";

// Additional imports
import { capitalize } from "../../../lib/general";
import { ModelsDormRoom } from "wso-api-client/lib/services/types";

const DormtrakRooms = ({ rooms }: { rooms?: ModelsDormRoom[] }) => {
  const perPage = 15; // Number of results per page

  const [page, updatePage] = useState(0); // 0-indexed page number (i.e. 0 represents the first page)
  const displayRooms = rooms
    ? rooms.slice(page * perPage, (page + 1) * perPage)
    : null;

  // Returns Private bathroom descriptions
  const privateBathrooms = (room: ModelsDormRoom) => {
    if (!room.privateBathroom) return null;
    let bathroomDesc = "Yes. ";
    if (room.bathroomDesc) bathroomDesc += room.bathroomDesc;
    return (
      <div>
        <small>
          <strong>Private bathroom&nbsp;</strong>
        </small>
        {bathroomDesc}
      </div>
    );
  };

  // Handles clicking of the next/previous page
  const clickHandler = (number: number) => {
    if (number === -1 && page > 0) {
      updatePage(page - 1);
    } else if (
      number === 1 &&
      rooms &&
      rooms.length - (page + 1) * perPage > 0
    ) {
      updatePage(page + 1);
    }
  };

  // Generates the description of the common room.
  const commonRooms = (room: ModelsDormRoom) => {
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
      <div>
        <small>
          <strong>Common room:&nbsp;</strong>
        </small>
        {crDesc}
      </div>
    );
  };

  // Generates descriptions for whether the beds are adjustable
  const adjustableBeds = (room: ModelsDormRoom) => {
    if (!room.bedAdjustable) return null;
    return (
      <div>
        <small>
          <strong>Adjustable bed:&nbsp;</strong>
        </small>
        {room.bedAdjustable ? "Yes" : "Unavailable"}
      </div>
    );
  };

  if (!rooms)
    return (
      <>
        {[...Array(perPage)].map((_, i) => (
          <div key={i}>
            {["15%", "12%", "25%", "13%", "30%"].map((width) => (
              <div key={width}>
                <Line width={width} />
              </div>
            ))}
            <br />
          </div>
        ))}
      </>
    );

  return (
    <>
      <PaginationButtons
        clickHandler={clickHandler}
        page={page}
        total={rooms.length}
        perPage={perPage}
      />
      {rooms.length > 0 && displayRooms
        ? displayRooms.map((room) => {
            return (
              <div key={room.number}>
                <strong>{`${room.number} (${room.roomType})`}</strong>
                <br />
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
                {(
                  [
                    "faces",
                    "noise",
                    "closet",
                    "flooring",
                  ] as (keyof typeof room)[]
                ).map((attr) => {
                  if (room[attr] !== undefined && room[attr] !== null) {
                    return (
                      <div key={attr}>
                        <small>
                          <strong>{`${capitalize(attr)}: `}</strong>
                        </small>
                        {room[attr]}
                      </div>
                    );
                  }

                  return null;
                })}
                {adjustableBeds(room)}
                {commonRooms(room)}
                {privateBathrooms(room)}
                <br />
              </div>
            );
          })
        : "No room-level information yet!"}
      <PaginationButtons
        clickHandler={clickHandler}
        page={page}
        total={rooms.length}
        perPage={perPage}
      />
    </>
  );
};

export default DormtrakRooms;
