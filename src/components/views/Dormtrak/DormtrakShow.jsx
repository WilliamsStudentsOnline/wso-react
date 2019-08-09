// React imports
import React from "react";
import PropTypes from "prop-types";
import DormtrakFacts from "./DormtrakFacts";
import DormtrakRooms from "./DormtrakRooms";
import DormtrakRecentComments from "./DormtrakRecentComments";
import DormtrakLayout from "./DormtrakLayout";

const DormtrakShow = ({
  dorm,
  currentUser,
  reviews,
  neighborhoods,
  authToken,
  notice,
  warning,
}) => {
  const checkUserCommentRights = () => {
    if (!currentUser || !currentUser.dorm) return false;
    return currentUser.type === "Student" && currentUser.dorm.id === dorm.id;
  };
  return (
    <DormtrakLayout
      neighborhoods={neighborhoods}
      authToken={authToken}
      notice={notice}
      warning={warning}
      currentUser={currentUser}
    >
      <div className="container">
        <aside className="sidebar">
          <DormtrakFacts dorm={dorm} />

          <hr />

          <section className="building-rooms">
            <h3 id="roomstop">Rooms</h3>
            <small>
              <strong>
                <a href={`/floorplans/${dorm.name}`}>Floorplan&nbsp;</a>
              </strong>
              (Courtesy of OSL)
            </small>
            <br />
            <DormtrakRooms rooms={dorm.dorm_rooms} perPage={15} />
          </section>
        </aside>

        <article className="main">
          <section className="lead">
            <h2>
              <a id="dorm.name" href={`/dormtra/dorms/${dorm.name}`}>
                {dorm.name}
              </a>
            </h2>
            <div>
              <img alt="dorm" src={`/assets/avatars/${dorm.name}.png`} />
            </div>

            <strong>Summary</strong>
            <p>{dorm.description}</p>
          </section>

          <section>
            {checkUserCommentRights() ? (
              <strong>
                <a href="/dormtrak/reviews/new">Fill out survey</a>
              </strong>
            ) : null}
            {reviews.length > 0 ? (
              <DormtrakRecentComments
                reviews={reviews}
                abridged={false}
                currentUser={currentUser}
              />
            ) : (
              <>None yet</>
            )}
          </section>
        </article>
      </div>
    </DormtrakLayout>
  );
};

DormtrakShow.propTypes = {
  currentUser: PropTypes.object,
  dorm: PropTypes.object.isRequired,
  reviews: PropTypes.arrayOf(PropTypes.object).isRequired,
  authToken: PropTypes.string.isRequired,
  neighborhoods: PropTypes.arrayOf(PropTypes.object).isRequired,
  notice: PropTypes.string,
  warning: PropTypes.string,
};

DormtrakShow.defaultProps = {
  notice: "",
  warning: "",
  currentUser: {},
};

export default DormtrakShow;
