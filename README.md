# SmartsheetTodo

A simple Todo-list built on top of Angular2 which leverages Smartsheet as it's data-store.

This App will allow a user to create new Todos, update the Todos, mark Todos as Done, and Delete any Todos no longer needed.

Additionally as the Smartsheet API does not allow CORS, this APP is using the webpack server as a proxy between the UI and Smartsheet. 
Details of this configuration can be found in `proxy.conf.json`
# Install

`$ npm install`

This command does a few things:
* First it will install the dependencies needed for the application to run.
* If you're running in a development environment, it will then also install development dependencies needed for testing and running your application.
* When the npm packages install process is over, npm will initiate a bower install command to install all the front-end modules needed for the application
* To update these packages later on, just run `npm update`

# Configure
In order to make this work you will need to.
 1. Update `src/smartsheet.config.ts` to include the correct sheetId, and columnIds.
 2. Update `proxy.conf.json` to include the correct SmartsheetAPI Access Token.


# Run
Run this application using npm:

`$ npm start`

Your application should run on port 4200 with the development environment configuration, 
so in your browser just go to http://localhost:4200
