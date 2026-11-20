import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier/flat";
import confusingBrowserGlobals from "confusing-browser-globals";

export default tseslint.config(
  { ignores: ["build/", "coverage/", "node_modules/"] },
  // ESLint 8 did not report these; many disable airbnb rules for if it is re-enabled
  { linterOptions: { reportUnusedDisableDirectives: "off" } },
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    extends: [js.configs.recommended, react.configs.flat.recommended],
    plugins: {
      "react-hooks": reactHooks,
      import: importPlugin,
      "jsx-a11y": jsxA11y,
      prettier: prettierPlugin,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.serviceworker,
        ...globals.vitest,
      },
    },
    settings: {
      react: { version: "detect" },
      "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    rules: {
      // Carried over from eslint-config-react-app, which this config replaces
      "array-callback-return": "warn",
      eqeqeq: ["warn", "smart"],
      "no-caller": "warn",
      "no-eval": "warn",
      "no-extend-native": "warn",
      "no-extra-bind": "warn",
      "no-extra-label": "warn",
      "no-implied-eval": "warn",
      "no-iterator": "warn",
      "no-label-var": "warn",
      "no-labels": ["warn", { allowLoop: true, allowSwitch: false }],
      "no-lone-blocks": "warn",
      "no-loop-func": "warn",
      "no-multi-str": "warn",
      "no-new-func": "warn",
      "no-object-constructor": "warn",
      "no-new-wrappers": "warn",
      "no-octal-escape": "warn",
      "no-script-url": "warn",
      "no-self-compare": "warn",
      "no-sequences": "warn",
      "no-template-curly-in-string": "warn",
      "no-throw-literal": "warn",
      "no-restricted-globals": ["error", ...confusingBrowserGlobals],
      "no-useless-computed-key": "warn",
      "no-useless-concat": "warn",
      "no-useless-rename": [
        "warn",
        {
          ignoreDestructuring: false,
          ignoreImport: false,
          ignoreExport: false,
        },
      ],
      strict: ["warn", "never"],
      "no-restricted-properties": [
        "error",
        {
          object: "require",
          property: "ensure",
          message:
            "Please use import() instead. More info: https://facebook.github.io/create-react-app/docs/code-splitting",
        },
        {
          object: "System",
          property: "import",
          message:
            "Please use import() instead. More info: https://facebook.github.io/create-react-app/docs/code-splitting",
        },
      ],
      "import/first": "error",
      "import/no-amd": "error",
      "import/no-anonymous-default-export": "warn",
      "import/no-webpack-loader-syntax": "error",
      "react/forbid-foreign-prop-types": ["warn", { allowInPropTypes: true }],
      "react/jsx-pascal-case": ["warn", { allowAllCaps: true, ignore: [] }],
      "react/no-typos": "error",
      "react/style-prop-object": "warn",
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-has-content": "warn",
      "jsx-a11y/aria-activedescendant-has-tabindex": "warn",
      "jsx-a11y/aria-props": "warn",
      "jsx-a11y/aria-proptypes": "warn",
      "jsx-a11y/aria-role": ["warn", { ignoreNonDOM: true }],
      "jsx-a11y/aria-unsupported-elements": "warn",
      "jsx-a11y/heading-has-content": "warn",
      "jsx-a11y/iframe-has-title": "warn",
      "jsx-a11y/img-redundant-alt": "warn",
      "jsx-a11y/no-access-key": "warn",
      "jsx-a11y/no-distracting-elements": "warn",
      "jsx-a11y/no-redundant-roles": "warn",
      "jsx-a11y/role-has-required-aria-props": "warn",
      "jsx-a11y/role-supports-aria-props": "warn",
      "jsx-a11y/scope": "warn",
      "no-inner-declarations": "error",
      "no-unused-vars": [
        "error",
        { args: "none", ignoreRestSiblings: true, caughtErrors: "none" },
      ],
      // ESLint 9 changed the default to true
      "no-redeclare": ["error", { builtinGlobals: false }],

      "react-hooks/rules-of-hooks": "error",
      "prettier/prettier": "warn",
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
  },
  {
    files: ["src/**/*.{js,jsx}"],
    rules: {
      // eslint-config-react-app enabled these for JS only
      "default-case": ["warn", { commentPattern: "^no default$" }],
      "no-array-constructor": "warn",
      "no-unused-expressions": [
        "error",
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
          enforceForJSX: false,
        },
      ],
      "no-useless-constructor": "warn",
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [tseslint.configs.recommended],
    languageOptions: {
      parserOptions: { project: ["./tsconfig.json"] },
    },
    rules: {
      // eslint-config-react-app enabled these for TS only
      "@typescript-eslint/consistent-type-assertions": "warn",
      "@typescript-eslint/no-redeclare": "warn",
      "@typescript-eslint/no-useless-constructor": "warn",
      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
          enforceForJSX: false,
        },
      ],

      // base rule can report incorrect errors: https://stackoverflow.com/questions/63818415/react-was-used-before-it-was-defined
      "no-use-before-define": "off",
      "@typescript-eslint/no-use-before-define": [
        "error",
        { functions: false },
      ],
      "@typescript-eslint/no-unused-vars": ["error", { caughtErrors: "none" }],
    },
  },
  prettierConfig
);
