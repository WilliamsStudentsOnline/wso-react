export default [
  { name: "home", path: "/" },
  { name: "about", path: "/about" },
  { name: "listserv", path: "/listserv" },
  { name: "hours", path: "/hours" },
  { name: "scheduler", path: "/scheduleCourses" },
  { name: "facebook", path: "/facebook" },
  {
    name: "factrak",
    path: "/factrak",
    children: [
      { name: "policy", path: "/policy" },
      { name: "surveys", path: "/surveys" },
    ],
  },
  { name: "dormtrak", path: "/dormtrak" },
  { name: "login", path: "/account/login" },
  { name: "logout", path: "/account/logout" },
];
