// React imports
import React from "react";
import PropTypes from "prop-types";
import Footer from "./Footer";
import Nav from "./Nav";
import FeedbackFab from "./Feedback/FeedbackFab";
import "./stylesheets/Application.css";

const Layout = ({ children, notice, warning }) => {
  return (
    <div className="front dormtrak facebook factrak announcement">
      <Nav />

      <div className="layout-scroll">
        <div className="layout-page">
          <div className="layout-body">
            <aside>
              {notice && <section className="notice">{notice}</section>}
              {warning && (
                <section className="notice">{`Warning: ${warning}`}</section>
              )}
            </aside>

            {children}

            <FeedbackFab />
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  notice: PropTypes.string,
  warning: PropTypes.string,
};

Layout.defaultProps = {
  children: null,
  notice: "",
  warning: "",
};

export default Layout;
