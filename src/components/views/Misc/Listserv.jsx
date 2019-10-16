// React imports
import React from "react";

const Listserv = () => {
  return (
    <div className="article">
      <section>
        <article>
          <br />
          <br />
          <h3>
            To access listservs, type
            <strong>&nbsp;/mailman/listinfo&nbsp;</strong>
            after
            <strong>&nbsp;wso.williams.edu</strong>
          </h3>

          <br />
          <br />

          <h3>List Administrators</h3>
          <p>
            Please note that as a result of a recent server move, the address to
            access the admin portal for listservs has changed slightly. Append
            <strong>&nbsp;_wso.williams.edu&nbsp;</strong>
            to the old address to access the admin portal. For example, the
            admin portal for the
            <strong>&nbsp;wso-staff&nbsp;</strong>
            list was formerly
            <strong>&nbsp;/mailman/admin/wso-staff &nbsp;</strong>
            and is now
            <strong>&nbsp;/mailman/admin/wso-staff_wso.williams.edu</strong>
          </p>

          <br />
          <br />
          <h4>What&#39;s this?</h4>
          <p>
            Some of you may have noticed increased spam recently on your
            listservs. Bots scan websites trying to find emails, and so directly
            linking to emails can be risky. So, we ask that you manually enter
            the URL because it would take a sophisticated bot to figure out how
            to do that. We apologize for the inconvenience.
          </p>
        </article>
      </section>
    </div>
  );
};

export default Listserv;
