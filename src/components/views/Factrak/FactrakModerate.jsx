// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import FactrakLayout from "./FactrakLayout";

const FactrakModerate = ({
  flaggedComments,
  currentUser,
  authToken,
  notice,
  warning,
}) => {
  const [flagged, setFlagged] = useState(flaggedComments);

  const unflag = (id) => {
    axios({
      url: `/factrak/unflag/?id=${id}`,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    }).then((response) => {
      setFlagged(flagged.filter((course) => course.id !== response.data.id));
    });
  };

  const deleteHandler = (id) => {
    // @TODO: write something to overcome this confirm
    // eslint-disable-next-line no-restricted-globals
    const confirmDelete = confirm("Are you sure?"); // eslint-disable-line no-alert
    if (!confirmDelete) return;
    axios({
      url: `/factrak/surveys/${id}`,
      method: "delete",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    }).then(() => {
      setFlagged(flagged.filter((course) => course.id !== id));
    });
  };

  return (
    <FactrakLayout
      currentUser={currentUser}
      authToken={authToken}
      notice={notice}
      warning={warning}
    >
      <article className="facebook-profile">
        <section className="margin-vertical-small">
          <h3>Moderation</h3>

          {flagged.map((f) => (
            <div
              className="comment"
              key={`comment${f.id}`}
              id={`comment${f.id}`}
            >
              <div>
                <span>
                  <a href={`/facebook/users/${f.professor_id}`}>
                    {f.professor.name}
                  </a>
                  &nbsp;
                  <a href={`/factrak/courses/${f.course.id}`}>
                    {f.course.name}
                  </a>
                  {/* (+<%= f.agreements.find_all { |a| a.agrees? }.length %>,
                    -<%= f.agreements.find_all { |a| !a.agrees? }.length %>) */}
                </span>
                <p>{f.comment}</p>
                <button
                  className="inline-button"
                  type="button"
                  onClick={() => unflag(f.id)}
                >
                  Unflag
                </button>
                &ensp;
                <button
                  className="inline-button"
                  onClick={() => deleteHandler(f.id)}
                  type="button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </section>
      </article>
    </FactrakLayout>
  );
};

FactrakModerate.propTypes = {
  flaggedComments: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentUser: PropTypes.object,
  authToken: PropTypes.string.isRequired,
  notice: PropTypes.string,
  warning: PropTypes.string,
};

FactrakModerate.defaultProps = {
  notice: "",
  warning: "",
  currentUser: {},
};

export default FactrakModerate;
