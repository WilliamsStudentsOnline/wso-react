// React imports
import React from "react";
import { Link } from "react-router-dom";

const BoardMap = {
  "Charlie Tharas": 14774,
  "Nathan Vosburg": 14656,
  "Nathaniel Flores": 14643,
};

const ContributorMap = {};

const constructFacebookLink = (userID: number) => {
  return `/facebook/users/${userID}`;
};

const BulletList = (records: Record<string, number>) => {
  return (
    <ul
      style={{
        color: "var(--brand-primary-active)",
        paddingLeft: "1.25em",
        margin: "0.5em 0 1.5em",
      }}
    >
      {Object.keys(records).map((name: string) => (
        <li key={name} style={{ marginBottom: "0.35em" }}>
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
  );
};

const Team = () => {
  return (
    <div className="article">
      <section>
        <article>
          <h1 style={{ marginBottom: "0.5em" }}>Team</h1>
          <h3 style={{ margin: "0.75em 0 0.25em" }}>Board</h3>
          {BulletList(BoardMap)}
          <h3 style={{ margin: "0.75em 0 0.25em" }}>2026-2027 Contributors</h3>
          {BulletList(ContributorMap)}
        </article>
      </section>
    </div>
  );
};

export default Team;
