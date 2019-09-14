// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";

// Redux/Routing imports
import { connect } from "react-redux";
import { actions } from "redux-router5";
import { getToken } from "../../../selectors/auth";

// Additional Imports
import { checkAndHandleError } from "../../../lib/general";
import { postDiscussion } from "../../../api/bulletins";

const DiscussionsNew = ({ token, navigateTo }) => {
  const [errors, updateErrors] = useState([]);

  // Discussion parameters
  const [title, updateTitle] = useState("");
  const [content, updateContent] = useState("");

  // Render Errors
  const renderErrors = () => {
    if (errors.length === 0) return null;

    return (
      <div id="error_explanation">
        <b>{`${errors.length} errors:`}</b>
        <ul>
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      </div>
    );
  };

  // Handles submission of new discussion
  const submitHandler = async (event) => {
    event.preventDefault();

    if (!title.trim() && !content.trim()) {
      updateErrors(["Title is empty.", "Body is empty."]);
    }
    if (!title.trim()) {
      updateErrors(["Title is empty."]);
      return;
    }
    if (!content.trim()) {
      updateErrors(["Body is empty."]);
      return;
    }

    const params = { title, content };
    const response = await postDiscussion(token, params);

    if (checkAndHandleError(response)) {
      navigateTo("discussions.show", { discussionID: response.data.data.id });
    } else if (response.error.errors) {
      updateErrors(response.error.errors);
    } else {
      updateErrors(response.error.message);
    }
  };

  return (
    <article className="list-creation">
      <section>
        <form onSubmit={submitHandler}>
          <br />
          {renderErrors()}
          <input
            placeholder="Title"
            type="text"
            id="post_title"
            value={title}
            onChange={(event) => updateTitle(event.target.value)}
          />
          <textarea
            placeholder="Body"
            id="post_content"
            value={content}
            onChange={(event) => updateContent(event.target.value)}
          />
          <input
            type="submit"
            value="Submit"
            className="submit"
            data-disable-with="Submit"
          />
        </form>
      </section>
    </article>
  );
};

DiscussionsNew.propTypes = {
  token: PropTypes.string.isRequired,
  navigateTo: PropTypes.func.isRequired,
};

DiscussionsNew.defaultProps = {};

const mapStateToProps = (state) => ({
  token: getToken(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscussionsNew);
