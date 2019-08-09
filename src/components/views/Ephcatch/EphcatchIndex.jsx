// React imports
import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import EphcatchLayout from "./EphcatchLayout";

const EphcatchIndex = ({
  seniors,
  selected,
  authToken,
  currentUser,
  warning,
  notice,
}) => {
  const selectSenior = (event) => {
    const aside = event.currentTarget;
    const otherID = aside.attributes.dataid.nodeValue;

    if (aside.attributes.datamethod.nodeValue === "delete") {
      axios({
        url: `/ephcatch/ephcatches/${otherID}`,
        method: "delete",
        params: { authenticity_token: authToken },
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });
      aside.attributes.datamethod.nodeValue = "post";
    } else {
      axios({
        url: `/ephcatch/ephcatches/`,
        method: "post",
        params: { id: otherID, authenticity_token: authToken },
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });
      aside.attributes.datamethod.nodeValue = "delete";
    }
    aside.classList.toggle("ephcatch-selected");
  };

  return (
    <EphcatchLayout currentUser={currentUser} warning={warning} notice={notice}>
      <article className="facebook-results">
        <section>
          <div className="grid-wrap">
            <p>
              Select as many people as you want by clicking on their profile.
              You can also come back later and modify your selections. To check
              if you have matches, click &ldquo;Matches&rdquo; above or refresh
              the page. Have fun, and good luck!
              <br />
              <strong>Note:</strong>
              &nbsp;You can&apos;t see yourself in the list below, but everyone
              else can.
            </p>
            <br />
            {seniors.map((senior) => (
              <aside
                key={senior.id}
                id={`ephcatch-senior-${senior.id}`}
                dataid={`${senior.id}`}
                className={
                  selected.indexOf(senior.id) !== -1
                    ? "ephcatch-select-link ephcatch-selected"
                    : "ephcatch-select-link"
                }
                datamethod={
                  selected.indexOf(senior.id) !== -1 ? "delete" : "post"
                }
                onClick={(event) => selectSenior(event)}
                role="presentation"
              >
                <div className="third">
                  <div className="profile-photo">
                    <img alt="profile" src={`/pic/${senior.unix_id}`} />
                  </div>
                </div>
                <div className="two-thirds">
                  <h4>{senior.name}</h4>
                </div>
              </aside>
            ))}
          </div>
        </section>
      </article>
    </EphcatchLayout>
  );
};

EphcatchIndex.propTypes = {
  seniors: PropTypes.arrayOf(PropTypes.object).isRequired,
  selected: PropTypes.arrayOf(PropTypes.number).isRequired,
  authToken: PropTypes.string.isRequired,
  currentUser: PropTypes.object.isRequired,
  warning: PropTypes.string,
  notice: PropTypes.string,
};

EphcatchIndex.defaultProps = {
  notice: "",
  warning: "",
};

export default EphcatchIndex;
