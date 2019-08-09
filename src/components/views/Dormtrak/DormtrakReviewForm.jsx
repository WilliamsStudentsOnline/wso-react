// React imports
import React from "react";
import PropTypes from "prop-types";

const DormtrakReviewForm = ({ authToken, dorm, review, room, edit }) => {
  const optionBuilder = (options, labels, type) => {
    return options.map((ans, index) => {
      return (
        <React.Fragment key={ans}>
          {labels[index]}
          &nbsp;
          <input
            type="radio"
            value={ans}
            name={`dormtrak_review[${type}]`}
            id={`dormtrak_review_${type}_${ans}`}
            defaultChecked={edit ? review[type] === ans : false}
          />
        </React.Fragment>
      );
    });
  };

  return (
    <>
      <strong>* Indicates a required field</strong>
      <br />
      <br />

      <form
        className={edit ? `edit_dormtrak_review` : "new_dormtrak_review"}
        id={edit ? `edit_dormtrak_review_${review.id}` : "new_dormtrak_review"}
        action={edit ? `/dormtrak/reviews/${review.id}` : "/dormtrak/reviews"}
        acceptCharset="UTF-8"
        method="post"
      >
        <input name="utf8" type="hidden" value="✓" />
        {edit ? <input type="hidden" name="_method" value="patch" /> : null}
        <input type="hidden" name="authenticity_token" value={authToken} />
        {review.errors.full_messages.length !== 0 ? (
          <div>
            {`${review.errors.full_messages.length} errors: `}
            <ul>
              {review.errors.map((error) => (
                <li key={error}>error</li>
              ))}
            </ul>
          </div>
        ) : null}
        {!room.room_type ? (
          <>
            <strong>*Single, double, or flex?</strong>
            <br />
            {optionBuilder(
              ["s", "d", "f"],
              ["Single", "Double", "Flex"],
              "room_type"
            )}

            <br />
            <br />
          </>
        ) : null}
        {!dorm.key_or_card ? (
          <>
            <strong>
              *Do you get in the room by keypad/card, or physical key?
            </strong>
            <br />
            {optionBuilder(
              ["Keypad/card", "Physical Key"],
              ["Keypad/Card", "Physical Key"],
              "key_or_card"
            )}
            <br />
            <br />
          </>
        ) : null}
        {!room.closet ? (
          <>
            <strong>*What was the closet like?</strong>
            <br />
            (size, shelving, wardrobe vs. built-in)
            <br />
            <textarea
              style={{ minHeight: "100px" }}
              placeholder="Closet Description.."
              name="dormtrak_review[closet]"
              id="dormtrak_review_closet"
              defaultValue={edit ? review.comment : ""}
            />
            <br />
            <br />
          </>
        ) : null}
        {!room.flooring ? (
          <>
            <strong>*What material was the flooring?</strong>
            <br />
            {optionBuilder(
              ["Tile", "Wood", "Carpet", "Other"],
              ["Tile", "Wood", "Carpet", "Other"],
              "flooring"
            )}
            <br />
            <br />
          </>
        ) : null}
        <strong>*Private bathroom?</strong>
        <br />
        {optionBuilder([1, 0], ["Yes", "No"], "private_bathroom")}
        <br />
        <strong>
          If you answered yes to the above, could you give a quick description
          of the bathroom?
        </strong>
        <br />
        (what things it has, quirks, etc)
        <br />
        <textarea
          style={{ minHeight: "100px" }}
          placeholder="Bathroom Description.."
          name="dormtrak_review[bathroom_desc]"
          id="dormtrak_review_bathroom_desc"
        />
        <br />
        <br />
        <strong>*Do you have a common room?</strong>
        <br />
        (Readily accessible and on the same floor as you)
        <br />
        {optionBuilder([1, 0], ["Yes", "No"], "common_room_access")}
        <br />
        {!room.common_room_desc ? (
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
              name="dormtrak_review[common_room_desc]"
              id="dormtrak_review_common_room_desc"
            />
            <br />
          </>
        ) : null}
        {!room.thermostat_access ? (
          <>
            {" "}
            <strong>*Is there a functional AND accessible thermostat?</strong>
            <br />
            {optionBuilder([1, 0], ["Yes", "No"], "thermostat_access")}
            <br />
            <br />
          </>
        ) : null}
        <strong>*Was the bed adjustable?</strong>
        <br />
        (without risers you brought)
        <br />
        {optionBuilder([1, 0], ["Yes", "No"], "bed_adjustable")}
        <br />
        <br />
        <strong>How good was wifi?</strong>
        <br />
        (1 is the worst, 5 is the best)
        <br />
        {optionBuilder([1, 2, 3, 4, 5], [1, 2, 3, 4, 5], "wifi")}
        <br />
        <br />
        <strong>Rate the loudness of this dorm:</strong>
        <br />
        (1 is the quietest, 5 is the loudest)
        <br />
        {optionBuilder([1, 2, 3, 4, 5], [1, 2, 3, 4, 5], "loudness")}
        <br />
        <strong>What are the main causes of the noise?</strong>
        <br />
        <textarea
          style={{ minHeight: "100px" }}
          placeholder="Share your thoughts, likes, dislikes, things to be aware of, etc..."
          name="dormtrak_review[noise]"
          id="dormtrak_review_noise"
          defaultValue={edit ? review.comment : ""}
        />
        <strong>How convenient was the location?</strong>
        <br />
        (1 is the worst, 5 is the best)
        <br />
        {optionBuilder([1, 2, 3, 4, 5], [1, 2, 3, 4, 5], "location")}
        <br />
        <br />
        <strong>
          Rate your overall satisfaction with your living situation this year:
        </strong>
        <br />
        (1 is the worst, 5 is the best)
        <br />
        {optionBuilder([1, 2, 3, 4, 5], [1, 2, 3, 4, 5], "satisfaction")}
        <br />
        <br />
        <strong>{`General commentary on ${dorm.name} itself:`}</strong>
        <br />
        (not your room!)
        <br />
        <textarea
          style={{ minHeight: "100px" }}
          placeholder="Share your thoughts, likes, dislikes, things to be aware of, etc..."
          name="dormtrak_review[comment]"
          id="dormtrak_review_comment"
          defaultValue={edit ? review.comment : ""}
        />
        <br />
        <br />
        <strong>*Anonymous?</strong>
        <br />
        (this will hide your common room and noise comments, if any, until next
        school year)
        <br />
        Yes&nbsp;
        <input
          type="radio"
          value={1}
          name="dormtrak_review[anonymous]"
          id="dormtrak_review_anonymous_1"
        />
        No &nbsp;
        <input
          type="radio"
          value={0}
          name="dormtrak_review[anonymous]"
          id="dormtrak_review_anonymous_0"
          defaultChecked
        />
        <br />
        <br />
        <input
          type="submit"
          name="commit"
          value={edit ? "Update" : "Save"}
          id="submit-survey"
          data-disable-with="Save"
        />
      </form>
    </>
  );
};

DormtrakReviewForm.propTypes = {
  authToken: PropTypes.string.isRequired,
  review: PropTypes.object.isRequired,
  dorm: PropTypes.object.isRequired,
  room: PropTypes.object.isRequired,
  edit: PropTypes.bool.isRequired,
};

export default DormtrakReviewForm;
