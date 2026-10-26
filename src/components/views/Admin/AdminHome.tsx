import React from "react";
import { Link } from "react-router-dom";

const AdminHome = () => {
  return (
    <article className="facebook-profile">
      <section className="margin-vertical-small">
        <h3>Admin</h3>
        <ul>
          <li>
            <Link to="/admin/banner">Homepage banner</Link>
          </li>
        </ul>
      </section>
    </article>
  );
};

export default AdminHome;
