# WSO-React

This repository contains all the front-end code to the Williams Student Online web-app. Core technologies include [React](https://reactjs.org/) (bootstrapped with [Create React App)](https://github.com/facebook/create-react-app), [Redux](https://redux.js.org/basics/usage-with-react), and [Router5](https://router5.js.org/).

- Production Build: https://wso.williams.edu/
- Development Build: https://wso-dev.williams.edu/

Interested in the back-end instead? Head over to our backend [wso-go repository](https://github.com/WilliamsStudentsOnline/wso-go/).

## Suggestions, issues, or bug reports?

We would love to hear from you and discuss them. File an issue [here](https://github.com/WilliamsStudentsOnline/wso-react/issues/new) with one of the templates, and our developers will get back to you shortly!

## Contributing

1. Open an issue and discuss your planned change with the repository administrators. This is important to avoid any wasted effort if you choose an approach that is not encouraged by the admins.
1. Once the admins have approved your intended change, create a branch in the repository from `master`.
1. Make your modifications in the branch.
1. When you are ready, make a pull request and request for review from a admin.
1. Once the pull request has been approved, squash and merge it.
1. Congratulations! You're done!

## Getting Started

**1) Check for your Node version**

```
$ node -v
```

If the above command results in an error, download the latest Node version [here](https://nodejs.org/en/).

**2) Check for your Yarn version**

```
$ yarn -v
```

If the above command results in an error, download the latest Yarn version [here](https://yarnpkg.com/en/).

**3) Clone the repo into your working directory**

```
$ git clone https://github.com/WilliamsStudentsOnline/wso-react.git

or

$ git clone git@github.com:WilliamsStudentsOnline/wso-react.git
```

**4) Install the necessary dependencies**

```
$ yarn
```

You should be all set! To get started, run

```
$ yarn start
```

to launch a development build, which includes Hot Module Reload(HMR), where changes you make will be instantly reflected without having to restart the server. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

**5) Communicating with the Backend**

By default, the development server will communicate with [wso-dev.williams.edu](wso-dev.wso.williams.edu). This is fine for most frontend-focused development!

However, you may wish to set up the backend to allow our client to get the information from a local server. To do so, set up the backend as per the instructions in the [wso-go repository](https://github.com/WilliamsStudentsOnline/wso-go/), and run the `wso-go` server alongside the React development server. If you're working in VSCode, you should see ports `:8080` (backend) and `:3000` (frontend) in use on your machine. You should then change `setupProxy.js` to point to `localhost:8080` (instead of `wso-dev`) to access your local development backend.

`setupProxy.js` enables all HTTP requests to be made to `/path/to/endpoint` without further settings--so don't worry about changing URL paths!

## Development

**Optional Installations:**
To aid in your development process, we also suggest installing the following:

- React Developer Tools ([Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi), [Firefox](https://addons.mozilla.org/firefox/addon/react-devtools/))
- [Redux DevTools](http://extension.remotedev.io/#installation)
- Configuring [Prettier](https://prettier.io/) to work with your editor. We have a pre-commit hook which automatically formats your code before commit so that the repo will have consistent formatting, but it is helpful to know how to configure Prettier to format your code on save so it looks nice as you're typing it up!
- Configuring [ES-Lint](https://eslint.org/) to work with your editor. Like Prettier, we have a pre-commit hook to ensure that your code fits our standards, but unlike the Prettier hook, the commit will fail if there are errors, so it will help your development loop if it is configured with your editor.

**Styling**
Styling is currently done via vanilla CSS, although we will likely be moving to a React component library soon (see [issue #2](https://github.com/WilliamsStudentsOnline/wso-react/issues/2)).

**Where to begin:**

- Start by reading the section on contributing to find out the ways you can contribute to this repository. Contrary to popular belief, contributions need not come in the form of code. Fixing typos, creating issues for bugs, adding comments, suggesting tutorials, and helping out the community are valued ways of contributing.
- If you're interested in learning more about React and Redux, we recommend [this tutorial](https://www.robinwieruch.de/react-redux-tutorial/#react-redux-and-x-tutorial).
- Look out for issues labelled as 'good first issue' [here](https://github.com/WilliamsStudentsOnline/wso-react/labels/good%20first%20issue). These issues are usually what we have deemed to be great places to get your feet wet.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn analyze`

Analyzes the bundle size of the build - useful to understand how the bundle size changed after
your modifications.
