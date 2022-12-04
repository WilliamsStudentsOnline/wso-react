// React imports
import React, { useState, useEffect } from "react";

// Redux/routing imports
import { useAppSelector } from "../../../lib/store";
import { getWSO } from "../../../lib/authSlice";
import { useNavigate } from "react-router-dom";

// Page created to handle both opting in and out.
const EphmatchOptOut = () => {
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();

  // Note that this is different from Ephcatch
  const [optOut, updateOptOut] = useState(false);

  useEffect(() => {
    let isMounted = true;
    // Check if there is an ephmatch profile for the user
    const loadEphmatchProfile = async () => {
      try {
        const ownProfile = await wso.ephmatchService.getSelfProfile();
        if (isMounted) {
          updateOptOut(ownProfile.deleted);
        }
      } catch (error) {
        // There shouldn't be any reason for the submission to be rejected.
        navigateTo("/error", { replace: true, state: { error } });
      }
    };

    loadEphmatchProfile();

    return () => {
      isMounted = false;
    };
  }, [wso]);

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      await wso.ephmatchService.deleteSelfProfile();
      // Update succeeded -> redirect them to main ephmatch page.
      navigateTo("/ephmatch", { replace: true });
    } catch (error) {
      // There shouldn't be any reason for the submission to be rejected.
      navigateTo("/error", { replace: true, state: { error } });
    }
  };

  return (
    <div className="article">
      <section>
        <article>
          <p>
            Ephmatch is an exclusive feature for a limited time created to spark
            encounters between yourself and other Ephs. Choosing to opt out
            means you cannot select fellow Ephs or view matches. Your picture
            and name will also not be shown to other users. You may opt back in
            at anytime.
            <br />
          </p>
          <br />

          <form onSubmit={submitHandler}>
            <h3>Opting Out</h3>
            <br />
            <b>
              This is entirely optional - we respect your wishes, and you will
              not be added into the Ephmatch system should you choose to opt
              out.
            </b>
            <br />
            <br />
            <input
              type="checkbox"
              onChange={(event) => updateOptOut(event.target.checked)}
              defaultChecked={optOut}
            />
            I want to opt out of Ephmatch.
            <br />
            <br />
            <br />
            <input
              type="submit"
              value="Save"
              data-disable-with="Save"
              disabled={!optOut}
            />
          </form>
        </article>
      </section>
    </div>
  );
};

export default EphmatchOptOut;
