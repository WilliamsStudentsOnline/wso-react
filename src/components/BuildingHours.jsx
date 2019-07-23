// React imports
import React from 'react';
import PropTypes from 'prop-types';
import Layout from './Layout';

const BuildingHours = ({ notice, warning, currentUser }) => {
  return (
    <Layout
      bodyClass="front"
      notice={notice}
      warning={warning}
      currentUser={currentUser}
    >
      <div className="article">
        <section>
          <article>
            <br />
            <br />
            <h2>Building Hours</h2>

            <br />
            <br />

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
          </article>
        </section>
      </div>
    </Layout>
  );
};

BuildingHours.propTypes = {
  notice: PropTypes.string,
  warning: PropTypes.string,
  currentUser: PropTypes.object,
};

BuildingHours.defaultProps = {
  currentUser: {},
  notice: '',
  warning: '',
};

export default BuildingHours;
