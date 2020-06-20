// React imports
import React from "react";
import PropTypes from "prop-types";
import Footer from "../Footer";
import Nav from "../Nav";
import { allButFooter, floatingButtonLink } from "./Layout.module.scss";

const Layout = ({ children, notice, warning }) => {
  return (
    <div className="front dormtrak facebook factrak announcement">
      <div className={allButFooter}>
        <Nav />

        <aside style={{ backgroundColor: "#eee" }}>
          {notice && <section className="notice">{notice}</section>}
          {warning && (
            <section className="notice">{`Warning: ${warning}`}</section>
          )}
        </aside>

        {children}
        <a
          href="https://forms.gle/NqYdAAbZKPQmPq866"
          className={floatingButtonLink}
          title="Provide Feedback!"
        >
          <i
            className="material-icons"
            style={{ position: "relative", left: "-8px" }}
          >
            feedback
          </i>
        </a>
      </div>

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
