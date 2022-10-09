const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
var process = require('process');

/**********************************'******************************
 *            UTILITY FUNCTIONS
 ***********************************'****************************/

const generatePassword = () => {
  return 'a!8jsj11' + Math.floor(Math.random() * 5422554) + 'aas3' + Buffer.from(Math.random().toString()).toString('base64').substring(10, 15);
};

const runCommand = (command) => {
  execSync(command, { encoding: 'utf8' });
};

const addEnvVariable = (filePath, envName, content) => {
  let data = fs.readFileSync(filePath, { encoding: 'utf8' }).split('\n');
  data.forEach((line, i) => {
    if (line.startsWith(envName)) data[i] = envName + '=' + content;
  });
  fs.writeFileSync(filePath, data.join('\n'));
};

runCommand('sudo npm install dotenv --save');
const dotenv = require('dotenv');

const wait = async (ms) => {
  return new Promise((r) => setTimeout(r, ms));
};


/**********************************'******************************
 *            CONTENT
 ***********************************'****************************/

dotenv.config({ path: path.join(__dirname + '/.env') });
const isInstalled = process.env.STATE === 'installed';

if (!isInstalled) {
  /**********************************'******************************
   *            REPOSITORY
   ***********************************'****************************/

  runCommand('sudo git clone https://github.com/ferakp/hmas-resource-allocator.git');

  runCommand('sudo apt-get install software-properties-common -y');
  runCommand('sudo apt-get -y install systemctl');
  runCommand('sudo apt-get install apt-utils -y');

  /**********************************'******************************
   *            POSTGRESQL INSTALLATION & CONFIGURATION
   ***********************************'****************************/

  let defaultPassword = generatePassword();
  let postgresqlUsername = 'hmas' + Math.floor(Math.random() * 9999999);
  let postgreSqlPassword = generatePassword();

  // Configure
  runCommand('sudo service postgresql start');
  runCommand(`sudo -u postgres psql -c "ALTER USER postgres PASSWORD '${defaultPassword}';" `);
  runCommand(`sudo -u postgres psql -c "CREATE DATABASE hmas;" `);
  runCommand(`sudo -u postgres psql -c "CREATE USER ${postgresqlUsername} WITH PASSWORD '${postgreSqlPassword}';" `);
  runCommand(`sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE hmas TO ${postgresqlUsername};" `);

  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/backend/.env'), 'DB_DATABASE', 'hmas');
  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/backend/.env'), 'DB_PASSWORD', postgreSqlPassword);
  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/backend/.env'), 'DB_USER', postgresqlUsername);
  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/backend/.env'), 'DB_CONLIMIT', 150);
  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/backend/.env'), 'DB_HOST', 'localhost');
  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/backend/.env'), 'DB_PORT', 5432);
  console.log("PostgreSQL configured");

  /**********************************'******************************
   *            NEO4J INSTALLATION & CONFIGURATION
   ***********************************'****************************/

  let neo4jPassword = generatePassword();

  // Configure
  runCommand('sudo neo4j-admin set-initial-password ' + neo4jPassword);
  runCommand('sudo cp ./neo4j.conf /etc/neo4j/');
  runCommand('sudo systemctl enable neo4j.service');
  runCommand('sudo service neo4j start');

  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/backend/.env'), 'GRAPH_DB_USERNAME', 'neo4j');
  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/backend/.env'), 'GRAPH_DB_PASSWORD', neo4jPassword);

  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/hmas-container/.env'), 'GRAPH_DB_HOST', 'localhost');
  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/hmas-container/.env'), 'GRAPH_DB_PORT', 7687);
  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/hmas-container/.env'), 'GRAPH_DB_USERNAME', 'neo4j');
  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/hmas-container/.env'), 'GRAPH_DB_PASSWORD', neo4jPassword);
  console.log("Neo4j configured");

  /**********************************'******************************
   *            BACKEND INSTALLATION & CONFIGURATION
   ***********************************'****************************/

  runCommand('cd hmas-resource-allocator/src/server/backend');
  process.chdir(path.join(__dirname, 'hmas-resource-allocator/src/server/backend'));

  const hmasRestPassword = generatePassword();

  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/backend/.env'), 'REST_ADMIN_USERNAME', process.env.REST_ADMIN_USERNAME || "username");
  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/backend/.env'), 'REST_ADMIN_PASSWORD', process.env.REST_ADMIN_PASSWORD || "password");
  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/backend/.env'), 'NODE_ENV', 'production');
  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/backend/.env'), 'HMAS_HOST', 'localhost');
  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/backend/.env'), 'HMAS_PORT', 5001);
  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/backend/.env'), 'HMAS_ACCOUNT', 'app');
  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/backend/.env'), 'HMAS_PASSWORD', hmasRestPassword);

  runCommand('sudo npm install pm2@latest -g');
  runCommand('sudo npm install');
  console.log("Backend installed");

  /**********************************'******************************
   *            HMAS CONTAINER INSTALLATION & CONFIGURATION
   ***********************************'****************************/

  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/hmas-container/.env'), 'NODE_ENV', 'production');
  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/hmas-container/.env'), 'HOST', 'localhost');
  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/hmas-container/.env'), 'PORT', '5001');
  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/hmas-container/.env'), 'APP_USERNAME', 'app');
  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/hmas-container/.env'), 'APP_PASSWORD', hmasRestPassword);
  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/hmas-container/.env'), 'REST_API_HOST', 'localhost');
  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/hmas-container/.env'), 'REST_API_PORT', '5000');

  process.chdir(path.join(__dirname, 'hmas-resource-allocator/src/server/hmas-container'));
  runCommand('sudo npm install');
  console.log("HMAS Container installed");

  /**********************************'******************************
   *            FRONTEND INSTALLATION & CONFIGURATION
   ***********************************'****************************/

  dotenv.config({ path: path.join(__dirname + '/.env') });
  if (process.env.DOMAIN !== 'localhost') {
    addEnvVariable(path.join(__dirname, '.env'), 'REST_HOST', 'api.' + process.env.DOMAIN);
    addEnvVariable(path.join(__dirname, '.env'), 'REST_PORT', 80);
    addEnvVariable(path.join(__dirname, '.env'), 'NEO4J_HOST', 'neo4j.' + process.env.DOMAIN);
    addEnvVariable(path.join(__dirname, '.env'), 'NEO4J_PORT', 80);
  } else {
    addEnvVariable(path.join(__dirname, '.env'), 'REST_HOST', 'localhost');
    addEnvVariable(path.join(__dirname, '.env'), 'REST_PORT', 5000);
    addEnvVariable(path.join(__dirname, '.env'), 'NEO4J_HOST', 'localhost');
    addEnvVariable(path.join(__dirname, '.env'), 'NEO4J_PORT', 7474);
  }
  dotenv.config({ path: path.join(__dirname + '/.env') });
  process.chdir(path.join(__dirname, 'hmas-resource-allocator/src/client/'));
  runCommand('export DOMAIN=' + process.env.DOMAIN);
  runCommand('export REST_HOST=' + process.env.REST_HOST);
  runCommand('export REST_PORT=' + process.env.REST_PORT);
  runCommand('export NEO4J_HOST=' + process.env.NEO4J_HOST);
  runCommand('export NEO4J_PORT=' + process.env.NEO4J_PORT);
  runCommand('sudo npm install');
  runCommand('sudo npm run build');
  console.log("Frontend installed");

  /**********************************'******************************
   *            THE REST OF CONFIGURATIONS
   ***********************************'****************************/

  addEnvVariable(path.join(__dirname, '.env'), 'STATE', 'installed');
}

// Run
process.chdir(path.join(__dirname, 'hmas-resource-allocator/src/server/backend'));
runCommand('pm2 start app.js --interpreter ./node_modules/@babel/node/bin/babel-node.js');
process.chdir(path.join(__dirname, 'hmas-resource-allocator/src/server/hmas-container'));
runCommand('pm2 start app.js --interpreter ./node_modules/@babel/node/bin/babel-node.js');
process.chdir(path.join(__dirname, 'hmas-resource-allocator/src/client'));
runCommand('pm2 serve build/');
console.log("Frontend, Backend and HMAS Container are running");

const run = async () => {
  while (true) {
    await wait(5000);
  }
};

run();
