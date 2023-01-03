// React Imports
import React, { useState, useEffect } from "react";
import { Line, Photo } from "../../Skeleton";

// Redux/ Routing imports
import { useAppSelector } from "../../../lib/store";
import { getCurrUser, getWSO } from "../../../lib/authSlice";
import { Link, useNavigate, useParams } from "react-router-dom";

// Additional Imports
import { userTypeStudent, userTypeAlumni } from "../../../constants/general";
import { ResponsesGetUserResponseUser } from "wso-api-client/lib/services/types";

const FacebookUser = () => {
  const wso = useAppSelector(getWSO);
  const currUser = useAppSelector(getCurrUser);

  const navigateTo = useNavigate();
  const params = useParams();

  const [viewPerson, updateTarget] = useState<
    ResponsesGetUserResponseUser | undefined
  >(undefined);
  const [userPhoto, updateUserPhoto] = useState("");

  useEffect(() => {
    const loadTarget = async () => {
      if (!params.userID) {
        navigateTo("/404", { replace: true });
        return;
      }
      const userID =
        params.userID === "me" ? params.userID : parseInt(params.userID, 10);
      try {
        const targetResponse = await wso.userService.getUser(userID);

        updateTarget(targetResponse.data);
        if (targetResponse.data?.unixID) {
          const photoResponse = await wso.userService.getUserLargePhoto(
            targetResponse.data.unixID
          );

          updateUserPhoto(URL.createObjectURL(photoResponse));
        }
      } catch (error) {
        // 1404 means user not at williams, 404 means user does not exist in DB
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const e = error as any;
        if (e.errorCode === 404) {
          navigateTo("/404", { replace: true });
          return;
        }
        if (e.errorCode === 1404) {
          navigateTo("/error", { replace: true, state: { error } });
          return;
        }
        updateUserPhoto("");
      }
    };

    loadTarget();
  }, [wso, params.userID]);

  // Returns the room/ office information of the user.
  const userRoom = () => {
    if (!viewPerson) {
      return (
        <>
          <h5>
            <Line width="10%" />
          </h5>
          <h4>
            <Line width="25%" />
          </h4>
          <br />
        </>
      );
    }
    if (
      viewPerson.type === userTypeStudent &&
      viewPerson.dormVisible &&
      viewPerson.dormRoom
    ) {
      return (
        <>
          <h5>Room:</h5>
          <h4>
            {viewPerson?.dormRoom?.dorm?.name} {viewPerson.dormRoom.number}
          </h4>
          <br />
        </>
      );
    }

    if (viewPerson.office) {
      return (
        <>
          <h5>Office:</h5>
          <h4>{viewPerson.office.number}</h4>
          <br />
        </>
      );
    }
    return null;
  };

  // Generates user's title
  const userTitle = () => {
    if (!viewPerson) return <Line width="10%" />;

    if (viewPerson.type === userTypeStudent) {
      return <h5>Student</h5>;
    }
    if (viewPerson.title) {
      return (
        <h5>
          {viewPerson.title}
          <br />
          {viewPerson.department && viewPerson.department.name}
        </h5>
      );
    }

    return null;
  };

  // Generates user's pronouns
  const userPronouns = () => {
    if (!viewPerson) {
      return (
        <h5>
          <Line width="30%" />
        </h5>
      );
    }

    if (viewPerson.pronoun) {
      return <h5>{`Pronouns: ${viewPerson.pronoun}`}</h5>;
    }
    return null;
  };

  // Generate user's unix
  const userUnix = () => {
    if (!viewPerson) {
      return (
        <>
          <h5>
            <Line width="10%" />
          </h5>
          <h4>
            <Line width="10%" />
          </h4>
          <br />
        </>
      );
    }

    if (viewPerson.unixID) {
      return (
        <>
          <h5>Williams Username:</h5>
          <h4>{viewPerson.unixID}</h4>
          <br />
        </>
      );
    }
    return null;
  };

  // Generate user's campus status
  const userCampusStatus = () => {
    if (!viewPerson) {
      return (
        <>
          <h5>
            <Line width="10%" />
          </h5>
          <h4>
            <Line width="10%" />
          </h4>
          <br />
        </>
      );
    }

    if (viewPerson.campusStatus) {
      return (
        <>
          <h5>Campus Status:</h5>
          <h4>{viewPerson.campusStatus}</h4>
          <br />
        </>
      );
    }
    return null;
  };

  // Generate user's tags
  const userTags = () => {
    if (!viewPerson) {
      return (
        <>
          <h5>
            <Line width="10%" />
          </h5>
          <h4>
            <Line width="30%" />
          </h4>
          <br />
        </>
      );
    }

    if (
      (viewPerson.type === userTypeStudent ||
        viewPerson.type === userTypeAlumni) &&
      viewPerson.tags
    ) {
      return (
        <>
          <h5>Tags:</h5>
          <ul>
            {viewPerson.tags.map((tag, index) => {
              return (
                <li className="view-tag" key={tag.name}>
                  <Link to={`/facebook?q=tag:${tag.name}`}>{tag.name}</Link>
                  {viewPerson?.tags?.length &&
                    index < viewPerson.tags.length - 1 && <span>,&nbsp;</span>}
                </li>
              );
            })}
          </ul>
          <br />
        </>
      );
    }
    return null;
  };

  // Generate user's su box
  const userSUBox = () => {
    if (!viewPerson) {
      return (
        <>
          <h5>
            <Line width="10%" />
          </h5>
          <h4>
            <Line width="25%" />
          </h4>
          <br />
        </>
      );
    }
    if (viewPerson.type === userTypeStudent) {
      return (
        <>
          <h5>SU Box:</h5>
          <h4>{viewPerson.suBox || "None listed"}</h4>
          <br />
        </>
      );
    }
    return null;
  };

  // Generate user's hometown
  const userHometown = () => {
    if (!viewPerson) {
      return (
        <>
          <h5>
            <Line width="20%" />
          </h5>
          <h4>
            <Line width="45%" />
          </h4>
          <br />
        </>
      );
    }
    if (
      viewPerson.homeVisible &&
      viewPerson.homeTown &&
      viewPerson.type === userTypeStudent
    ) {
      return (
        <>
          <h5>Hometown:</h5>
          <h4>
            {viewPerson.homeTown},&nbsp;
            {viewPerson.homeCountry === "United States"
              ? viewPerson.homeState
              : viewPerson.homeCountry}
          </h4>
        </>
      );
    }
    return null;
  };

  // Generates the user's class year
  const classYear = () => {
    if (!viewPerson?.classYear || viewPerson.type !== userTypeStudent)
      return "";
    if (viewPerson.offCycle) return `'${(viewPerson.classYear - 1) % 100}.5`;

    return `'${viewPerson.classYear % 100}`;
  };

  const picture = () => {
    if (userPhoto === undefined) return <Photo />;

    return <img src={userPhoto} alt="avatar" />;
  };

  const nameAndYear = () => {
    if (viewPerson) {
      return `${viewPerson.name} ${classYear()}`;
    }

    return <Line width="40%" />;
  };

  return (
    <article className="facebook-profile">
      <section>
        <aside className="picture">{picture()}</aside>

        <aside className="info">
          <h3>
            {nameAndYear()}
            {currUser && viewPerson && currUser.id === viewPerson.id && (
              <span>&nbsp;(me)</span>
            )}
          </h3>
          {userTitle()}
          {userPronouns()}
          <br />
          {userUnix()}
          {userCampusStatus()}
          {userTags()}
          {userSUBox()}
          {userRoom()}
          {userHometown()}
        </aside>
      </section>
    </article>
  );
};

export default FacebookUser;
