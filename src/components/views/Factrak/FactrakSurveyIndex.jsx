// React imports
import React, { useEffect, useState } from "react";
import FactrakComment from "./FactrakComment";

// Redux imports
import { useAppSelector } from "../../../lib/store";
import { getWSO, getCurrUser } from "../../../reducers/authSlice";
import { useNavigate } from "react-router-dom";

const FactrakSurveyIndex = () => {
  const currUser = useAppSelector(getCurrUser);
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();

  const [surveys, updateSurveys] = useState([]);

  useEffect(() => {
    const loadUserSurveys = async () => {
      const params = {
        userID: currUser.id,
        preload: ["professor", "course"],
        populateAgreements: true,
      };

      try {
        const userSurveyResponse = await wso.factrakService.listSurveys(params);

        updateSurveys(userSurveyResponse.data);
      } catch (error) {
        navigateTo("/error", { replace: true, state: { error } });
      }
    };

    loadUserSurveys();
  }, [currUser.id, wso]);

  return (
    <div className="article">
      <section>
        <article>
          {surveys.length > 0 ? (
            <>
              <h3>Your Reviews</h3>
              <br />
              <br />
              {surveys.map((survey) => (
                <FactrakComment
                  comment={survey}
                  showProf
                  abridged={false}
                  key={survey.id}
                />
              ))}
            </>
          ) : (
            <h1 className="no-matches-found">No reviews yet.</h1>
          )}
        </article>
      </section>
    </div>
  );
};

export default FactrakSurveyIndex;
