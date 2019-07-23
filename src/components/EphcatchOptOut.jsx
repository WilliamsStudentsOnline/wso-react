// React imports
import React from 'react';
import PropTypes from 'prop-types';
import EphcatchLayout from './EphcatchLayout';

const EphcatchOptOut = ({ authToken, currentUser, warning, notice }) => {
  return (
    <EphcatchLayout currentUser={currentUser} warning={warning} notice={notice}>
      <div className="article">
        <section>
          <article>
            <h3>Opt Out</h3>
            <br />
            <p>
              Choosing to opt out means you cannot select fellow seniors or view
              matches. Your picture and name will also not be shown to other
              users. You may opt back in at anytime.
            </p>

            <form
              action="/ephcatch/no_ephcatch"
              acceptCharset="UTF-8"
              method="post"
            >
              <input name="utf8" type="hidden" value="✓" />
              <input
                type="hidden"
                name="authenticity_token"
                value={authToken}
              />
              <p>
                <input
                  type="checkbox"
                  name="opt_out_ephcatch"
                  id="opt_out_ephcatch"
                  value="1"
                  defaultChecked={currentUser.opt_out_ephcatch}
                />
                I do not want to participate in Ephcatch.
              </p>
              <br />
              <input
                type="submit"
                name="commit"
                value="Save"
                data-disable-with="Save"
              />
            </form>
          </article>
        </section>
      </div>
    </EphcatchLayout>
  );
};

EphcatchOptOut.propTypes = {
  authToken: PropTypes.string.isRequired,
  currentUser: PropTypes.object.isRequired,
  notice: PropTypes.string,
  warning: PropTypes.string,
};

EphcatchOptOut.defaultProps = {
  notice: '',
  warning: '',
};

export default EphcatchOptOut;
