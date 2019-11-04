module.exports = {
  css: ["build/static/css/*.css"],
  content: ["build/static/index.html", "build/static/js/*.js"],
  out: ["build/static/css"],
  whitelistPatternsChildren: [/react-date-picker/],
  rejected: false,
};
