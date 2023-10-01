// React imports
import React from "react";
import { Link } from "react-router-dom";

const BoardMap = {
  "Andrew Megalaa": 12092,
  "Ye Shu": 12579,
  "David Goetze": 12282,
};

const ContributorMap = {
  "Max Enis": 12516,
  "Max Kan": 12406,
  "Himal Pandey": 12851,
  "Tim Kim": 14087,
  "Henrique Rodrigues": 13670,
  "Christopher Brown": 12444,
  "Milo Chang": 12365,
  "Emma Li": 14916,
  "Kevin Zhuo": 13052,
  "Jon Carl": 12125,
};

const constructFacebookLink = (userID: number) => {
  return `/facebook/users/${userID}`;
};

const BulletList = (records: Record<string, number>) => {
  return (
    <>
      <ul style={{ color: "#553871" }}>
        {Object.keys(records).map((name: string) => (
          <li key={name} style={{ marginBottom: "10px" }}>
            <Link
              to={constructFacebookLink(records[name as keyof typeof records])}
              style={{
                fontSize: "1.5rem",
              }}
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

const Team = () => {
  return (
    <div className="article">
      <section>
        <article>
          <br />
          <br />
          <h1>Team</h1>
          <br />
          <br />
          <h3>Board</h3>
          <article>
            <br />
            <p>{BulletList(BoardMap)}</p>
          </article>
          <h3>Contributors</h3>
          <article>
            <br />
            <p>{BulletList(ContributorMap)}</p>
          </article>
        </article>
      </section>
    </div>
  );
};

export default Team;
