export default [
  { name: "home", path: "/" },
  { name: "about", path: "/about" },
  { name: "listserv", path: "/listserv" },
  { name: "hours", path: "/hours" },
  { name: "scheduler", path: "/scheduleCourses" },
  {
    name: "facebook",
    path: "/facebook",
    children: [{ name: "help", path: "/help" }],
  },
  {
    name: "factrak",
    path: "/factrak",
    children: [
      { name: "policy", path: "/policy" },
      { name: "surveys", path: "/surveys" },
      { name: "moderate", path: "/moderate" },
      // @TODO: error handling for non numerical params
      { name: "areasOfStudy", path: "/areasOfStudy/:area<\\d+>" },
      { name: "courses", path: "/courses/:course<\\d+>" },
    ],
  },
  { name: "dormtrak", path: "/dormtrak" },
  { name: "login", path: "/account/login" },
  { name: "logout", path: "/account/logout" },
];
