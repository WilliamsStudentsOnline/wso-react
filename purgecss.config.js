module.exports = {
  css: ["build/static/css/*.css"],
  content: ["build/static/index.html", "build/static/js/*.js"],
  out: ["build/static/css"],
  whitelistPatterns: [
    /^homepage-status-dot-/,
    /^dining-status-pill-/,
    /^dining-table-status-/,
    /^dining-meal-status-/,
    /^homepage-dining-row-status-/,
  ],
  whitelistPatternsChildren: [/react-date-picker/],
  rejected: false,
};
