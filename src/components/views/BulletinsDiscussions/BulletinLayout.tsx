import React, { ReactNode } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";

import { ServiceHeader, ContentPane, ServiceTab } from "../../ui";
import { PostType, PostTypeName } from "../../../lib/types";
import "./BoardFeed.css";

const BulletinLayout = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigateTo = useNavigate();

  const onFeed = pathname.replace(/\/$/, "") === "/bulletin";
  const onForm = pathname.endsWith("/new") || pathname.endsWith("/edit");
  const selected = searchParams.get("types") ?? "";
  const selectedType = Object.values(PostType).find((t) => t === selected);

  const tab = (id: string, label: string): ServiceTab => ({
    type: "button",
    id: id || "all",
    label,
    active: onFeed && selected === id,
    onClick: () => navigateTo(id ? `/bulletin?types=${id}` : "/bulletin"),
  });

  return (
    <>
      <ServiceHeader
        className="board-header"
        title={
          onFeed && selectedType
            ? (PostTypeName.get(selectedType) ?? "Bulletin")
            : "Bulletin"
        }
        titleTo="/bulletin"
        tabs={[
          tab("", "All"),
          ...Object.values(PostType).map((type) =>
            tab(type, PostTypeName.get(type) ?? type)
          ),
        ]}
      >
        {onForm ? null : (
          <Link
            className="board-new-post"
            to={
              onFeed && selectedType
                ? `/bulletin/new?type=${selectedType}`
                : "/bulletin/new"
            }
          >
            New post
          </Link>
        )}
      </ServiceHeader>
      <ContentPane variant="main-table">{children}</ContentPane>
    </>
  );
};

export default BulletinLayout;
