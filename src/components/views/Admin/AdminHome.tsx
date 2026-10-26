import React from "react";
import { Link } from "react-router-dom";
import "./Admin.css";

const AdminHome = () => {
  return (
    <article className="facebook-profile">
      <section className="margin-vertical-small">
        <ul className="admin-tools">
          <li>
            <Link to="/admin/banner">
              <span className="admin-tools__title">Homepage banner</span>
              <span className="admin-tools__desc">
                Edit the notice strip on the homepage
              </span>
            </Link>
          </li>
        </ul>
      </section>
    </article>
  );
};

export default AdminHome;
