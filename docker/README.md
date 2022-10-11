## Docker

Docker installation requires .env configuration file, docker-compose.yml compose file, Dockerfile, neo4j.conf and the entrypoint run.js file. Docker compose file is configured for production mode and requires a domain name. If you don't have a domain name and you just want to try the application, please use development version. 

### .env

This file contains environment variables for initialization and configuration settings for the container and its Backend, Frontend and HMAS Container.

| Variable   | Description                                                              |
|--------|-------------------------------------------------------------------------|
| STATE |   State of container     || installed or uninstalled                                                                 |
| DOMAIN | Domain address || Default is localhost |
| REST_HOST  | Host of the REST API for Frontend in production mode |
| REST_PORT | Port of the REST API for Frontend in production mode |
| NEO4J_HOST | Host of the NEO4J for Frontend in production mode |
| NEO4J_PORT | Port of the NEO4J for Frontend in production mode |
| REST_ADMIN_USERNAME | Default username for Frontend |
| REST_ADMIN_PASSWORD | Default password for Frontend |


## Installation instructions

Before installing and running docker container make sure you have enough memory (2GB+) and disk space (10GB+). <br/>

### Requirements

To install and run container you need to make sure of the following:

* Apache Tomcat 10.1.0 is installed or available 
* A domain name

#### Step 1
Open .env file and add your domain name without protocol. For example, mydomain.com.

#### Step 2
Set the value of STATE variable to uninstalled. 

#### Step 3
Move to /docker directory and run command <b>docker compose up --build<b/>

#### Step 4
Configure your Apache Tomcat with following configurations:
  - Point your domain name to http://localhost:3000
  - Point api subdomain to http://localhost:5000
  - Point neo4j subdomain to http://localhost:7474
