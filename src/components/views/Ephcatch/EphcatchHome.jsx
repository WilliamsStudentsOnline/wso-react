// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import { connect } from "react-redux";
import { getToken } from "../../../selectors/auth";
import { getEphcatchers } from "../../../api/ephcatch";

import { checkAndHandleError } from "../../../lib/general";

const EphcatchHome = ({ token }) => {
  const [ephcatchers, updateEphcatchers] = useState([]);

  useEffect(() => {
    const loadEphcatchers = async () => {
      const ephcatchersResponse = await getEphcatchers(token);
      console.log(ephcatchersResponse);
      if (checkAndHandleError(ephcatchersResponse)) {
        updateEphcatchers(ephcatchersResponse.data.data);
      }
    };

    loadEphcatchers();
  }, [token]);

  const selectephcatcher = (event) => {
    const aside = event.currentTarget;
    const otherID = aside.attributes.dataid.nodeValue;

    if (aside.attributes.datamethod.nodeValue === "delete") {
      axios({
        url: `/ephcatch/ephcatches/${otherID}`,
        method: "delete",
        params: { authenticity_token: token },
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });
      aside.attributes.datamethod.nodeValue = "post";
    } else {
      axios({
        url: `/ephcatch/ephcatches/`,
        method: "post",
        params: { id: otherID, authenticity_token: token },
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });
      aside.attributes.datamethod.nodeValue = "delete";
    }
    aside.classList.toggle("ephcatch-selected");
  };

  return (
    <article className="facebook-results">
      <section>
        <div className="grid-wrap">
          <p>
            Select as many people as you want by clicking on their profile. You
            can also come back later and modify your selections. To check if you
            have matches, click &ldquo;Matches&rdquo; above or refresh the page.
            Have fun, and good luck!
            <br />
            <strong>Note:</strong>
            &nbsp;You can&apos;t see yourself in the list below, but everyone
            else can.
          </p>
          <br />
          {ephcatchers.map((ephcatcher) => (
            <aside
              key={ephcatcher.id}
              id={`ephcatch-ephcatcher-${ephcatcher.id}`}
              dataid={`${ephcatcher.id}`}
              // className={
              //   selected.indexOf(ephcatcher.id) !== -1
              //     ? "ephcatch-select-link ephcatch-selected"
              //     : "ephcatch-select-link"
              // }
              // datamethod={
              //   selected.indexOf(ephcatcher.id) !== -1 ? "delete" : "post"
              // }
              onClick={(event) => selectephcatcher(event)}
              role="presentation"
            >
              <div className="third">
                <div className="profile-photo">
                  <img alt="profile" src={`/pic/${ephcatcher.unixID}`} />
                </div>
              </div>
              <div className="two-thirds">
                <h4>{ephcatcher.name}</h4>
              </div>
            </aside>
          ))}
        </div>
      </section>
    </article>
  );
};

EphcatchHome.propTypes = {
  token: PropTypes.string.isRequired,
};

EphcatchHome.defaultProps = {};

const mapStateToProps = (state) => ({
  token: getToken(state),
});
export default connect(mapStateToProps)(EphcatchHome);
