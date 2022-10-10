## Instructions

Docker installation requires .env configuration file, docker-compose.yml compose file, Dockerfile, neo4j.conf and the entrypoint run.js file. 

### .env

This file contains environment variables for initialization and configuration settings for the container and its Backend, Frontend and HMAS Container.

STATE$~~~~~~~~~~~$                           - the state of container || installed or uninstalled<br/>
DOMAIN$~~~~~~~~~~~$                          - the domain address || Default is localhost<br/>
REST_HOST$~~~~~~~~~~~$                       - the host of the REST API for Frontend in production mode<br/>
REST_PORT=5000$~~~~~~~~~~~$                  - the port of the REST API for Frontend in production mode<br/>
NEO4J_HOST=localhost$~~~~~~~~~~~$            - the host of the NEO4J for Frontend in production mode<br/>
NEO4J_PORT=7474  $~~~~~~~~~~~$               - the port of the NEO4J for Frontend in production mode<br/>
REST_ADMIN_USERNAME=admin $~~~~~~~~~~~$      - the default username for Frontend<br/>
REST_ADMIN_PASSWORD=password  $~~~~~~~~~~~$  - the default password for Frontend<br/>



