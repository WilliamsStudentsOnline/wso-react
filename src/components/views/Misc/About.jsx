// React imports
import React from "react";
import DoughtyBanner from "../../../assets/images/banners/Doughty.jpg";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../lib/store";
import { FFState } from "../../../lib/featureFlagSlice";
import Error403 from "../Errors/Error403";

const AboutPreRelease = () => {
  return (
    <div className="article">
      <div className="about-banner">
        <img src={DoughtyBanner} alt="Doughty Banner" />

        <header className="about-header">
          <h1>About WSO</h1>
          <h5>Williams Students Online</h5>
        </header>
      </div>

      <section className="about-section">
        <article>
          <p className="intro-paragraph">
            WSO (Williams Students Online) is a student organization devoted to
            creating innovative and useful computer-based services and offering
            them to the Williams College community. WSO was founded in 1995 and
            continues to play an important role in the campus community today.
            <br />
            <br />
            Check out the list of students currently working on WSO{" "}
            <Link to="/team">here!</Link>
          </p>
          <br />
          <h3>Services</h3>
          <p>
            WSO provides a number of services to the Williams College community
            free of charge. The use of these services is governed by this
            policy.
          </p>
          <h4>Who may use WSO Services?</h4>
          <p>
            WSO services are intended first and foremost for use by the Williams
            College community. Some services are available for only certain
            groups of the Williams College community (e.g. Factrak can be used
            by only students), and WSO reserves the right to make decisions
            regarding visibility of services. That being said, aspects of many
            of these services are available to the general public. WSO reserves
            the right to further restrict all use of WSO services to members of
            the Williams College community should the need arise due to limited
            resources, etc., though this is a highly unlikely situation.
          </p>
          <h4>Restrictions and Responsibilities</h4>
          <p>
            The following restrictions and responsibilities apply to all uses
            and users of WSO services.
          </p>
          <ul>
            <li>
              The use or targeting of WSO services in any tampering, attacks, or
              attempts to break in to WSO or other services is strictly
              prohibited, as is the use of any WSO services in illegal
              activities.
            </li>
            <li>
              The storage or distribution of pornographic materials, pirated
              software, pirated media, and malicious software is prohibited.
            </li>
            <li>
              Each user is responsible for ensuring proper attribution and
              copyrights for materials stored in his or her account or posted on
              WSO&rsquo;s web services.
            </li>
          </ul>
          <p>
            WSO is not responsible or liable for the actions of its users or for
            their use of WSO services. In the event that a person is discovered
            to be using WSO services in illegal activities, WSO will cooperate
            with law enforcement authorities if necessary.
          </p>

          <br />
          <h3>Content</h3>
          <p>
            WSO claims no responsibility for its users&rsquo; content in pages
            hosted on our servers, including forum posts, announcements,
            Factrak, Dormtrak, Willipedia pages, or other material. These do not
            reflect the actions and views of WSO, its administrators and staff,
            or other users. WSO neither endorses nor opposes any political
            candidate or organization. Given that we are a small, student-run
            organization, we rely on the users themselves to notify us when they
            deem something offensive, personal, or inappropriate to the general
            public. If you deem something unfit for the site, please contact
            wso-staff [at] wso.williams.edu identifying the offending
            information and where it can be found. Thank you for your
            cooperation.
          </p>

          <br />
          <h3>Join</h3>
          <p>
            WSO is always looking for new members, regardless of computing
            expertise or experience. Contact us to find out meeting time and
            place.
          </p>

          <br />
          <h3>Disclaimer</h3>
          <p>
            WSO makes no guarantees regarding its services. As an entirely
            student-run volunteer organization, WSO strives to maintain and
            improve its services as best it can, but WSO cannot completely
            guarantee the continued availibility, functionality, integrity,
            accuracy, or security of its services. Each individual who uses a
            WSO service does so at his or her own risk. In particular, WSO is
            not liable for data loss resultant from the use of its services.
          </p>
          <p />
        </article>
      </section>
    </div>
  );
};

const About = () => {
  const enableAbout = useAppSelector(
    (state) => state.featureFlagState["enableAbout"]
  );

  return (
    <div>
      {enableAbout === FFState.Enabled ? <AboutPreRelease /> : <Error403 />}
    </div>
  );
};
export default About;
