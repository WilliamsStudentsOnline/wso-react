// React imports
import React from "react";
import { Link } from "react-router-dom";

const BoardMap = {
  "Matt Laws": 13268,
  "Charlie Tharas": 14774,
  "Nathan Vosburg": 14656,
};

const ContributorMap = {
  "Aaron Anidjar": 15487,
  "Abel Mesfin": 14016,
  "Adhip Rijal": 15897,
  "Amirjon Ulmasov": 15538,
  "Chris Pohlmann": 14876,
  "Danny Hinh": 15577,
  "David Vieten": 14200,
  "Dimitri Meimeteas": 14839,
  "Emmanuel Ekpenyong": 15714,
  "Gabe Ramirez": 13920,
  "Hayden Curfman": 15721,
  "Helen Qian": 13718,
  "Jaskaran Singh": 13126,
  "Jasper Li": 14874,
  "Jeeyon Kang": 13262,
  "Lola Casenave": 13239,
  "Matthew Chin": 15568,
  "Melanie Wang": 14710,
  "Natalia Avila-Hernandez": 14835,
  "Nathaniel Flores": 14643,
  "Nick Canora": 13953,
  "Nikhil Radosevich": 15099,
  "Niklas Obermüller": 15681,
  "Ronald Deng": 15674,
  "Savannah Bolton": 14892,
  "Simon Angoluan": 13089,
  "Susanna Boberg": 14715,
  "Tao Chen": 15850,
  "Temani Knight": 14872,
  "Vincent Hernandez": 15646,
  "William Hallward-Driemeier": 14905,
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
          <h3>2024-2025 Contributors</h3>
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
