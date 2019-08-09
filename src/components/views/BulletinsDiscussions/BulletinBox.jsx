// React imports
import React from "react";
import PropTypes from "prop-types";

// Component imports
import "../../stylesheets/BulletinBox.css";

const BulletinBox = ({ bulletin }) => {
  const [threads, title, link] = bulletin;

  const date = (showDate) => {
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
    };

    return new Date(showDate).toLocaleString("en-US", options);
  };

  return (
    <div className="bulletin">
      <div className="bulletin-title">
        <a className="bulletin-link" href={link}>
          {title}
        </a>
      </div>

      <div className="bulletin-children-container">
        {threads.map((thread) => {
          return (
            <div className="bulletin-children">
              <a className="thread-link" href={`${link}/${thread.id}`}>
                {thread.title}
              </a>

              <span className="list-date">{date(thread.show_date)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

BulletinBox.propTypes = {
  bulletin: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default BulletinBox;
