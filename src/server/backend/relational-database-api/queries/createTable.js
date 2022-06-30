export const USERS =
  "CREATE TABLE IF NOT EXISTS users ( id SERIAL PRIMARY KEY, role VARCHAR NOT NULL DEFAULT 'user', username VARCHAR NOT NULL UNIQUE, password VARCHAR NOT NULL, firstname VARCHAR NOT NULL, lastname VARCHAR NOT NULL, email VARCHAR NOT NULL UNIQUE, created_on timestamp NOT NULL, last_login timestamp, updated_on timestamp NOT NULL )";

export const HOLONS =
  "CREATE TABLE IF NOT EXISTS holons ( id SERIAL PRIMARY KEY, type VARCHAR NOT NULL, name VARCHAR NOT NULL, gender VARCHAR, daily_work_hours DECIMAL NOT NULL, latest_state VARCHAR, remote_address VARCHAR, api_token VARCHAR, availability_data VARCHAR NOT NULL, load_data VARCHAR NOT NULL, stress_data VARCHAR NOT NULL, cost_data VARCHAR NOT NULL, age DECIMAL, experience_years DECIMAL DEFAULT 0, created_on timestamp NOT NULL, created_by BIGINT REFERENCES users (id) ON DELETE CASCADE, updated_on timestamp NOT NULL )";

export const ALGORITHMS =
  "CREATE TABLE IF NOT EXISTS algorithms ( id SERIAL PRIMARY KEY, type VARCHAR NOT NULL, description VARCHAR NOT NULL, name VARCHAR NOT NULL, created_on timestamp NOT NULL, updated_on timestamp NOT NULL, created_by BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE)";

export const TASKS =
  "CREATE TABLE IF NOT EXISTS tasks ( id SERIAL PRIMARY KEY, type VARCHAR, name VARCHAR NOT NULL, description VARCHAR, estimated_time DECIMAL, knowledge_tags VARCHAR, resource_demand VARCHAR, priority BIGINT DEFAULT 0, created_on timestamp NOT NULL, created_by bigint NOT NULL REFERENCES users (id) ON DELETE CASCADE, start_date timestamp, due_date timestamp, assigned_to VARCHAR, updated_on timestamp NOT NULL)";

export const DASHBOARD_SETTINGS =
  "CREATE TABLE IF NOT EXISTS dashboard_settings ( id BIGINT PRIMARY KEY, settings VARCHAR NOT NULL, created_on timestamp NOT NULL, updated_on timestamp NOT NULL, created_by BIGINT UNIQUE REFERENCES users (id) ON DELETE CASCADE)";

export const ALLOCATIONS =
  "CREATE TABLE IF NOT EXISTS allocations ( id SERIAL PRIMARY KEY, request_by BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE, request VARCHAR NOT NULL, result VARCHAR NOT NULL, created_on timestamp NOT NULL, completed_on timestamp NOT NULL, updated_on timestamp NOT NULL )";

  