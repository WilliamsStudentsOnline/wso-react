import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { StylizedLink } from "./StylizedLink";
import "./ServiceHeader.css";

export type ServiceTab =
  | {
      type?: "link";
      to: string;
      label: ReactNode;
      title?: string;
      end?: boolean;
    }
  | {
      type: "external";
      href: string;
      label: ReactNode;
      title?: string;
    }
  | {
      type: "button";
      id: string;
      label: ReactNode;
      active?: boolean;
      onClick: () => void;
      title?: string;
    };

export type ServiceHeaderProps = {
  title: ReactNode;
  titleTo?: string;
  tabs?: ServiceTab[];
  search?: ReactNode;
  notice?: ReactNode;
  children?: ReactNode;
  className?: string;
};

const ServiceHeader = ({
  title,
  titleTo,
  tabs = [],
  search,
  notice,
  children,
  className = "",
}: ServiceHeaderProps) => {
  return (
    <header
      className={["wso-service-header", className].filter(Boolean).join(" ")}
    >
      <div className="page-head">
        <h1>{titleTo ? <Link to={titleTo}>{title}</Link> : title}</h1>
        {tabs.length > 0 && (
          <ul>
            {tabs.map((tab) => {
              if (tab.type === "button") {
                return (
                  <li key={tab.id}>
                    <button
                      type="button"
                      className={
                        tab.active
                          ? "wso-service-header__tab wso-service-header__tab--active active-stylized-link"
                          : "wso-service-header__tab"
                      }
                      onClick={tab.onClick}
                      title={tab.title}
                    >
                      {tab.label}
                    </button>
                  </li>
                );
              }
              if (tab.type === "external") {
                return (
                  <li key={tab.href}>
                    <a href={tab.href} title={tab.title}>
                      {tab.label}
                    </a>
                  </li>
                );
              }
              return (
                <li key={tab.to}>
                  <StylizedLink to={tab.to} title={tab.title} end={tab.end}>
                    {tab.label}
                  </StylizedLink>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {notice}
      {search}
      {children}
    </header>
  );
};

export default ServiceHeader;
