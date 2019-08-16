export default [
  { name: "home", path: "/" },
  { name: "about", path: "/about" },
  { name: "listserv", path: "/listserv" },
  { name: "hours", path: "/hours" },
  { name: "scheduler", path: "/scheduleCourses" },
  {
    name: "facebook",
    path: "/facebook",
    children: [
      { name: "help", path: "/help" },
      { name: "users", path: "/users/:userID" },
    ],
  },
  {
    name: "factrak",
    path: "/factrak",
    children: [
      { name: "policy", path: "/policy" },
      { name: "surveys", path: "/surveys" },
      { name: "moderate", path: "/moderate" },
      { name: "areasOfStudy", path: "/areasOfStudy/:area" },
      {
        name: "courses",
        path: "/courses/:course",
        children: [{ name: "singleProf", path: "?:profID" }],
      },
      { name: "professors", path: "/professors/:profID" },
      { name: "newSurvey", path: "/surveys/new?:profID" },
      { name: "editSurvey", path: "/surveys/edit?:surveyID" },
      { name: "search", path: "/search?:q" },
    ],
  },
  {
    name: "dormtrak",
    path: "/dormtrak",
    children: [
      { name: "policy", path: "/policy" },
      { name: "neighborhoods", path: "/neighborhoods/:neighborhoodID" },
      { name: "dorms", path: "/dorms/:dormID" },
      { name: "newReview", path: "/reviews/new?:dormID" },
      { name: "editReview", path: "/reviews/edit?:reviewID" },
      { name: "search", path: "/search?:q" },
    ],
  },
  { name: "login", path: "/account/login" },
  { name: "logout", path: "/account/logout" },
];
