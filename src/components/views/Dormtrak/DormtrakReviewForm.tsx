// React imports
import React, { useState, useEffect } from "react";

// Redux / Routing imports
import { useAppSelector } from "../../../lib/store";
import { getWSO, getCurrUser } from "../../../lib/authSlice";
import { useNavigate, useParams } from "react-router-dom";
import {
  DormtrakReviewCreateParams,
  ModelsDormRoom,
  ModelsDormtrakReview,
} from "wso-api-client/lib/services/types";

const DormtrakReviewForm = ({ edit }: { edit: boolean }) => {
  const currUser = useAppSelector(getCurrUser);
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();
  const params = useParams();

  const [review, updateReview] = useState<ModelsDormtrakReview | undefined>(
    undefined
  );

  const [comment, updateComment] = useState<string | undefined>(undefined);
  const [bathroomDesc, updateBathroomDesc] = useState<string | undefined>("");
  const [closet, updateCloset] = useState<string | undefined>("");
  const [commonRoomDesc, updateCRoomDesc] = useState<string | undefined>("");
  const [bedAdjustable, updateBed] = useState<boolean | undefined>(undefined);
  const [commonRoomAccess, updateCRoomAccess] = useState<boolean | undefined>(
    undefined
  );
  const [room, updateRoom] = useState<ModelsDormRoom | undefined>(undefined);
  const [flooring, updateFlooring] = useState<string | undefined>("");
  const [keyOrCard, updateKoC] = useState<string | undefined>("");
  const [location, updateLocation] = useState<number | undefined>(undefined);
  const [loudness, updateLoudness] = useState<number | undefined>(undefined);
  const [noise, updateNoise] = useState<string | undefined>("");
  const [privateBathroom, updatePBathroom] = useState<boolean | undefined>(
    undefined
  );
  const [satisfaction, updateSatisfaction] = useState<number | undefined>(
    undefined
  );
  const [thermostatAccess, updateThermostat] = useState<boolean | undefined>(
    undefined
  );
  const [wifi, updateWifi] = useState<number | undefined>(undefined);

  const [errors, updateErrors] = useState<string[]>([]);

  const submitHandler: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();
    const reviewParams = {
      bathroomDesc,
      bedAdjustable,
      comment,
      closet,
      commonRoomAccess,
      commonRoomDesc,
      flooring,
      keyOrCard,
      location,
      loudness,
      noise,
      privateBathroom,
      satisfaction,
      thermostatAccess,
      wifi,
    };

    try {
      if (edit && review?.id) {
        await wso.dormtrakService.updateReview(review.id, reviewParams);
      } else {
        const dormRoomID = room ? room.id : currUser?.dormRoomID;
        if (dormRoomID) {
          const createParams: DormtrakReviewCreateParams = {
            ...reviewParams,
            dormRoomID,
          };
          await wso.dormtrakService.createReview(createParams);
        }
      }
      navigateTo("/dormtrak");
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateErrors([(error as any).message]);
    }
  };

  const reviewParam = params?.reviewID;

  useEffect(() => {
    const loadReview = async (reviewID: number) => {
      try {
        const reviewResponse = await wso.dormtrakService.getReview(reviewID);

        const reviewData = reviewResponse.data;

        // TODO: some of them might be null, consider or with empty string
        updateComment(reviewData?.comment);
        updateRoom(reviewData?.dormRoom);
        updateReview(reviewData);
        updateBathroomDesc(reviewData?.bathroomDesc);
        updateCloset(reviewData?.closet);
        updateCRoomAccess(reviewData?.commonRoomAccess);
        updateCRoomDesc(reviewData?.commonRoomDesc);
        updateBed(reviewData?.bedAdjustable);
        updateFlooring(reviewData?.flooring);
        updateKoC(reviewData?.keyOrCard);
        updateLocation(reviewData?.location);
        updateLoudness(reviewData?.loudness);
        updateNoise(reviewData?.noise);
        updatePBathroom(reviewData?.privateBathroom);
        updateSatisfaction(reviewData?.satisfaction);
        updateThermostat(reviewData?.thermostatAccess);
        updateWifi(reviewData?.wifi);
      } catch (error) {
        navigateTo("/error", { replace: true, state: error });
      }
    };

    if (reviewParam) loadReview(parseInt(reviewParam, 10));
  }, [reviewParam, wso]);

  // Generator for the various MCQ options
  const optionBuilder: <T>(
    options: T[],
    labels: string[],
    type: T | undefined,
    changeHandler: React.Dispatch<React.SetStateAction<T | undefined>>
  ) => JSX.Element[] = (options, labels, type, changeHandler) => {
    return options.map((ans, index) => {
      return (
        <React.Fragment key={index}>
          {labels[index]}
          &nbsp;
          <input
            type="radio"
            checked={type !== undefined ? type === ans : false}
            onChange={() => changeHandler(ans)}
          />
        </React.Fragment>
      );
    });
  };

  // Generates the title for the review
  const reviewTitle = () => {
    // If we're editing a review and the room is already loaded.
    if (edit && room) {
      return (
        <h3>
          Editing review on
          {` ${room.dorm?.name} ${room.number}`}
        </h3>
      );
    }

    // If we're creating a new review, use the current User's room
    if (currUser?.dormRoom && currUser.dormRoom.dorm) {
      return (
        <h3>{`Review of ${currUser.dormRoom.dorm.name} ${currUser.dormRoom.number}`}</h3>
      );
    }

    return null;
  };

  return (
    <div className="article">
      <section>
        <article>
          {reviewTitle()}
          <strong>* Indicates a required field</strong>
          <br />
          <br />

          <form onSubmit={(event) => submitHandler(event)}>
            {errors.length !== 0 ? (
              <div>
                {`${errors.length} errors: `}
                <ul>
                  {errors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {!(room && room.dorm && room.dorm.keyOrCard) ? (
              <>
                <strong>
                  *Do you get in the room by keypad/card, or physical key?
                </strong>
                <br />
                {optionBuilder<string>(
                  ["Keypad/Card", "Physical Key"],
                  ["Keypad/Card", "Physical Key"],
                  keyOrCard,
                  updateKoC
                )}
                <br />
                <br />
              </>
            ) : null}
            {!(room && room.closet) ? (
              <>
                <strong>*What was the closet like?</strong>
                <br />
                (size, shelving, wardrobe vs. built-in)
                <br />
                <textarea
                  style={{ minHeight: "100px" }}
                  placeholder="Closet Description.."
                  value={closet}
                  onChange={(event) => updateCloset(event.target.value)}
                />
                <br />
                <br />
              </>
            ) : null}
            {!(room && room.flooring) ? (
              <>
                <strong>*What material was the flooring?</strong>
                <br />
                {optionBuilder<string>(
                  ["Tile", "Wood", "Carpet", "Other"],
                  ["Tile", "Wood", "Carpet", "Other"],
                  flooring,
                  updateFlooring
                )}
                <br />
                <br />
              </>
            ) : null}
            <strong>*Private bathroom?</strong>
            <br />
            {optionBuilder<boolean>(
              [true, false],
              ["Yes", "No"],
              privateBathroom,
              updatePBathroom
            )}
            <br />
            <strong>
              If you answered yes to the above, could you give a quick
              description of the bathroom?
            </strong>
            <br />
            (what things it has, quirks, etc)
            <br />
            <textarea
              style={{ minHeight: "100px" }}
              placeholder="Bathroom Description.."
              value={bathroomDesc}
              onChange={(event) => updateBathroomDesc(event.target.value)}
            />
            <br />
            <br />
            <strong>*Do you have a common room?</strong>
            <br />
            (Readily accessible and on the same floor as you)
            <br />
            {optionBuilder(
              [true, false],
              ["Yes", "No"],
              commonRoomAccess,
              updateCRoomAccess
            )}
            <br />
            {!(room && room.commonRoomDesc) ? (
              <>
                <strong>
                  If you answered yes to the above, could you give a quick
                  description of the common room?
                </strong>
                <br />
                (e.g. furniture, whether it was shared with another suite, etc.)
                <br />
                <textarea
                  style={{ minHeight: "100px" }}
                  placeholder="Common Room Description.."
                  value={commonRoomDesc}
                  onChange={(event) => updateCRoomDesc(event.target.value)}
                />
                <br />
                <br />
              </>
            ) : null}
            {!(room && room.thermostatAccess) ? (
              <>
                <strong>
                  *Is there a functional AND accessible thermostat?
                </strong>
                <br />
                {optionBuilder(
                  [true, false],
                  ["Yes", "No"],
                  thermostatAccess,
                  updateThermostat
                )}
                <br />
                <br />
              </>
            ) : null}
            <strong>*Was the bed adjustable?</strong>
            <br />
            (without risers you brought)
            <br />
            {optionBuilder(
              [true, false],
              ["Yes", "No"],
              bedAdjustable,
              updateBed
            )}
            <br />
            <br />
            <strong>How good was wifi?</strong>
            <br />
            (1 is the worst, 5 is the best)
            <br />
            {optionBuilder(
              [1, 2, 3, 4, 5],
              ["1", "2", "3", "4", "5"],
              wifi,
              updateWifi
            )}
            <br />
            <br />
            <strong>Rate the loudness of this dorm:</strong>
            <br />
            (1 is the quietest, 5 is the loudest)
            <br />
            {optionBuilder<number>(
              [1, 2, 3, 4, 5],
              ["1", "2", "3", "4", "5"],
              loudness,
              updateLoudness
            )}
            <br />
            <strong>What are the main causes of the noise?</strong>
            <br />
            <textarea
              style={{ minHeight: "100px" }}
              placeholder="Share what you thought were the main causes of noise!"
              value={noise}
              onChange={(event) => updateNoise(event.target.value)}
            />
            <strong>How convenient was the location?</strong>
            <br />
            (1 is the worst, 5 is the best)
            <br />
            {optionBuilder<number>(
              [1, 2, 3, 4, 5],
              ["1", "2", "3", "4", "5"],
              location,
              updateLocation
            )}
            <br />
            <br />
            <strong>
              Rate your overall satisfaction with your living situation this
              year:
            </strong>
            <br />
            (1 is the worst, 5 is the best)
            <br />
            {optionBuilder<number>(
              [1, 2, 3, 4, 5],
              ["1", "2", "3", "4", "5"],
              satisfaction,
              updateSatisfaction
            )}
            <br />
            <br />
            <strong>{`General commentary on ${
              room ? room.dorm?.name : ""
            } itself:`}</strong>
            <br />
            (not just your room!)
            <br />
            <textarea
              style={{ minHeight: "100px" }}
              placeholder="Share your thoughts, likes, dislikes, things to be aware of, etc..."
              value={comment}
              onChange={(event) => updateComment(event.target.value)}
            />
            <br />
            <br />
            <input
              type="submit"
              value={edit ? "Update" : "Save"}
              id="submit-survey"
              data-disable-with="Save"
            />
          </form>
          <br />
          <br />
        </article>
      </section>
    </div>
  );
};

export default DormtrakReviewForm;
