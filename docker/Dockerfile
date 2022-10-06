# syntax=docker/dockerfile:1
FROM ubuntu:22.04
WORKDIR /app

RUN apt-get install sudo -y

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get upgrade -y
RUN apt-get install git -y

RUN apt-get install curl -y
RUN curl -s https://deb.nodesource.com/setup_16.x | bash
RUN apt-get install -y nodejs

RUN sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
RUN apt-get install wget -y
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
RUN apt-get update && apt-get upgrade -y
RUN apt-get install postgresql postgresql-contrib -y
RUN apt-get install systemctl -y

RUN echo "deb http://httpredir.debian.org/debian stretch-backports main" | tee -a /etc/apt/sources.list.d/stretch-backports.list
RUN apt-get update -y
RUN apt-get install openjdk-11-jre
RUN add-apt-repository universe
RUN wget -O - https://debian.neo4j.com/neotechnology.gpg.key | sudo apt-key add -
RUN echo 'deb https://debian.neo4j.com stable latest' | sudo tee -a /etc/apt/sources.list.d/neo4j.list
RUN apt-get update
RUN apt-get install neo4j=1:4.4.9

RUN sudo npm install babel-cli -g
RUN sudo npm install dotenv -g
RUN sudo npm install serve -g

EXPOSE 3000
EXPOSE 5000
EXPOSE 7474

COPY . .

CMD [ "node", "./run.js" ]