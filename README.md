# Resource allocation system

Resource allocation system is a web application for smart resource allocation. It's a holonic multiagent system based on knowledge graph with REST API.  

## Using system

It is available both as a standalone server, or an embeddable component. 

## Dependencies

The system is built using [PostgreSQL](https://www.postgresql.org/) version 14 and a recent version of supported Neo4j (4.4 is recommended). Node and Express are also required.

## Production

The web application is available for production as a Docker container. Please, read /Docker folder's README file for further instructions. 

## Development

Following instructions helps to set up a development environment:<br>

- Install Postgresql version 14 and create a new database and credentials. 
- Install latest Node version.
- Install Neo4j version 4.4 and create an username and password.
- Clone the repository and install dependencies of src/server/backend, src/server/hmas-container and src/client/ folders with<br> <b>sudo npm install</b> command.
- Open src/server/backend/.env file and set NODE_ENV variable's value to <b>development</b>. Then add your database's connection parameters to DB_ variables. 
- Open src/server/hmas-container/.env file and configure both GRAPH_ and REST_API_ variables. 
- Run all three components with <b>npm run start</b> command. 
