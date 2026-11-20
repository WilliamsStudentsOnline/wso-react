// React imports
import React, { ReactNode } from "react";
import Footer from "./Footer";
import Nav from "./Nav";
import FeedbackFab from "./Feedback/FeedbackFab";
import "./stylesheets/Application.css";

export interface LayoutProps {
  children?: ReactNode;
  notice?: string;
  warning?: string;
}

const Layout = ({ children, notice = "", warning = "" }: LayoutProps) => {
  return (
    <div className="front dormtrak facebook factrak announcement">
      <Nav />

      <div className="layout-scroll">
        <div className="layout-page">
          <div className="layout-body">
            <aside>
              {notice && <section className="notice">{notice}</section>}
              {warning && (
                <section className="notice">{`Warning: ${warning}`}</section>
              )}
            </aside>

            {children}

            <FeedbackFab />
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;
