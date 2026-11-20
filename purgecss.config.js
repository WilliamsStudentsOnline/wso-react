module.exports = {
  css: ["build/assets/*.css"],
  content: ["build/index.html", "build/assets/*.js"],
  output: "build/assets",
  safelist: {
    standard: [
      /^homepage-status-dot-/,
      /^dining-status-pill-/,
      /^dining-table-status-/,
      /^dining-meal-status-/,
      /^homepage-dining-row-status-/,
      /^dining-menu-card--/,
      /^dining--menu-open$/,
    ],
    deep: [/react-date-picker/],
  },
  rejected: false,
};
