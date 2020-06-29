// React imports
import React from "react";
import PropTypes from "prop-types";
import Footer from "./Footer";
import Nav from "./Nav";
import "./stylesheets/Application.css";

const Layout = ({ children, notice, warning }) => {
  return (
    <div className="front dormtrak facebook factrak announcement">
      <Nav />

      <aside>
        {notice && <section className="notice">{notice}</section>}
        {warning && (
          <section className="notice">{`Warning: ${warning}`}</section>
        )}
      </aside>

      {children}
      <a
        href="https://forms.gle/NqYdAAbZKPQmPq866"
        className="floating-button-link"
        title="Provide Feedback!"
      >
        <i
          className="material-icons"
          style={{ position: "relative", left: "-8px" }}
        >
          feedback
        </i>
      </a>
      <Footer />
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
