// React imports
import React from "react";
import PropTypes from "prop-types";

import { ServiceHeader, ContentPane } from "../../ui";

const DiscussionLayout = ({ children }) => {
  return (
    <>
      <ServiceHeader
        title="Discussions"
        titleTo="/discussions"
        tabs={[
          { to: "/discussions", label: "Home", end: true },
          { to: "/discussions/new", label: "New" },
        ]}
      />
      <ContentPane variant="main-table">{children}</ContentPane>
    </>
  );
};

DiscussionLayout.propTypes = {
  children: PropTypes.object.isRequired,
};

DiscussionLayout.defaultProps = {};

export default DiscussionLayout;
