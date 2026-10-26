import React from "react";
import { Link } from "react-router-dom";
import { ADMIN_SECTIONS } from "./adminSections";

const AdminHome = () => {
  return (
    <div className="admin-home">
      <p className="admin-home__lede">
        Site moderator console. Banner editing is live; more tools move here as
        we grow this surface.
      </p>
      <ul className="admin-home__grid">
        {ADMIN_SECTIONS.filter((s) => s.id !== "overview").map((section) => {
          const enabled = Boolean(section.path || section.href);
          const body = (
            <>
              <h2>{section.title}</h2>
              <p>{section.description}</p>
              {!enabled && (
                <span className="admin-home__soon">Coming soon</span>
              )}
            </>
          );

          if (section.path) {
            return (
              <li key={section.id}>
                <Link className="admin-home__card" to={section.path}>
                  {body}
                </Link>
              </li>
            );
          }
          if (section.href) {
            return (
              <li key={section.id}>
                <Link className="admin-home__card" to={section.href}>
                  {body}
                </Link>
              </li>
            );
          }
          return (
            <li key={section.id}>
              <div className="admin-home__card admin-home__card--disabled">
                {body}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AdminHome;
