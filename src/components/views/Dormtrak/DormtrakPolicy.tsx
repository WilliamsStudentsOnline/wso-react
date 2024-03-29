// React imports
import React, { useEffect, useState } from "react";

// Redux/ Routing imports
import { useAppSelector } from "../../../lib/store";
import { getWSO, getCurrUser } from "../../../lib/authSlice";
import { useNavigate } from "react-router-dom";

const DormtrakPolicy = () => {
  const currUser = useAppSelector(getCurrUser);
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();

  const [acceptPolicy, updateAcceptPolicy] = useState(false);
  const [updated, setUpdated] = useState(false);

  const clickHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    updateAcceptPolicy(event.target.checked);
  };

  const submitHandler: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();

    const updateParams = {
      hasAcceptedDormtrakPolicy: acceptPolicy,
    };
    try {
      await wso.userService.updateUser("me", updateParams);
      setUpdated(true);
    } catch (error) {
      navigateTo("/error", { replace: true, state: error });
    }
  };

  // Wait until the api handler is updated before navigating!
  useEffect(() => {
    let isMounted = true;
    if (updated && isMounted) {
      navigateTo("dormtrak", { replace: true });
    }

    return () => {
      isMounted = false;
    };
  }, [updated, wso]);

  return (
    <div className="article">
      <section>
        <article>
          <h3>Policy</h3>
          {!currUser?.hasAcceptedDormtrakPolicy && (
            <p className="intro-paragraph">
              To proceed, read the policy below, then click Agree
            </p>
          )}

          <br />

          <p>
            Comments should be true, and based on personal experience. You can
            only review your current room and building, but that may change in
            the future.
          </p>
          <p>
            Currently, we do not have enough information on Co-op or First-year
            housing to make them available.
          </p>
          <p>
            When you post a review, you&apos;ll see an option for making it
            anonymous. If you choose to make your review anonymous, we will hide
            both your noise and general comment until the next school year.
          </p>
          <p>
            While Dormtrak is designed to be as open as possible, inappropriate
            comments will not be tolerated, and comments can be removed or
            edited at the discretion of the student moderator to bring them into
            accordance with this policy. Inappropriate comments include, but are
            not limited to, comments that name other students, that contain
            racial or ethnic slurs, and those that harass others. Spamming a
            building or room with incorrect information, for example in an
            effort to dissuade others from potentially choosing that dorm, will
            result in being banned from further use of Dormtrak.
          </p>
          <p>
            You are allowed a max of one review per room. You can edit and
            delete your reviews, but when you delete your review we hold onto
            some of the statistical information you provide us (like whether or
            not your room has a keypad to get in).
          </p>
          <p>By using Dormtrak, you agree to abide by this policy.</p>

          {currUser?.hasAcceptedDormtrakPolicy ? (
            <p>
              <b>You have already accepted the Dormtrak policy.</b>
            </p>
          ) : (
            <form onSubmit={(event) => submitHandler(event)}>
              <p>
                <input
                  type="checkbox"
                  id="accept"
                  onChange={(event) => clickHandler(event)}
                />
                I agree to the Dormtrak policy.
              </p>
              <input
                type="submit"
                value="continue"
                data-disable-with="continue"
              />
            </form>
          )}
          <br />
          <br />
        </article>
      </section>
    </div>
  );
};

export default DormtrakPolicy;
