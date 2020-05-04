// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux / Routing imports
import { connect } from "react-redux";
import { getAPI, getCurrUser } from "../../../selectors/auth";
import { createRouteNodeSelector, actions } from "redux-router5";

const DormtrakReviewForm = ({ api, route, navigateTo, currUser }) => {
  const [review, updateReview] = useState(null);

  const edit = route.name.split(".")[1] === "editReview";

  const [comment, updateComment] = useState("");
  const [bathroomDesc, updateBathroomDesc] = useState("");
  const [closet, updateCloset] = useState("");
  const [commonRoomDesc, updateCRoomDesc] = useState("");
  const [bedAdjustable, updateBed] = useState(null);
  const [commonRoomAccess, updateCRoomAccess] = useState(null);
  const [room, updateRoom] = useState(null);
  const [flooring, updateFlooring] = useState(null);
  const [keyOrCard, updateKoC] = useState(null);
  const [location, updateLocation] = useState(null);
  const [loudness, updateLoudness] = useState(null);
  const [noise, updateNoise] = useState("");
  const [privateBathroom, updatePBathroom] = useState(null);
  const [satisfaction, updateSatisfaction] = useState(null);
  const [thermostatAccess, updateThermostat] = useState(null);
  const [wifi, updateWifi] = useState(null);

  const [errors, updateErrors] = useState([]);

  const submitHandler = async (event) => {
    event.preventDefault();
    const reviewParams = {
      bathroomDesc,
      bedAdjustable,
      comment,
      closet,
      commonRoomAccess,
      commonRoomDesc,
      dormRoomID: room ? room.id : currUser.dormRoom.id,
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
      if (edit) {
        await api.dormtrakService.updateReview(review.id, reviewParams);
      } else {
        await api.dormtrakService.createReview(reviewParams);
      }
      navigateTo("dormtrak");
    } catch (error) {
      updateErrors(error.message);
    }
  };

  const reviewParam = route.params.reviewID;

  useEffect(() => {
    const loadReview = async (reviewID) => {
      try {
        const reviewResponse = await api.dormtrakService.getReview(reviewID);

        const reviewData = reviewResponse.data;

        updateComment(reviewData.comment);
        updateRoom(reviewData.dormRoom);
        updateReview(reviewData);
        updateBathroomDesc(reviewData.bathroomDesc);
        updateCloset(reviewData.closetDesc);
        updateCRoomAccess(reviewData.commonRoomAccess);
        updateCRoomDesc(reviewData.commonRoomDesc);
        updateBed(reviewData.bedAdjustable);
        updateFlooring(reviewData.flooring);
        updateKoC(reviewData.keyOrCard);
        updateLocation(reviewData.location);
        updateLoudness(reviewData.loudness);
        updateNoise(reviewData.noise);
        updatePBathroom(reviewData.privateBathroom);
        updateSatisfaction(reviewData.satisfaction);
        updateThermostat(reviewData.thermostatAccess);
        updateWifi(reviewData.wifi);
      } catch {
        // eslint-disable-next-line no-empty
      }
    };

    if (reviewParam) loadReview(reviewParam);
  }, [api, reviewParam]);

  // Generator for the various MCQ options
  const optionBuilder = (options, labels, type, changeHandler) => {
    return options.map((ans, index) => {
      return (
        <React.Fragment key={ans}>
          {labels[index]}
          &nbsp;
          <input
            type="radio"
            checked={type !== null ? type === ans : false}
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
          {` ${room.dorm.name} ${room.number}`}
        </h3>
      );
    }

    // If we're creating a new review, use the current User's room
    if (currUser.dormRoom && currUser.dormRoom.dorm) {
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
                {optionBuilder(
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
                {optionBuilder(
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
            {optionBuilder(
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
            {optionBuilder([1, 2, 3, 4, 5], [1, 2, 3, 4, 5], wifi, updateWifi)}
            <br />
            <br />
            <strong>Rate the loudness of this dorm:</strong>
            <br />
            (1 is the quietest, 5 is the loudest)
            <br />
            {optionBuilder(
              [1, 2, 3, 4, 5],
              [1, 2, 3, 4, 5],
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
            {optionBuilder(
              [1, 2, 3, 4, 5],
              [1, 2, 3, 4, 5],
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
            {optionBuilder(
              [1, 2, 3, 4, 5],
              [1, 2, 3, 4, 5],
              satisfaction,
              updateSatisfaction
            )}
            <br />
            <br />
            <strong>{`General commentary on ${
              room ? room.dorm.name : ""
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

DormtrakReviewForm.propTypes = {
  api: PropTypes.object.isRequired,
  currUser: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  route: PropTypes.object.isRequired,
};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("dormtrak.reviews");

  return (state) => ({
    api: getAPI(state),
    currUser: getCurrUser(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location) => dispatch(actions.navigateTo(location)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DormtrakReviewForm);
