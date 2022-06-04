import { Pool } from "pg";
import * as errorMessages from "./messages/errors";
import * as createTableQueries from "./queries/createTable";

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
  } catch (e) {
    connection = {
      err: { ...errorMessages.CREATE_TABLE_ERROR, errorStack: e },
      isReady: false,
    };
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

  pool.on("error", (err, client) => {
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
    connection.pool.query("SELECT NOW()", (err, results) => {
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
      await client.query("BEGIN");
      await client.query(createTableQueries.USERS);
      await client.query(createTableQueries.HOLONS);
      await client.query(createTableQueries.ALGORITHMS);
      await client.query(createTableQueries.TASKS);
      await client.query(createTableQueries.DASHBOARD_SETTINGS);
      await client.query(createTableQueries.ALLOCATIONS);
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
    } finally {
      client.release();
    }
  })().catch((err) => console.log(err.stack));
}
