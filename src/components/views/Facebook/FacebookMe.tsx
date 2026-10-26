import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { CircularLoader, Photo } from "../../ui";
import { useAppDispatch, useAppSelector } from "../../../lib/store";
import { getCurrUser, getWSO, updateUser } from "../../../lib/authSlice";
import { userTypeAlumni, userTypeStudent } from "../../../constants/general";
import { ResponsesGetUserResponseUser } from "wso-api-client/lib/services/types";
import TagEdit from "../../TagEdit";
import "./FacebookMe.css";

const showAlert = (message: string) => {
  // eslint-disable-next-line no-alert
  window.alert(message);
};

const errorMessage = (error: unknown, fallback: string) => {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message) return message;
  }
  return fallback;
};

const FacebookMe = () => {
  const dispatch = useAppDispatch();
  const currUser = useAppSelector(getCurrUser);
  const wso = useAppSelector(getWSO);

  const [profile, setProfile] = useState<
    ResponsesGetUserResponseUser | undefined
  >(undefined);
  const [tags, updateTags] = useState<string[]>([]);
  const [visible, setVisible] = useState(currUser?.visible);
  const [homeVisible, setHomeVisible] = useState(currUser?.homeVisible);
  const [offCycle, setOffCycle] = useState(currUser?.offCycle);

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [submitting, updateSubmitting] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setVisible(currUser?.visible);
    setHomeVisible(currUser?.homeVisible);
    setOffCycle(currUser?.offCycle);
  }, [currUser]);

  useEffect(() => {
    let isMounted = true;
    let objectUrl: string | undefined;

    const load = async () => {
      try {
        const userResponse = await wso.userService.getUser("me");
        const data = userResponse.data;
        if (!isMounted || !data) return;

        setProfile(data);
        updateTags((data.tags ?? []).map((tag) => tag.name ?? ""));

        if (data.unixID) {
          try {
            const photoResponse = await wso.userService.getUserLargePhoto(
              data.unixID
            );
            objectUrl = URL.createObjectURL(photoResponse);
            if (isMounted) setPhotoUrl(objectUrl);
          } catch {
            if (isMounted) setPhotoUrl(null);
          }
        }
      } catch (error) {
        if (isMounted) showAlert(errorMessage(error, "Failed to load profile"));
      }
    };

    load();
    return () => {
      isMounted = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [wso]);

  const onPickPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoUrl((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  const submitHandler: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();
    updateSubmitting(true);

    try {
      if (photoFile) {
        await wso.userService.updateUserPhoto("me", photoFile);
      }

      const updateResponse = await wso.userService.updateUser("me", {
        homeVisible,
        offCycle,
        visible,
      });

      dispatch(updateUser(updateResponse.data));
      if (updateResponse.data) {
        setProfile((prev) =>
          prev ? { ...prev, ...updateResponse.data } : updateResponse.data
        );
      }
      setPhotoFile(null);
    } catch (error) {
      showAlert(errorMessage(error, "Failed to save changes"));
    } finally {
      updateSubmitting(false);
    }
  };

  if (!currUser) {
    return <Navigate to="/facebook" replace />;
  }

  const classYear = () => {
    if (!profile?.classYear || profile.type !== userTypeStudent) return "";
    if (offCycle) return `'${(profile.classYear - 1) % 100}.5`;
    return `'${profile.classYear % 100}`;
  };

  const showHometown =
    Boolean(homeVisible) &&
    Boolean(profile?.homeTown) &&
    profile?.type === userTypeStudent;

  const showTags =
    currUser.type === userTypeAlumni || currUser.type === userTypeStudent;

  return (
    <div className="facebook-me">
      <article
        className={`facebook-profile facebook-me__preview${
          visible ? "" : " facebook-me__preview--hidden"
        }`}
      >
        <section>
          <aside className="picture">
            <div className="facebook-me__avatar">
              {photoUrl ? <img src={photoUrl} alt="avatar" /> : <Photo />}
              <button
                type="button"
                className="facebook-me__avatar-edit"
                aria-label="Change profile picture"
                onClick={() => fileRef.current?.click()}
              >
                <span className="material-icons" aria-hidden>
                  edit
                </span>
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="facebook-me__file"
                onChange={onPickPhoto}
              />
            </div>
          </aside>

          <aside className="info">
            <h3>
              {profile?.name ?? "…"} {classYear()}
              <span>&nbsp;(me)</span>
            </h3>
            {profile?.type === userTypeStudent ? <h5>Student</h5> : null}
            <br />
            {profile?.unixID ? (
              <>
                <h5>Williams Username:</h5>
                <h4>{profile.unixID}</h4>
                <br />
              </>
            ) : null}
            {profile?.campusStatus ? (
              <>
                <h5>Campus Status:</h5>
                <h4>{profile.campusStatus}</h4>
                <br />
              </>
            ) : null}
            {(profile?.type === userTypeStudent ||
              profile?.type === userTypeAlumni) &&
              tags.length > 0 && (
                <>
                  <h5>Tags:</h5>
                  <ul>
                    {tags.map((tag, index) => (
                      <li className="view-tag" key={tag}>
                        <Link to={`/facebook?q=tag:${tag}`}>{tag}</Link>
                        {index < tags.length - 1 && <span>,&nbsp;</span>}
                      </li>
                    ))}
                  </ul>
                  <br />
                </>
              )}
            {profile?.type === userTypeStudent ? (
              <>
                <h5>SU Box:</h5>
                <h4>{profile.suBox || "None listed"}</h4>
                <br />
              </>
            ) : null}
            {showHometown ? (
              <>
                <h5>Hometown:</h5>
                <h4>
                  {profile?.homeTown},&nbsp;
                  {profile?.homeCountry === "United States"
                    ? profile?.homeState
                    : profile?.homeCountry}
                </h4>
              </>
            ) : null}
          </aside>
        </section>
      </article>

      <form className="facebook-me__form" onSubmit={submitHandler}>
        <div
          className={`facebook-me__columns${
            showTags ? "" : " facebook-me__columns--prefs-only"
          }`}
        >
          {showTags ? (
            <div className="facebook-me__block">
              <h3>Tags</h3>
              <TagEdit
                tags={tags}
                updateTags={updateTags}
                updateErrors={(msgs) => {
                  if (msgs?.[0]) showAlert(msgs[0]);
                }}
                wso={wso}
              />
            </div>
          ) : null}

          <div className="facebook-me__block">
            <h3>Preferences</h3>
            <div className="facebook-me__prefs">
              <div className="facebook-me__pref">
                <span className="facebook-me__pref-label">
                  Facebook profile
                </span>
                <div className="facebook-me__pref-choices">
                  <label>
                    <input
                      type="radio"
                      checked={Boolean(visible)}
                      onChange={() => setVisible(true)}
                    />
                    Show
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={!visible}
                      onChange={() => setVisible(false)}
                    />
                    Hide
                  </label>
                </div>
              </div>

              <div className="facebook-me__pref">
                <span className="facebook-me__pref-label">Hometown</span>
                <div className="facebook-me__pref-choices">
                  <label>
                    <input
                      type="radio"
                      checked={Boolean(homeVisible)}
                      onChange={() => setHomeVisible(true)}
                    />
                    Show
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={!homeVisible}
                      onChange={() => setHomeVisible(false)}
                    />
                    Hide
                  </label>
                </div>
              </div>

              {currUser.type === userTypeStudent ? (
                <label className="facebook-me__check">
                  <input
                    type="checkbox"
                    checked={Boolean(offCycle)}
                    onChange={() => setOffCycle(!offCycle)}
                  />
                  Off cycle (subtracts 0.5 from class year)
                </label>
              ) : null}
            </div>
          </div>
        </div>

        <div className="facebook-me__actions">
          {submitting ? (
            <CircularLoader diameter="40px" />
          ) : (
            <input type="submit" value="Save changes" />
          )}
        </div>
      </form>
    </div>
  );
};

export default FacebookMe;
