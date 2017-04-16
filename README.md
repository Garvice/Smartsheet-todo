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
* To update these packages later on, just run `npm update`

# Configure
In order to make this work there is a series of steps that need to be completed in order to successfully configure this application. 
You will need to generate an API Token, create a Task-List type Sheet, and obtain Ids for the Sheet and relevant columns - 'Task Name' and 'Done'. 

1. Obtain an Access-Token and update `proxy.conf.json` to include your Access Token.
2. Create a new sheet of type Task-List and update `src/smartsheet.config.ts` with the SheetId
3. Run the application using `$ npm start`. Browse to `http://localhost:4200` and look sinside the Browser's developer console to find the response from requesting the Sheet
and obtain the ColumnIds for 'Task Name' and 'Done'. Add these Ids to `src/smartsheet.config.ts` in the appropriate location.

Once this is completed you should be able to run the application using `$ npm start` and browse to it at `http://localhost:4200`

** As noted, DO NOT change the `smartsheetUrl` in `smartsheet.config.ts`.

# Run
Run this application using npm:

`$ npm start`

Your application should run on port 4200 with the development environment configuration, 
so in your browser just go to http://localhost:4200
