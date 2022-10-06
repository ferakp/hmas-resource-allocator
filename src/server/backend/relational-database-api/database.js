import { Pool } from 'pg';
import * as errorMessages from './messages/errors';
import * as createTableQueries from './queries/createTable';
import * as testEnvironment from './queries/testEnvironment';

export let connection = {
  pool: null,
  isReady: false,
  err: null,
};

export async function executeQuery(query, values) {
  if (!connection.isReady) return { errors: [errorMessages.DATABASE_CONNECTION_ERROR], databaseError: null, results: [] };
  else {
    const queryWrapper = async (query, values) => {
      return new Promise((resolve, reject) => {
        try {
          connection.pool.query(query, values, (err, result) => {
            if (err) resolve({ errors: [], databaseError: err, results: null });
            else {
              resolve({ errors: [], databaseError: null, results: result.rows });
            }
          });
        } catch (err) {
          resolve({ errors: [errorMessages.DATABASE_CONNECTION_ERROR], databaseError: null, results: null });
        }
      });
    };
    const { errors, databaseError, results } = await queryWrapper(query, values);
    return { errors: errors, databaseError: databaseError, results: results };
  }
}

export async function initializeDatabase() {
  initializeConnection();
  try {
    await createTables(connection.pool);
    if (process.env.NODE_ENV !== 'production') await createTestEnvironment(connection.pool);
    else await createProductionEnvironment(connection.pool);
  } catch (e) {
    connection = {
      err: { ...errorMessages.CREATE_TABLE_ERROR, errorStack: e },
      isReady: false,
    };
  }
}

export function endConnection() {
  if (connection.pool) {
    try {
      connection.pool.end();
    } catch (err) {
      console.log(err);
    }
  }
}

function initializeConnection() {
  const pool = new Pool({
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    host: process.env.DB_HOST,
  });

  connection = {
    pool: pool,
    isReady: true,
    err: null,
  };

  pool.on('error', (err, client) => {
    connection = {
      ...connection,
      isReady: false,
      err: { ...errorMessages.POOL_ON_ERROR, errorStack: err },
    };
    monitorDatabaseConnection();
  });
}

function monitorDatabaseConnection() {
  const intervalId = setInterval(() => {
    connection.pool.query('SELECT NOW()', (err, results) => {
      if (!err) {
        clearInterval(intervalId);
        connection = {
          isReady: true,
          err: null,
        };
      }
    });
  }, 5000);
}

async function createTables(pool) {
  (async () => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(createTableQueries.USERS);
      await client.query(createTableQueries.HOLONS);
      await client.query(createTableQueries.ALGORITHMS);
      await client.query(createTableQueries.TASKS);
      await client.query(createTableQueries.DASHBOARD_SETTINGS);
      await client.query(createTableQueries.ALLOCATIONS);
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      console.log('Failed to create tables ', e);
    } finally {
      client.release();
    }
  })().catch((err) => console.log(err.stack));
}

async function createTestEnvironment(pool) {
  (async () => {
    const client = await pool.connect();
    try {
      await testEnvironment.initialize();
      await client.query('BEGIN');
      await client.query('TRUNCATE algorithms CASCADE');
      await client.query('TRUNCATE allocations CASCADE');
      await client.query('TRUNCATE dashboard_settings CASCADE');
      await client.query('TRUNCATE holons CASCADE');
      await client.query('TRUNCATE tasks CASCADE');
      await client.query('TRUNCATE users CASCADE');
      await client.query(testEnvironment.userQuery, testEnvironment.userValues);
      await client.query(testEnvironment.adminQuery, testEnvironment.adminValues);
      await client.query(testEnvironment.moderatorQuery, testEnvironment.moderatorValues);
      await client.query(testEnvironment.appQuery, testEnvironment.appValues);
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      console.log('Failed to create test environment ', e);
    } finally {
      client.release();
    }
  })().catch((err) => console.log(err.stack));
}

async function createProductionEnvironment(pool) {
  if (process.env.HMAS_ACCOUNT && process.env.HMAS_PASSWORD) {
    (async () => {
      const client = await pool.connect();
      try {
        await testEnvironment.initialize();
        await client.query('BEGIN');
        await client.query('INSERT INTO users (role, username, password, email, firstname, lastname, created_on, updated_on) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [
          'app',
          process.env.HMAS_ACCOUNT,
          await encryptPassword(process.env.HMAS_PASSWORD),
          'NA',
          'NA',
          'NA',
          new Date(),
          new Date(),
        ]);
        await client.query('COMMIT');
      } catch (e) {
        await client.query('ROLLBACK');
      } finally {
        client.release();
      }
    })().catch((err) => console.log(err.stack));
  }
}


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