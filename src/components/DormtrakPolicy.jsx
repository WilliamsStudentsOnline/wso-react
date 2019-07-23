// React imports
import React from 'react';
import PropTypes from 'prop-types';
import DormtrakLayout from './DormtrakLayout';

const DormtrakPolicy = ({
  currentUser,
  authToken,
  neighborhoods,
  notice,
  warning,
}) => {
  return (
    <DormtrakLayout
      neighborhoods={neighborhoods}
      authToken={authToken}
      notice={notice}
      warning={warning}
      currentUser={currentUser}
    >
      <div className="article">
        <section>
          <article>
            <h3>Policy</h3>
            {currentUser.dormtrak_policy ? null : (
              <p className="intro-paragraph">
                To proceed, read the policy below, then click Agree
              </p>
            )}

            <br />

            <p>
              Comments should be true, and based on personal experience. You can
              only review your current room and building, but that may change in
              the future.
            </p>
            <p>
              Currently, we do not have enough information on Co-op or
              First-year housing to make them available.
            </p>
            <p>
              When you post a review, you&apos;ll see an option for making it
              anonymous. If you choose to make your review anonymous, we will
              hide both your noise and general comment until the next school
              year.
            </p>
            <p>
              While Dormtrak is designed to be as open as possible,
              inappropriate comments will not be tolerated, and comments can be
              removed or edited at the discretion of the student moderator to
              bring them into accordance with this policy. Inappropriate
              comments include, but are not limited to, comments that name other
              students, that contain racial or ethnic slurs, and those that
              harass others. Spamming a building or room with incorrect
              information, for example in an effort to dissuade others from
              potentially choosing that dorm, will result in being banned from
              further use of Dormtrak.
            </p>
            <p>
              You are allowed a max of one review per room. You can edit and
              delete your reviews, but when you delete your review we hold onto
              some of the statistical information you provide us (like whether
              or not your room has a keypad to get in).
            </p>
            <p>By using Dormtrak, you agree to abide by this policy.</p>

            {currentUser.dormtrak_policy ? (
              <p> You have already accepted the Dormtrak policy.</p>
            ) : (
              <form
                action="/dormtrak/accept_policy"
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
                  <input type="checkbox" name="accept" id="accept" value="1" />
I
                  agree to the Dormtrak policy.
                </p>
                <input
                  type="submit"
                  name="commit"
                  value="continue"
                  data-disable-with="continue"
                />
              </form>
            )}
          </article>
        </section>
      </div>
    </DormtrakLayout>
  );
};

DormtrakPolicy.propTypes = {
  currentUser: PropTypes.object.isRequired,
  authToken: PropTypes.string.isRequired,
  neighborhoods: PropTypes.arrayOf(PropTypes.object).isRequired,
  notice: PropTypes.string,
  warning: PropTypes.string,
};

DormtrakPolicy.defaultProps = {
  notice: '',
  warning: '',
};

export default DormtrakPolicy;
