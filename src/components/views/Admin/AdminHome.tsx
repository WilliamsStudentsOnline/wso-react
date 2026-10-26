import React from "react";
import { Link } from "react-router-dom";
import "./Admin.css";

const AdminHome = () => {
  return (
    <article className="facebook-profile">
      <section className="margin-vertical-small">
        <ul className="admin-tools">
          <li>
            <Link to="/admin/banner">Homepage banner</Link>
          </li>
          <li>
            <Link to="/factrak/moderate">Factrak moderation</Link>
          </li>
        </ul>
      </section>
    </article>
  );
};

export default AdminHome;
