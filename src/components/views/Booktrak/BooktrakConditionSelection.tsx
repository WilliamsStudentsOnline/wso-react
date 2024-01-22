import React from "react";
import {
  BookConditionEnumToString,
  BookConditionStringToEnum,
} from "./BooktrakUtils";
import { ModelsBookListing } from "wso-api-client/lib/services/types";

const BooktrakConditionSelection = ({
  condition,
  updateCondition,
}: {
  condition: ModelsBookListing.ConditionEnum;
  updateCondition: React.Dispatch<
    React.SetStateAction<ModelsBookListing.ConditionEnum>
  >;
}) => (
  <div>
    <select
      className="select-course-info"
      onChange={(event) => {
        updateCondition(BookConditionStringToEnum(event.target.value));
      }}
      value={BookConditionEnumToString(condition)}
    >
      <option value="" disabled hidden>
        Select book condition
      </option>
      <option value="Poor" key="Poor">
        Poor
      </option>
      <option value="Fair" key="Fair">
        Fair
      </option>
      <option value="Good" key="Good">
        Good
      </option>
      <option value="Very Good" key="Very Good">
        Very Good
      </option>
      <option value="Like New" key="Like New">
        Like New
      </option>
      <option value="New" key="New">
        New
      </option>
    </select>
  </div>
);

export default BooktrakConditionSelection;
