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
        {notice ? <section className="notice">{notice}</section> : null}
        {warning ? (
          <section className="notice">{`Warning: ${warning}`}</section>
        ) : null}
      </aside>

      {children}
      <Footer />
    </div>
  );
};

Layout.propTypes = {
  notice: PropTypes.string,
  warning: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

Layout.defaultProps = {
  notice: "",
  warning: "",
  children: null,
};

export default Layout;
