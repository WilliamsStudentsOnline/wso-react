export default [
  { name: "home", path: "/" },
  {
    name: "bulletins",
    path: "/bulletins/:type",
    children: [
      { name: "show", path: "/:bulletinID" },
      { name: "new", path: "/new" },
      { name: "edit", path: "/edit?:bulletinID" },
    ],
  },
  {
    name: "discussions",
    path: "/discussions",
    children: [
      { name: "new", path: "/new" },
      { name: "show", path: "/threads/:discussionID" },
    ],
  },
  { name: "rides", path: "/rides" },
  { name: "about", path: "/about" },
  { name: "scheduler", path: "/schedulecourses" },
  {
    name: "facebook",
    path: "/facebook?:q",
    children: [
      { name: "help", path: "/help" },
      { name: "users", path: "/users/:userID" },
      { name: "edit", path: "/edit" },
    ],
  },
  {
    name: "factrak",
    path: "/factrak",
    children: [
      { name: "policy", path: "/policy" },
      { name: "surveys", path: "/surveys" },
      { name: "moderate", path: "/moderate" },
      { name: "areasOfStudy", path: "/areas-of-study/:area" },
      {
        name: "courses",
        path: "/courses/:courseID",
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
      { name: "newReview", path: "/reviews/new" },
      { name: "editReview", path: "/reviews/edit?:reviewID" },
      { name: "search", path: "/search?:q" },
    ],
  },
  {
    name: "ephcatch",
    path: "/ephcatch",
    children: [
      { name: "optOut", path: "/opt-out" },
      { name: "matches", path: "/matches" },
      { name: "profile", path: "/profile" },
    ],
  },
  {
    name: "ephmatch",
    path: "/ephmatch",
    children: [
      { name: "matches", path: "/matches" },
      { name: "profile", path: "/profile" },
      { name: "optOut", path: "/opt-out" },
    ],
  },
  { name: "login", path: "/account/login" },
  { name: "logout", path: "/account/logout" },
  { name: "faq", path: "/faq" },
  { name: "403", path: "/403" },
  { name: "500", path: "/500" },
];
