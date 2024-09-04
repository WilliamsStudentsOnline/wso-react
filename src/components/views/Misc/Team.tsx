// React imports
import React from "react";
import { Link } from "react-router-dom";

const BoardMap = {
  "Matt Laws": 13268,
};

const ContributorMap = {
  "Satya Benson": 14059,
  "Santiago Ferris": 14145,
  "Himal Pandey": 12851,
  "Tim Kim": 14087,
  "Will Pachus": 13101,
  "Henrique Rodrigues": 13670,
  "Emma Li": 14916,
  "Kevin Zhuo": 13052,
  "Serah Park": 13923,
  "Lesley Iazzag": 14147,
  "Nathan Vosburg": 14656,
  "Charlie Tharas": 14774,
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
