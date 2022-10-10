## Instructions

Docker installation requires .env configuration file, docker-compose.yml compose file, Dockerfile, neo4j.conf and the entrypoint run.js file. 

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




