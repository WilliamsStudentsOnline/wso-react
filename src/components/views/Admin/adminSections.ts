export type AdminSection = {
  id: string;
  title: string;
  description: string;
  /** In-console path; omit for coming-soon cards */
  path?: string;
  /** External or existing app route while console grows */
  href?: string;
  tabLabel: string;
};

export const ADMIN_SECTIONS: AdminSection[] = [
  {
    id: "overview",
    title: "Overview",
    description: "Moderator tools that will live under /admin over time",
    path: "/admin",
    tabLabel: "Overview",
  },
  {
    id: "banner",
    title: "Homepage banner",
    description: "Show, hide, or update the sitewide homepage notice",
    path: "/admin/banner",
    tabLabel: "Banner",
  },
  {
    id: "factrak",
    title: "Factrak moderation",
    description: "Review flagged surveys (existing Factrak admin page)",
    href: "/factrak/moderate",
    tabLabel: "Factrak",
  },
  {
    id: "bulletins",
    title: "Bulletins",
    description: "Moderate announcements and discussions",
    tabLabel: "Bulletins",
  },
  {
    id: "users",
    title: "Users",
    description: "Look up accounts and manage privileges",
    tabLabel: "Users",
  },
];

export const adminNavTabs = () =>
  ADMIN_SECTIONS.filter((s) => s.path).map((s) => ({
    to: s.path as string,
    label: s.tabLabel,
    end: s.path === "/admin",
  }));
