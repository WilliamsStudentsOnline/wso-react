// React imports
import React, { lazy, ReactNode, Suspense } from "react";
import Footer from "./Footer";
import Nav from "./Nav";
import FeedbackFab from "./Feedback/FeedbackFab";
import { useWCFM, WCFMProvider } from "./views/WCFM/WCFMProvider";
import WCFMMini from "./views/WCFM/WCFMMini";
import "./stylesheets/Application.css";

export interface LayoutProps {
  children?: ReactNode;
  notice?: string;
  warning?: string;
}

const WCFMScene = lazy(() => import("./views/WCFM/WCFMScene"));

const WCFMSceneSlot = () => {
  const { sceneOpen } = useWCFM();
  return sceneOpen ? (
    <Suspense fallback={null}>
      <WCFMScene />
    </Suspense>
  ) : null;
};

const Layout = ({ children, notice = "", warning = "" }: LayoutProps) => {
  return (
    <WCFMProvider>
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
        <WCFMMini />
        <WCFMSceneSlot />
      </div>
    </WCFMProvider>
  );
};

export default Layout;
