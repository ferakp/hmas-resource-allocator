import { exec } from 'child_process';

let loginUsername = null;
let loginPassword = null;

const configInterval = setInterval(() => {
  if (process.env.GRAPH_DB_USERNAME && process.env.GRAPH_DB_PASSWORD) {
    loginUsername = process.env.GRAPH_DB_USERNAME;
    loginPassword = process.env.GRAPH_DB_PASSWORD;
    clearInterval(configInterval);
  }
}, 500);

export let newUsers = [];
const addUsersInterval = setInterval(async () => {
  const failed = [];
  for (let i = 0; i < newUsers.length; i++) {
    const account = newUsers.pop();
    const username = account[0];
    const password = account[1];
    const response = await createAccount(username, password);
    if (!response) failed.push(account);
  }
  newUsers = newUsers.concat(failed);
}, 1000);

export async function registerAccount(username, password) {
  newUsers.push([username, password]);
}

/**
 * Cretes Neo4j account with given password and username
 * If an account with given username already exists, it will be deleted
 * @param {string} username
 * @param {string} password
 */
export async function createAccount(username, password) {
  try {
    if (loginUsername === null || loginPassword === null) return false;
    const baseCommand = 'cypher-shell -u ' + loginUsername + ' -p ' + loginPassword;
    let deleteCommand = baseCommand + ' > echo ' + " 'DROP USER " + username + " IF EXISTS'";
    if (!executeCommand(deleteCommand)) return false;
    let createUserCommand = baseCommand + " > echo 'CREATE USER " + username + ' SET PASSWORD "' + password + '" CHANGE NOT REQUIRED\'';
    if (!executeCommand(createUserCommand)) return false;
    return true;
  } catch (err) {
    return false;
  }
}

const executeCommand = async (command) => {
  return new Promise((r) => {
    exec(command, (error, stdout, stderr) => {
      if (stderr || error) {
        r(false);
      }
      r(true);
    });
  });
};

export const stop = () => {
  clearInterval(addUsersInterval);
  clearInterval(configInterval);
};
