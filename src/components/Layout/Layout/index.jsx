// React imports
import React from "react";
import PropTypes from "prop-types";
import Footer from "../Footer";
import Nav from "../Nav";
import { allButFooter, floatingButtonLink } from "./Layout.module.scss";

const Layout = ({ children }) => {
  return (
    <div className="front dormtrak facebook factrak announcement">
      <div className={allButFooter}>
        <Nav />

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
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

Layout.defaultProps = {
  children: null,
};

export default Layout;
