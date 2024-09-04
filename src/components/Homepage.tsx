// React imports
import React, { useState } from "react";

// Component imports
import "./stylesheets/Homepage.css";
import BulletinBox from "./views/BulletinsDiscussions/BulletinBox";

// Redux Imports
import { useNavigate } from "react-router-dom";
import { PostType } from "../lib/types";

const Homepage = () => {
  const navigateTo = useNavigate();
  const [query, updateQuery] = useState("");

  const submitHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    navigateTo(`/facebook?q=${query}`);
  };

  return (
    <div className="home">
      <div className="full-width">
        <div id="join-header">
          {/* <a href="https://forms.gle/7EcorfSMSuLQw5XW8">Join WSO today!</a> */}
          <a href="https://wso.williams.edu/bulletins/announcement/6880">
            [1/31/24] BookTrak and bugfixes coming to WSO!
          </a>
        </div>
        <header>
          <div className="logo">
            <h2 className="text-center" id="logotype">
              WSO
            </h2>
            <h4 className="text-center" id="tagline">
              By Students, For Students!
            </h4>
          </div>
          <br />
          <form onSubmit={submitHandler}>
            <input
              aria-label="Search box for Facebook"
              type="search"
              placeholder="Search Facebook"
              onChange={(event) => updateQuery(event.target.value)}
            />
            <input
              data-disable-with="Search"
              type="submit"
              value="Search"
              className="submit"
            />
          </form>
        </header>
        <article>
          <section>
            <div className="bulletin-list">
              {Object.values(PostType).map((type) => (
                <BulletinBox type={type} key={type} />
              ))}
            </div>
          </section>
        </article>
      </div>
    </div>
  );
};

export default Homepage;
