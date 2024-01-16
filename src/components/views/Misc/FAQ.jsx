// React imports
import React from "react";
import { useAppSelector } from "../../../lib/store";
import { FFState } from "../../../lib/featureFlagSlice";
import Error403 from "../Errors/Error403";

const FAQPreRelease = () => {
  return (
    <div className="article">
      <section>
        <article>
          <br />
          <br />
          <h1>Frequently Asked Questions</h1>
          <br />
          <br />
          <h3>Listserv</h3>
          <article>
            <br />
            <h4>
              To access listservs, type
              <strong>&nbsp;/mailman/listinfo&nbsp;</strong>
              after
              <strong>&nbsp;wso.williams.edu</strong>
            </h4>
            <br />
            <br />

            <h3>List Administrators</h3>
            <p>
              Please note that as a result of a recent server move, the address
              to access the admin portal for listservs has changed slightly.
              Append
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
              listservs. Bots scan websites trying to find emails, and so
              directly linking to emails can be risky. So, we ask that you
              manually enter the URL because it would take a sophisticated bot
              to figure out how to do that. We apologize for the inconvenience.
            </p>
            <br />
            <br />
          </article>

          <h3>Building Hours</h3>

          <br />
          <br />

          <article>
            <p>
              <strong>Hollander &amp; Schapiro Hall:&nbsp;</strong>
              unlocked M - F (6am - 7pm) Student card access: Monday - Thursday
              7pm - 12:30am; Saturday 10am - 9pm; Sunday 10am - 12:30am
              (classrooms available when not reserved)
            </p>
            <p>
              <strong>Stetson Hall 5th Floor:&nbsp;</strong>
              access hours same as Hollander &amp; Schapiro Student card access:
              Monday - Thursday 7pm - 12:30am; Saturday 10am - 9pm; Sunday 10am
              - 12:30am (classrooms available when not reserved)
            </p>
            <p>
              <b>Hopkins Hall:&nbsp;</b>
              Basement level classroom use available 24/7 (classrooms available
              when not reserved) Enter through East entrance (facing Thompson
              Chapel) all other exteriors are secured at approx. 9pm (or when
              all room reservations have ended)
            </p>
            <p>
              <b>Environmental Center:&nbsp;</b>
              unlocked M - Sun. (8am - 7pm) Student card access: 24/7
            </p>
            <p>
              <b>Paresky:&nbsp;</b>
              unlocked M - Sun (6am -2am). Student card access: Monday -
              Thursday 2am - 6am
            </p>
            <p>
              <b>Griffin Hall:&nbsp;</b>
              unlocked M - F (6am - 5pm) and per the room reservation schedule.
              Building is secured when all classrooms are not in use
            </p>
            <p>
              <b>Jenness &amp; Hardy:&nbsp;</b>
              unlocked M-F (7am - 6pm) Student card access 24/7
            </p>
            <p>
              <b>Rice House:&nbsp;</b>
              card access only Student card access 24/7
            </p>
            <p>
              <b>Jesup Hall:&nbsp;</b>
              unlocked M-F (7am - 6pm) Student card access 24/7
            </p>
            <p>
              <b>Schow Library:&nbsp;</b>
              unlocked M-Thurs. (8am - 2am); Friday( 8am - 8pm); Sat.. (11am -
              8pm); Sun. (11am - 2am)
            </p>
            <p>
              <b>Sawyer Library:&nbsp;</b>
              unlocked M-Thurs. (8am - 230am); Fri.(8am - 10pm); Sat. (9am -
              10pm); Sun. (9am - 2:30am) Student 24/7 access west entrance to 24
              hour student space
            </p>
            <p>
              <b>Stetson Court Trailer Classrooms:&nbsp;</b>
              unlocked M - F (8am - 5pm) and per the room reservation schedule
            </p>
            <br />
            <br />
          </article>
        </article>
      </section>
    </div>
  );
};

const FAQ = () => {
  const enableFAQ = useAppSelector(
    (state) => state.featureFlagState["enableFAQ"]
  );

  return (
    <div>
      {enableFAQ === FFState.Enabled ? <FAQPreRelease /> : <Error403 />}
    </div>
  );
};

export default FAQ;
