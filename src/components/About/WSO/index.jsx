import React from "react";

// Asset/Component imports
import DoughtyBanner from "../../../assets/images/banners/Doughty.jpg";
import styles from "./WSO.module.scss";

// External Imports
import { EuiLink } from "@elastic/eui";

const WSO = () => {
  return (
    <div>
      <div className={styles.aboutBanner}>
        <img src={DoughtyBanner} alt="Doughty Banner" />
        <p className={styles.introduction}>
          <span className={styles.clubName}>
            WSO (Williams Students Online)
          </span>{" "}
          is a student organization devoted to creating innovative and useful
          computer-based services and offering them to the Williams College
          community. WSO was founded in 1995 and continues to play an important
          role in the campus community today.
        </p>
      </div>

      <section className={styles.aboutSection}>
        <article>
          <div className={styles.section}>
            <h2>Services</h2>
            <p>
              WSO services are intended first and foremost for use by the
              Williams College community. Some services are available for only
              certain groups of the Williams College community (e.g. Factrak can
              be used by only students), and WSO reserves the right to make
              decisions regarding visibility of services. WSO reserves the right
              to further restrict all use of WSO services to members of the
              Williams College community should the need arise due to limited
              resources, etc., though this is a highly unlikely situation.
            </p>
          </div>

          <div className={styles.section}>
            <h2>Restrictions and Responsibilities</h2>
            <p>
              The following restrictions and responsibilities apply to all uses
              and users of WSO services.
            </p>
            <ul>
              <li>
                The use or targeting of WSO services in any tampering, attacks,
                or attempts to break in to WSO or other services is strictly
                prohibited, as is the use of any WSO services in illegal
                activities.
              </li>
              <li>
                The storage or distribution of pornographic materials, pirated
                software, pirated media, and malicious software is prohibited.
              </li>
              <li>
                Each user is responsible for ensuring proper attribution and
                copyrights for materials stored in his or her account or posted
                on WSO&rsquo;s web services.
              </li>
            </ul>
            <p>
              WSO is not responsible or liable for the actions of its users or
              for their use of WSO services. In the event that a person is
              discovered to be using WSO services in illegal activities, WSO
              will cooperate with law enforcement authorities if necessary.
            </p>
          </div>

          <div className={styles.section}>
            <h2>Content</h2>
            <p>
              WSO claims no responsibility for its users&rsquo; content in pages
              hosted on our servers, including forum posts, announcements,
              Factrak, Dormtrak, Willipedia pages, or other material. These do
              not reflect the actions and views of WSO, its administrators and
              staff, or other users. WSO neither endorses nor opposes any
              political candidate or organization. Given that we are a small,
              student-run organization, we rely on the users themselves to
              notify us when they deem something offensive, personal, or
              inappropriate to the general public. If you deem something unfit
              for the site, please contact wso-dev [at] wso.williams.edu
              identifying the offending information and where it can be found.
              Thank you for your cooperation.
            </p>
          </div>
          <div className={styles.section}>
            <h2>Join</h2>
            <p>
              WSO is always looking for new members, regardless of computing
              expertise or experience. Contact us{" "}
              <EuiLink
                href="https://docs.google.com/forms/d/e/1FAIpQLSeRAHhBnQ7qeJsiVIidnIjtuljenif-1M3OKaHpyQT1vlHgZg/viewform"
                external
                target="_blank"
              >
                here
              </EuiLink>{" "}
              and we&apos;ll get back to you quickly!
            </p>
          </div>
          <div className={styles.section}>
            <h2>Disclaimer</h2>
            <p>
              WSO makes no guarantees regarding its services. As an entirely
              student-run volunteer organization, WSO strives to maintain and
              improve its services as best it can, but WSO cannot completely
              guarantee the continued availibility, functionality, integrity,
              accuracy, or security of its services. Each individual who uses a
              WSO service does so at his or her own risk. In particular, WSO is
              not liable for data loss resultant from the use of its services.
            </p>
          </div>
        </article>
      </section>
    </div>
  );
};

export default WSO;
