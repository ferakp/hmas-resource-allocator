import neo4j from 'neo4j-driver';

let host = null;
let port = null;
let username = null;
let password = null;
let driver = null;

let configInterval = setInterval(async () => {
  if (process.env.GRAPH_DB_USERNAME && process.env.GRAPH_DB_PASSWORD && process.env.GRAPH_DB_HOST && process.env.GRAPH_DB_PORT) {
    username = process.env.GRAPH_DB_USERNAME;
    password = process.env.GRAPH_DB_PASSWORD;
    host = process.env.GRAPH_DB_HOST;
    port = process.env.GRAPH_DB_PORT;
    driver = new neo4j.driver('neo4j://' + host + ':' + port, neo4j.auth.basic(username, password));
    clearInterval(configInterval);
  }
}, 500);

export const configure = (host, port, username, password) => {
  clearInterval(configInterval);
  username = username;
  password = password;
  host = host;
  port = port;
  driver = new neo4j.driver('neo4j://' + host + ':' + port, neo4j.auth.basic(username, password));
};

export const getGraph = async (type, id) => {
  const session = await driver.session();
  try {
    const result = await session.run(`MATCH (n:${type} {id:${id}})-[r*1..4]-(y) return n, r, y`);
    return result.records;
  } catch (err) {
    return [];
  } finally {
    await session.close();
  }
};

export const executeCommand = async (command) => {
  const session = await driver.session();
  try {
    const result = await session.run(command);
    return result.records;
  } catch (err) {
    console.log(err);
    return [];
  } finally {
    await session.close();
  }
};

export const stop = () => {
  try {
    driver.close();
  } catch (err) {}
};
