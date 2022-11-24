// React imports
import React from "react";
import { User } from "../../../lib/types";

// Generates the factrak survey deficit message if necessary
const FactrakDeficitMessage = ({ currUser }: { currUser: User | null }) => {
  if (
    currUser &&
    currUser.factrakSurveyDeficit &&
    currUser.factrakSurveyDeficit > 0
  ) {
    return (
      <>
        <strong>
          {`Write just ${currUser.factrakSurveyDeficit} reviews to
            make the blur go away!`}
        </strong>
        <br />
        To write a review, just search a prof&apos;s name directly above, or
        click a department on the left to see a list of profs in that
        department. Then click the link on the prof&apos;s page to write a
        review!
        <br />
        <br />
      </>
    );
  }

  return null;
};

export default FactrakDeficitMessage;
