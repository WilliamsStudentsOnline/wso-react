# WSO-React

This repository contains all the front-end code to the Williams Student Online web-app. Core technologies include [React](https://reactjs.org/) (bootstrapped with [Create React App)](https://github.com/facebook/create-react-app), [Redux](https://redux.js.org/basics/usage-with-react), and [Router5](https://router5.js.org/). If you're interested in learning more about React and Redux, we recommend [this tutorial](https://www.robinwieruch.de/react-redux-tutorial/#react-redux-and-x-tutorial).

- Production Build: https://wso.williams.edu/
- Development Build: https://wso-dev.williams.edu/

Interested in the back-end instead? Head over to our backend [wso-go repository](https://github.com/WilliamsStudentsOnline/wso-go/).

## Suggestions, issues, or bug reports?

We would love to hear from you and discuss them. File an issue [here](https://github.com/WilliamsStudentsOnline/wso-react/issues/new) with one of the templates, and our developers will get back to you shortly!

## Contributing
Steps for a 10/10 development workflow:

1. Notice an issue/feature and create a GitHub issue, or assign yourself to one.
2. Checkout a feature branch: the name should be something like `feature/YOUR-FEATURE-HERE`.
3. Write the code and accompanying tests.
    * Use [stacked pull requests](https://docs.github.com/en/pull-requests/how-tos/stacked-pull-requests) to split large changes into multiple reviewable chunks.
4. Make a pull request and link your original issue.
    * The pull request will be automatically tested, with results displayed in a pinned comment on your PR. More detailed logs are available under Actions.
5. After approval, add the PR (or stack) to the [merge queue](https://github.com/WilliamsStudentsOnline/wso-go/queue/master). After a few minutes, it should be live on our dev server!
6. (optional) After extensive testing on [wso-dev.williams.edu](wso-dev.williams.edu), when you feel your changes are ready for the broader Williams user base, run `make sync-prod` to open a `[DEPLOY]` PR. By default, this will synchronize prod to the latest commit on remote master, though you can also point it to a different commit SHA (e.g. for rollbacks). To deploy to prod, we update a file which essentially points to the version of WSO that will be live on our main server. Note that this process may also pull in unrelated changes; as a result, you may find that admins mostly end up doing this step for you.

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

### Updating the API client

To pull in a new version of our API, run

```bash
# interactive
yarn codegen
# manual
yarn codegen --tag vYYYY.MM.DD
yarn codegen --latest
```

## Development

### Optional Installations:
To aid in your development process, we also suggest installing the following:

- React Developer Tools ([Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi), [Firefox](https://addons.mozilla.org/firefox/addon/react-devtools/))
- [Redux DevTools](http://extension.remotedev.io/#installation)
- Configuring [Prettier](https://prettier.io/) to work with your editor. We have a pre-commit hook which automatically formats your code before commit so that the repo will have consistent formatting, but it is helpful to know how to configure Prettier to format your code on save so it looks nice as you're typing it up!
- Configuring [ES-Lint](https://eslint.org/) to work with your editor. Like Prettier, we have a pre-commit hook to ensure that your code fits our standards, but unlike the Prettier hook, the commit will fail if there are errors, so it will help your development loop if it is configured with your editor.

### Styling

Styling is currently done via vanilla CSS. Edit existing stylesheets or, for larger features, create new ones, and make sure to include them in the appropriate `.tsx`/`.jsx` files. If you add a color, it must go into `Colors.css`, otherwise you will feel the weight of your heavy karmic debt forever and ever for the sin of having broken the dark theme. Ignore this warning only at your own peril!
