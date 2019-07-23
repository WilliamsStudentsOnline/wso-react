// React imports
import React from 'react';
import PropTypes from 'prop-types';
import BulletinLayout from './BulletinLayout';

const BulletinForm = ({
  bulletin,
  authToken,
  notice,
  currentUser,
  warning,
}) => {
  const processType = type => {
    if (type === 'LostFound') return 'lost_and_found';
    return `${type.toLowerCase()}s`;
  };

  const processTypeTag = type => {
    if (type === 'LostFound') return 'lost_found';
    return `${type.toLowerCase()}`;
  };

  const startDate = () => {
    if (bulletin.type !== 'Announcement' && bulletin.type !== 'Ride')
      return null;

    if (bulletin.type === 'Announcement') {
      return (
        <div className="field">
          <h5>
            <b>Show my post starting on</b>
          </h5>
          <input
            type="text"
            name="announcement[start_date]"
            id="announcement_start_date"
          />
        </div>
      );
    }
    return (
      <div className="field">
        <h5>
          <b>Show my post starting on</b>
        </h5>
        <input type="text" name="ride[start_date]" id="ride_start_date" />
      </div>
    );
  };

  return (
    <BulletinLayout notice={notice} currentUser={currentUser} warning={warning}>
      <article className="list-creation">
        <section>
          <form
            className={`new_${processTypeTag(bulletin.type)}`}
            id={`new_${processTypeTag(bulletin.type)}`}
            action={`/${processType(bulletin.type)}`}
            acceptCharset="UTF-8"
            method="post"
          >
            <br />
            <input name="utf8" type="hidden" value="✓" />
            <input type="hidden" name="authenticity_token" value={authToken} />
            {bulletin.errors && bulletin.errors.length > 0 ? (
              <div id="error_explanation">
                <b>Please correct the following error(s):</b>

                <ul>
                  {bulletin.errors.map(error => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {bulletin.type === 'Ride' ? (
              <>
                <div className="field">
                  <label htmlFor="ride_offer">
                    <input name="ride[offer]" type="hidden" value="0" />
                    <input
                      type="checkbox"
                      value="1"
                      name="ride[offer]"
                      id="ride_offer"
                    />
                    I&apos;m offering this ride
                  </label>
                </div>

                <div className="field">
                  <h5>
                    <b>Source</b>
                  </h5>
                  <input
                    type="text"
                    name="ride[source]"
                    id="ride_source"
                    defaultValue={bulletin.source}
                  />
                </div>

                <div className="field">
                  <h5>
                    <b>Destination</b>
                  </h5>
                  <input
                    type="text"
                    name="ride[destination]"
                    id="ride_destination"
                    defaultValue={bulletin.destination}
                  />
                </div>
              </>
            ) : (
              <div className="field">
                <h5>
                  <b>Title</b>
                </h5>
                <input
                  type="text"
                  name={`${processTypeTag(bulletin.type)}[title]`}
                  id={`${processTypeTag(bulletin.type)}_title`}
                  defaultValue={bulletin.title}
                />
              </div>
            )}

            {startDate()}

            <div className="field">
              <h5>
                <b>Message</b>
              </h5>
              <textarea
                name={`${processTypeTag(bulletin.type)}[body]`}
                id={`${processTypeTag(bulletin.type)}_body`}
                defaultValue={bulletin.body}
              />
            </div>

            <input
              type="submit"
              name="commit"
              value="Submit"
              className="submit"
              data-disable-with="Submit"
            />
          </form>
        </section>
      </article>
    </BulletinLayout>
  );
};

BulletinForm.propTypes = {
  bulletin: PropTypes.object.isRequired,
  authToken: PropTypes.string.isRequired,
  warning: PropTypes.string,
  notice: PropTypes.string,
  currentUser: PropTypes.object,
};

BulletinForm.defaultProps = {
  warning: '',
  notice: '',
  currentUser: {},
};

export default BulletinForm;
