// React imports
import React from "react";
import PropTypes from "prop-types";
import Footer from "./Footer";
import Nav from "./Nav";
import "./stylesheets/Application.css";

const Layout = ({ children, bodyClass, notice, warning }) => {
  return (
    <div className={bodyClass}>
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
  bodyClass: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
};

Layout.defaultProps = {
  notice: "",
  warning: "",
};

export default Layout;
