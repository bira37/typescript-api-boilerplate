# TypeScript API Boilerplate

### This API Boilerplate features:

  * Node
  * Express
  * TypeScript
  * ESLint
  * Prettier
  * Jest
  * Docker
  * PostgreSQL

### Scripts

  * `npm ci` - installs all dependencies

  * `npm run dev` - starts the local server

  * `npm run build` - transpile the typescript into javascript on **dist** folder

  * `npm run prettier`: runs _prettier_ on entire project (only checks for errors)

  * `npm run fix-prettier`: runs _prettier_ on entire project to fix errors

  * `npm run lint`: runs _eslint_ on entire project to check for errors (only typescript files)

  * `npm run fix-lint`: runs _eslint_ on entire project to repair fixable errors (only typescript files)

  * `npm run type-check`: runs typescript compiler to check for errors

  * `npm test`: runs all test suites present on **tests** folder

  * `npm run docker-postgres`: starts a local PostgreSQL instance for tests/local development

### API Structure

The API is divided within several parts:

  - Controllers: Contains the implementation of all endpoints

  - Middlewares: Contains the implementation of all middlewares

  - Routes: Contains the declaration of all endpoints

  - Schemas: Contains interfaces / types of variables that will be used on controllers

  - Validators: Contains the declaration of validators that will be used to validate the request body

### Authentication

Authentication is made using JSON Web Tokens. In this example, users need to make a request to the login endpoint, passing their credentials. If the authentication succeeds, they will receive an temporary access token. This token needs to be inserted on _x-access-token_ header every time they make a request to some protected endpoint. The validation time of the token can be changed through an environment variable.

### Adding New Routes and Controllers

The _app.ts_ file contains the implementation of the method that creates an express app instance. To insert new routes and controllers to the API, simply add it at the end of this function, following the pattern used by auth and user routes.

### Middlewares

The API contains some middlewares used to simplify some tasks and guarantee that the request is well formed before it arrives at its specific controller. They are:

  - Body Validator: Validate the body structure of the request using the specified validator, to ensure that the request is well formed when it moves forward to be processed.

  - Auth: Check if the user is authenticated

  - Invoker: Invokes the corresponding controller method, taking care of organizing the parameters

  - Context Creator: Builds the Context variable

### The Context Variable

The context is the first parameter of every controller call, containing some functions and information from the context where the function was invoked. It contains:

  - The current logged user information

  - A Tag Function called _sql_, from where you can write queries to access your database.

  - A function called _transaction_ that receives a callback. All queries executed inside this callback using the _sql_ parameter received run inside a transaction, only commiting the changes if the callback finishes its execution flawlessly.

### Database Migrations

You can store migrations on the _migrations/migrations.ts_ file. They are automatically executed when the server / tests run. They are organized as a key-value pair. The key value of the migration unically identifies it on the database. Each migration executes only once, then its key value is stored on the database to prevent it running again.

### Test Environment

  * Inside the test environment, you can use the _call_, found on _setup.ts_ file, to make requests to the API. This function returns a status code and the response data from the request.

  * During the tests, two test users are created with different privileges. You can use them to make calls that needs authentication. Check the existing tests to see how you can use them.

### The GitLab CI File

A GitLab CI configuration file is also available. It contains a complete pipeline with Lint, Prettier and Type checks, a test stage, a build stage (to build the docker image that will be deployed) and a deploy stage on Heroku Platform. If you want to use it, make sure you add the needed CI variables on your GitLab Repository and the environment variables needed to run the server on Heroku.

### Observations

  * Before you run the local server or tests, make sure you start the local PostgreSQL instance

  * Before each commit, both _prettier_, _eslint_ and _typescript check_ are executed on entire project to check for errors. You can bypass this check by passing _--no-verify_ flag on _git commit_. 