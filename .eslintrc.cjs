module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
    jest: true,
    serviceworker: true,
    browser: true,
  },
  extends: [
    "eslint:recommended",
    "airbnb",
    "plugin:react/recommended",
    "react-app",
    "prettier",
    "prettier/react",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["react", "jest", "prettier", "react-hooks"],
  "settings": {
    "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
  rules: {
    "react/forbid-prop-types": ["warn", { forbid: ["any", "array"] }],
    "no-restricted-syntax": "off",
    "react/destructuring-assignment": "off",
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    "prefer-destructuring": ["error", { array: false }],
    "no-continue": "off",
    "import/order": "off",
    "react/jsx-filename-extension": "off",
    "jsx-a11y/anchor-is-valid": "off",
    "jsx-a11y/no-autofocus": "off",
    "react/jsx-one-expression-per-line": "off",
    "react-hooks/exhaustive-deps": "off",
    "react/jsx-props-no-spreading": ["error", { html: "ignore" }],
    "no-use-before-define": ["error", { functions: false }],
    "no-param-reassign": "off",
    "react/prop-types": "warn",
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
  },
  overrides: [
    {
      files: ["**/*.ts?(x)"],
      parser: "@typescript-eslint/parser",
      parserOptions: { project: ["./tsconfig.json"] },
      extends: ["plugin:@typescript-eslint/recommended"],
      plugins: ["@typescript-eslint"],
      rules: {
        // base rule can report incorrect errors: https://stackoverflow.com/questions/63818415/react-was-used-before-it-was-defined
        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": [
          "error",
          { functions: false },
        ],
      },
    },
  ],
};
