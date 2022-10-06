const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

/**********************************'******************************
 *            UTILITY FUNCTIONS
 ***********************************'****************************/

const generatePassword = () => {
  return 'a!8jsj11' + Math.floor(Math.random() * 5422554) + 'aas3' + Buffer.from(Math.random().toString()).toString('base64').substring(10, 15);
};

const runCommand = (command) => {
  console.log(execSync(command, { encoding: 'utf8' }));
};

const addEnvVariable = (filePath, envName, content) => {
  let data = fs.readFileSync(filePath, { encoding: 'utf8' }).split('\n');
  data.forEach((line, i) => {
    if (line.startsWith(envName)) data[i] = envName + '=' + content;
  });
  fs.writeFileSync(filePath, data.join('\n'));
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

  /**********************************'******************************
   *            NEO4J INSTALLATION & CONFIGURATION
   ***********************************'****************************/

  let neo4jPassword = generatePassword();

  // Configure
  runCommand('sudo neo4j-admin set-initial-password ' + neo4jPassword);
  runCommand('sudo systemctl enable neo4j.service');
  runCommand('sudo systemctl start neo4j.service');
  runCommand('sudo systemctl status neo4j.service');

  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/backend/.env'), 'GRAPH_DB_USERNAME', 'neo4j');
  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/backend/.env'), 'GRAPH_DB_PASSWORD', neo4jPassword);

  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/hmas-container/.env'), 'GRAPH_DB_HOST', 'localhost');
  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/hmas-container/.env'), 'GRAPH_DB_PORT', 7687);
  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/hmas-container/.env'), 'GRAPH_DB_USERNAME', 'neo4j');
  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/hmas-container/.env'), 'GRAPH_DB_PASSWORD', neo4jPassword);

  /**********************************'******************************
   *            BACKEND INSTALLATION & CONFIGURATION
   ***********************************'****************************/

  runCommand('cd hmas-resource-allocator/src/server/backend');

  const hmasRestPassword = generatePassword();

  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/backend/.env'), 'NODE_ENV', 'production');
  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/backend/.env'), 'HMAS_HOST', 'localhost');
  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/backend/.env'), 'HMAS_PORT', 5001);
  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/backend/.env'), 'HMAS_ACCOUNT', 'app');
  addEnvVariable(path.join(__dirname, 'hmas-resource-allocator/src/server/backend/.env'), 'HMAS_PASSWORD', hmasRestPassword);

  runCommand('sudo npm install pm2@latest -g');
  runCommand('sudo npm install babel-cli -g');
  runCommand('sudo npm run build');
  runCommand('cd -');

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

  runCommand('cd hmas-resource-allocator/src/server/hmas-container');
  runCommand('sudo npm run build');
  runCommand('cd -');

  /**********************************'******************************
   *            FRONTEND INSTALLATION & CONFIGURATION
   ***********************************'****************************/

  dotenv.config({ path: path.join(__dirname + '/.env') });
  if (process.env.DOMAIN !== 'localhost') {
    addEnvVariable(path.join(__dirname, '.env'), 'REST_HOST', 'api.' + process.env.DOMAIN);
    addEnvVariable(path.join(__dirname, '.env'), 'REST_PORT', 80);
    addEnvVariable(path.join(__dirname, '.env'), 'NEO4J_HOST', 'neo4j.' + process.env.DOMAIN);
    addEnvVariable(path.join(__dirname, '.env'), 'NEO4J_PORT', 80);
  }
  dotenv.config({ path: path.join(__dirname + '/.env') });
  runCommand('cd hmas-resource-allocator/src/client/');
  runCommand('export STATE=' + process.env.STATE);
  runCommand('export DOMAIN=' + process.env.DOMAIN);
  runCommand('export REST_HOST=' + process.env.REST_HOST);
  runCommand('export REST_PORT=' + process.env.REST_PORT);
  runCommand('export NEO4J_HOST=' + process.env.NEO4J_HOST);
  runCommand('export NEO4J_PORT=' + process.env.NEO4J_PORT);
  runCommand('sudo npm install');
  runCommand('sudo npm run build');
  runCommand('cd -');

  /**********************************'******************************
   *            THE REST OF CONFIGURATIONS
   ***********************************'****************************/

  addEnvVariable(path.join(__dirname, '.env'), 'STATE', 'installed');
}

// Run 
runCommand('cd hmas-resource-allocator/src/server/backend');
runCommand('pm2 start app.js');
runCommand('cd -');
runCommand('cd hmas-resource-allocator/src/server/hmas-container');
runCommand('pm2 start app.js');
runCommand('cd -');
runCommand('cd hmas-resource-allocator/src/client');
runCommand('pm2 serve app.js');
runCommand('cd -');

const wait = (ms) => {
  return new Promise(r => setTimeout(r, ms));
}

while(true) {
  await wait(5000);
}
