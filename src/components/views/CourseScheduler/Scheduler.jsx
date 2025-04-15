// React imports
import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// External imports
import axios from "axios";

// Component imports
import "../../stylesheets/Scheduler.css";
import googleAPI from "google-client-api";
import Catalog from "./Catalog";
import NotificationList from "./NotificationList";
import SubMenu from "./SubMenu";
import Search from "./Search";
import Timetable from "./Timetable";
import AdditionalOptions from "./AdditionalOptions";
import MajorBuilder from "./MajorBuilder";
import MajorEditor from "./MajorEditor";

// Redux (Selector, Reducer, Actions) imports
import { getCurrSubMenu } from "../../../selectors/schedulerUtils";
import {
  updateGAPI,
  // updateSignIn,
  addNotif,
  changeSem,
} from "../../../actions/schedulerUtils";
import { FAILURE } from "../../../constants/actionTypes";
import { doLoadCatalog } from "../../../actions/course";
import { DEFAULT_SEMESTER_INDEX } from "../../../lib/scheduler";
import { containsOneOfScopes, scopes } from "../../../lib/general";
import { useAppSelector } from "../../../lib/store";
import { getAPIToken } from "../../../lib/authSlice";

const Scheduler = ({
  doUpdateGAPI,
  doUpdateSemester,
  doAddNotification,
  active,
  loadCatalog,
}) => {
  const token = useAppSelector(getAPIToken);
  useEffect(() => {
    const loadGAPI = async () => {
      try {
        const gapiClient = await googleAPI();
        const CLIENT_ID =
          "99903103727-mcppob91tlqitcd7g11ud46vg0gr90im.apps.googleusercontent.com";
        const SCOPES = "https://www.googleapis.com/auth/calendar";
        const DISCOVERY_DOCS = [
          "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
        ];
        const API_KEY = "AIzaSyAxGwi55Zk2mg-Hs-O3qLBcoEMx__cceD0"; // yeppp

        gapiClient.client.init({
          clientId: CLIENT_ID,
          scope: SCOPES,
          discoveryDocs: DISCOVERY_DOCS,
          apiKey: API_KEY,
        });

        doUpdateGAPI(gapiClient);
      } catch (error) {
        doAddNotification({
          type: FAILURE,
          title: "Failed to load Google API client.",
        });
      }
    };

    const loadCatalogCourses = (prohibitFactrak = false) => {
      // if logged in as student, fetch catalog with factrak reviews
      let jsonURL = "/courses.json";
      if (
        !prohibitFactrak &&
        token &&
        containsOneOfScopes(token, [scopes.ScopeFactrakFull])
      ) {
        jsonURL = "/courses-factrak.json";
      }

      const axios_headers = {
        "X-Requested-With": "XMLHttpRequest",
      };

      if (!prohibitFactrak && token) {
        axios_headers["Authorization"] = "Bearer " + token;
      }

      axios({
        url: jsonURL,
        headers: axios_headers,
      }).then((response) => {
        if (response.status !== 200 || response.statusText !== "OK") {
          loadCatalogCourses(true);
        } else {
          loadCatalog(response.data);
        }
      });
    };

    loadGAPI();
    loadCatalogCourses();
    doUpdateSemester(DEFAULT_SEMESTER_INDEX);
  }, [
    doUpdateSemester,
    doUpdateGAPI,
    // doUpdateSignIn,
    loadCatalog,
    doAddNotification,
    token,
  ]);

  const getActive = () => {
    switch (active) {
      case "Catalog":
        return (
          <div className="row">
            <div className="column">
              <Search />
              <Catalog />
            </div>
            <AdditionalOptions />
          </div>
        );
      case "Timetable":
        return (
          <div className="row">
            <Timetable />
          </div>
        );
      case "Planner":
        return (
          <div className="row">
            <MajorBuilder />
          </div>
        );
      case "Editor":
        return (
          <div className="row">
            <MajorEditor />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <div className="app-header">
        <h1>Course Scheduler</h1>
      </div>
      <NotificationList />
      <div className="row">
        <div className="sub-menu-column">
          <SubMenu />
        </div>
        <div
          className={
            active === "Catalog"
              ? "main-container"
              : "main-container overflow-hidden"
          }
        >
          {getActive()}
        </div>
      </div>
    </div>
  );
};

Scheduler.propTypes = {
  doUpdateGAPI: PropTypes.func.isRequired,
  // doUpdateSignIn: PropTypes.func.isRequired,
  doUpdateSemester: PropTypes.func.isRequired,
  doAddNotification: PropTypes.func.isRequired,
  loadCatalog: PropTypes.func.isRequired,
  active: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  active: getCurrSubMenu(state),
});

const mapDispatchToProps = (dispatch) => ({
  doAddNotification: (notification) => dispatch(addNotif(notification)),
  doUpdateGAPI: (gapi) => dispatch(updateGAPI(gapi)),
  doUpdateSemester: (semester) => dispatch(changeSem(semester)),
  loadCatalog: (catalog) => dispatch(doLoadCatalog(catalog)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Scheduler);
