import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { CircularLoader, Photo } from "../../ui";
import { useAppDispatch, useAppSelector } from "../../../lib/store";
import { getCurrUser, getWSO, updateUser } from "../../../lib/authSlice";
import { userTypeAlumni, userTypeStudent } from "../../../constants/general";
import { ResponsesGetUserResponseUser } from "wso-api-client/lib/services/types";
import TagEdit from "../../TagEdit";
import "./FacebookMe.css";

const PEOPLESOFT_URL = "https://sarah.williams.edu";
const PEOPLESOFT_URL_HINT = "See on PeopleSoft";
const PEOPLESOFT_PRONOUN_PLACEHOLDER =
  "We'll fetch these from PeopleSoft when you save";

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

const isUnitedStates = (country?: string | null) =>
  ["united states", "united states of america", "us", "usa"].includes(
    (country ?? "").trim().toLowerCase()
  );

const formatHomeLocation = (user?: ResponsesGetUserResponseUser) => {
  const city = user?.homeTown?.trim();
  if (!user || !city) return "";

  const region = isUnitedStates(user.homeCountry)
    ? user.homeState?.trim()
    : user.homeCountry?.trim();
  return region ? `${city}, ${region}` : city;
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
  const [homeTown, setHomeTown] = useState("");
  const [homeState, setHomeState] = useState("");
  const [homeCountry, setHomeCountry] = useState("");
  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [homeLocationError, setHomeLocationError] = useState("");
  const [offCycle, setOffCycle] = useState(currUser?.offCycle);
  const [pronounOverride, setPronounOverride] = useState("");
  const [peopleSoftPronoun, setPeopleSoftPronoun] = useState("");
  const [savedVisible, setSavedVisible] = useState(currUser?.visible);
  const [savedHomeVisible, setSavedHomeVisible] = useState(
    currUser?.homeVisible
  );
  const [savedHomeTown, setSavedHomeTown] = useState("");
  const [savedHomeState, setSavedHomeState] = useState("");
  const [savedHomeCountry, setSavedHomeCountry] = useState("");
  const [savedOffCycle, setSavedOffCycle] = useState(currUser?.offCycle);
  const [savedPronounOverride, setSavedPronounOverride] = useState("");

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [submitting, updateSubmitting] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isMounted = true;
    let objectUrl: string | undefined;

    const load = async () => {
      try {
        const countriesResponse = await wso.api.request(
          "get",
          "/api/v2/users/countries"
        );
        if (isMounted) setCountries(countriesResponse.data ?? []);
      } catch {
        if (isMounted) setCountries([]);
      }
      try {
        const statesResponse = await wso.api.request(
          "get",
          "/api/v2/users/states"
        );
        if (isMounted) setStates(statesResponse.data ?? []);
      } catch {
        if (isMounted) setStates([]);
      }

      try {
        const userResponse = await wso.userService.getUser("me");
        const data = userResponse.data;
        if (!isMounted || !data) return;

        const override = data.pronounOverride ?? "";
        setProfile(data);
        setPronounOverride(override);
        setSavedPronounOverride(override);
        setPeopleSoftPronoun(override ? "" : data.pronoun ?? "");
        setVisible(data.visible);
        setHomeVisible(data.homeVisible);
        setHomeTown(data.homeTown ?? "");
        setHomeState(data.homeState ?? "");
        setHomeCountry(data.homeCountry ?? "");
        setOffCycle(data.offCycle);
        setSavedVisible(data.visible);
        setSavedHomeVisible(data.homeVisible);
        setSavedHomeTown(data.homeTown ?? "");
        setSavedHomeState(data.homeState ?? "");
        setSavedHomeCountry(data.homeCountry ?? "");
        setSavedOffCycle(data.offCycle);
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
      const city = homeTown.trim();
      const typedCountry = homeCountry.trim();
      const matchedCountry = countries.find(
        (candidate) => candidate.toLowerCase() === typedCountry.toLowerCase()
      );
      const country = matchedCountry ?? typedCountry;
      const isUS = isUnitedStates(country);
      const typedState = isUS ? homeState.trim() : "";
      const matchedState = states.find(
        (candidate) => candidate.toLowerCase() === typedState.toLowerCase()
      );
      const state = matchedState ?? typedState;
      const locationParts = [city, state, country];

      if (locationParts.some((part) => part.length > 255)) {
        setHomeLocationError(
          "City, state, and country must be 255 characters or fewer."
        );
        return;
      }
      if (city && isUS && !state) {
        setHomeLocationError("Enter a state for a U.S. hometown.");
        return;
      }
      if (city && !country) {
        setHomeLocationError("Enter a country for an international hometown.");
        return;
      }
      if (city && !matchedCountry) {
        setHomeLocationError("Choose a country from the matching suggestions.");
        return;
      }
      if (city && isUS && !matchedState) {
        setHomeLocationError("Choose a state from the matching suggestions.");
        return;
      }
      setHomeLocationError("");

      if (photoFile) {
        await wso.userService.updateUserPhoto("me", photoFile);
      }

      const trimmed = pronounOverride.trim();
      const updateParams: Parameters<typeof wso.userService.updateUser>[1] = {
        homeVisible,
        homeTown: city,
        homeState: city ? state : "",
        homeCountry: city ? country : "",
        offCycle,
        visible,
        pronounOverride: trimmed === "" ? (null as unknown as string) : trimmed,
      };
      const updateResponse = await wso.userService.updateUser(
        "me",
        updateParams
      );

      dispatch(updateUser(updateResponse.data));
      if (updateResponse.data) {
        const next = updateResponse.data;
        const nextOverride = next.pronounOverride ?? "";
        setProfile((prev) => (prev ? { ...prev, ...next } : next));
        setPronounOverride(nextOverride);
        setSavedPronounOverride(nextOverride);
        if (!nextOverride) {
          setPeopleSoftPronoun(next.pronoun ?? "");
        }
        setVisible(next.visible);
        setHomeVisible(next.homeVisible);
        setHomeTown(next.homeTown ?? "");
        setHomeState(next.homeState ?? "");
        setHomeCountry(next.homeCountry ?? "");
        setOffCycle(next.offCycle);
        setSavedVisible(next.visible);
        setSavedHomeVisible(next.homeVisible);
        setSavedHomeTown(next.homeTown ?? "");
        setSavedHomeState(next.homeState ?? "");
        setSavedHomeCountry(next.homeCountry ?? "");
        setSavedOffCycle(next.offCycle);
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

  const trimmedPronounOverride = pronounOverride.trim();
  const previewPronoun = trimmedPronounOverride || peopleSoftPronoun;
  const pronounPlaceholder =
    peopleSoftPronoun || PEOPLESOFT_PRONOUN_PLACEHOLDER;

  const hasUnsavedChanges =
    Boolean(photoFile) ||
    Boolean(visible) !== Boolean(savedVisible) ||
    Boolean(homeVisible) !== Boolean(savedHomeVisible) ||
    homeTown.trim() !== savedHomeTown.trim() ||
    homeState.trim() !== savedHomeState.trim() ||
    homeCountry.trim() !== savedHomeCountry.trim() ||
    Boolean(offCycle) !== Boolean(savedOffCycle) ||
    trimmedPronounOverride !== (savedPronounOverride ?? "").trim();

  const pronounsField = (
    <>
      <h3 className={showTags ? "facebook-me__pronouns-heading" : undefined}>
        Pronouns
      </h3>
      <input
        type="text"
        className="facebook-me__pronoun-input"
        value={pronounOverride}
        placeholder={pronounPlaceholder}
        onChange={(event) => setPronounOverride(event.target.value)}
        aria-label="Pronouns"
      />
    </>
  );

  return (
    <div className="facebook-me">
      <article
        className={`facebook-profile facebook-me__preview${
          visible ? "" : " facebook-me__preview--hidden"
        }${hasUnsavedChanges ? " facebook-me__preview--unsaved" : ""}`}
      >
        <section>
          {hasUnsavedChanges ? (
            <span
              className="facebook-me__unsaved"
              title="Unsaved changes"
              aria-label="Unsaved changes"
            >
              *
            </span>
          ) : null}
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
            <h5>
              Pronouns:{" "}
              {previewPronoun || (
                <a
                  href={PEOPLESOFT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {PEOPLESOFT_URL_HINT}
                </a>
              )}
            </h5>
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
                <h4>{formatHomeLocation(profile)}</h4>
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
              {pronounsField}
            </div>
          ) : (
            <div className="facebook-me__block">{pronounsField}</div>
          )}

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

              <div className="facebook-me__hometown-fields">
                <h4>Edit hometown</h4>
                <label>
                  City
                  <input
                    type="text"
                    value={homeTown}
                    maxLength={255}
                    onChange={(event) => {
                      setHomeTown(event.target.value);
                      setHomeLocationError("");
                    }}
                    placeholder="Enter a town or city"
                  />
                </label>
                <label>
                  State (U.S. only)
                  <input
                    type="text"
                    value={homeState}
                    maxLength={255}
                    list="facebook-me-state-options"
                    autoComplete="off"
                    disabled={!isUnitedStates(homeCountry)}
                    onChange={(event) => {
                      setHomeState(event.target.value);
                      setHomeLocationError("");
                    }}
                    placeholder={
                      isUnitedStates(homeCountry)
                        ? "Enter a state"
                        : "Choose United States to enter a state"
                    }
                  />
                  <datalist id="facebook-me-state-options">
                    {states.map((state) => (
                      <option key={state} value={state} />
                    ))}
                  </datalist>
                </label>
                <label>
                  Country
                  <input
                    type="text"
                    value={homeCountry}
                    maxLength={255}
                    list="facebook-me-country-options"
                    autoComplete="off"
                    onChange={(event) => {
                      const nextCountry = event.target.value;
                      setHomeCountry(nextCountry);
                      if (!isUnitedStates(nextCountry)) setHomeState("");
                      setHomeLocationError("");
                    }}
                    placeholder="Enter a country"
                  />
                  <datalist id="facebook-me-country-options">
                    {countries.map((country) => (
                      <option key={country} value={country} />
                    ))}
                  </datalist>
                </label>
                {homeLocationError ? (
                  <span className="facebook-me__location-error" role="alert">
                    {homeLocationError}
                  </span>
                ) : null}
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
