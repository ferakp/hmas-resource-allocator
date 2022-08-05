import bcrypt from 'bcrypt';

export let userQuery = null;
export let userValues = null;
export let moderatorQuery = null;
export let moderatorValues = null;
export let adminQuery = null;
export let adminValues = null;
export let appQuery = null;
export let appValues = null;

export const initialize = async () => {
  userQuery = 'INSERT INTO users (role, username, password, email, firstname, lastname, created_on, updated_on) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
  userValues = ['user', 'user', await encryptPassword('password'), 'user@demo.com', 'demo', 'demo', new Date('2022-06-10T18:24:21.381Z'), new Date('2022-06-10T18:24:21.381Z')];

  moderatorQuery = 'INSERT INTO users (role, username, password, email, firstname, lastname, created_on, updated_on) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
  moderatorValues = [
    'moderator',
    'moderator',
    await encryptPassword('password'),
    'moderator@demo.com',
    'demo',
    'demo',
    new Date('2022-06-10T18:24:21.381Z'),
    new Date('2022-06-10T18:24:21.381Z'),
  ];

  adminQuery = 'INSERT INTO users (role, username, password, email, firstname, lastname, created_on, updated_on) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
  adminValues = ['admin', 'admin', await encryptPassword('password'), 'admin@demo.com', 'demo', 'demo', new Date('2022-06-10T18:24:21.381Z'), new Date('2022-06-10T18:24:21.381Z')];

  appQuery = 'INSERT INTO users (role, username, password, email, firstname, lastname, created_on, updated_on) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
  appValues = ['app', 'app', await encryptPassword('password'), 'app@demo.com', 'demo', 'demo', new Date('2022-06-10T18:24:21.381Z'), new Date('2022-06-10T18:24:21.381Z')];
};

async function encryptPassword(plainPassword) {
  return new Promise(function (resolve, reject) {
    bcrypt.hash(plainPassword, 10, function (err, hash) {
      if (err) {
        resolve(null);
      } else {
        resolve(hash);
      }
    });
  });
}
