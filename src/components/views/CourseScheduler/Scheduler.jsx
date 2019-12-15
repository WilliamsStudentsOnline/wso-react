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

// Redux (Selector, Reducer, Actions) imports
import { getCurrSubMenu } from "../../../selectors/schedulerUtils";
import {
  updateGAPI,
  updateSignIn,
  addNotif,
  changeSem,
} from "../../../actions/schedulerUtils";
import { FAILURE } from "../../../constants/actionTypes";
import { doLoadCatalog } from "../../../actions/course";
import { addDays } from "../../../lib/general";
import { DATES } from "../../../constants/constants.json";

/* 
  Set default semester based on date. 
  
  Academic year Period: SEMESTER TO SHOW

  1. Start of Fall Semester - 2 Weeks before Spring Preregistration: FALL
  2. 2 Weeks before Spring Pre-registration to Winter Registration: SPRING
  3. Winter Registration to 1 week before Winter ends: WINTER
  4. 1 week before Winter ends to 2 Weeks before Fall Pre-registration: SPRING
  5. 2 Weeks before Fall Pre-registration to next year: FALL
*/
let DEFAULT_SEMESTER = 0;
const now = new Date();
// Check if Winter (Period 3, above)
if (
  new Date(DATES.PREREG.WINTER) < now &&
  now < addDays(new Date(DATES.Winter.END), -7)
) {
  DEFAULT_SEMESTER = 1;
} else if (
  // Check if Spring (Periods 2 and 4, above)
  addDays(new Date(DATES.PREREG.SPRING), -14) < now &&
  now < addDays(new Date(DATES.PREREG.FALL), -14)
) {
  DEFAULT_SEMESTER = 2;
} else {
  DEFAULT_SEMESTER = 0;
}

const Scheduler = ({
  doUpdateGAPI,
  doUpdateSemester,
  doUpdateSignIn,
  doAddNotification,
  active,
  loadCatalog,
}) => {
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
        const API_KEY = "AIzaSyAxGwi55Zk2mg-Hs-O3qLBcoEMx__cceD0";

        await gapiClient.client.init({
          clientId: CLIENT_ID,
          scope: SCOPES,
          discoveryDocs: DISCOVERY_DOCS,
          apiKey: API_KEY,
        });

        // Listen for sign-in state changes.
        doUpdateGAPI(gapiClient);
        doUpdateSignIn(gapiClient.auth2.getAuthInstance().isSignedIn.get());
      } catch (error) {
        doAddNotification({
          type: FAILURE,
          title: "Failed to execute Google Authentication.",
          body: error,
        });
      }
    };

    const loadCatalogCourses = async () => {
      axios({
        url: "/courses.json",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      }).then((response) => {
        loadCatalog(response.data);
      });
    };

    loadGAPI();
    loadCatalogCourses();
    doUpdateSemester(DEFAULT_SEMESTER);
  }, [
    doUpdateSemester,
    doUpdateGAPI,
    doUpdateSignIn,
    loadCatalog,
    doAddNotification,
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
  doUpdateSignIn: PropTypes.func.isRequired,
  doUpdateSemester: PropTypes.func.isRequired,
  doAddNotification: PropTypes.func.isRequired,
  loadCatalog: PropTypes.func.isRequired,
  active: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  active: getCurrSubMenu(state),
});

const mapDispatchToProps = (dispatch) => ({
  doUpdateGAPI: (gapi) => dispatch(updateGAPI(gapi)),
  doUpdateSignIn: (signedIn) => dispatch(updateSignIn(signedIn)),
  doAddNotification: (notification) => dispatch(addNotif(notification)),
  loadCatalog: (catalog) => dispatch(doLoadCatalog(catalog)),
  doUpdateSemester: (semester) => dispatch(changeSem(semester)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Scheduler);
