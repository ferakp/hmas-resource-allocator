import * as app from "../../../app";
import * as utils from "../../utils/utils";
import * as reqUtils from "../../../rest-api/v1/utils/utils";
import * as db from "../../../relational-database/database";

// Configuring test environment
jest.useRealTimers();
jest.setTimeout(30000);

beforeEach(async () => {
  // Wait server to be set up
  await utils.wait(5);

  // Empty all tables
  let responseAlg = await db.executeQuery("TRUNCATE algorithms CASCADE");
  let responseAll = await db.executeQuery("TRUNCATE allocations CASCADE");
  let responseDas = await db.executeQuery("TRUNCATE dashboard_settings CASCADE");
  let responseHol = await db.executeQuery("TRUNCATE holons CASCADE");
  let responseTas = await db.executeQuery("TRUNCATE tasks CASCADE");
  let responseUse = await db.executeQuery("TRUNCATE users CASCADE");

  // Add three test users with roles of user, admin and moderator
  let responseUser = await db.executeQuery(
    "INSERT INTO users (role, username, password, email, firstname, lastname, created_on, updated_on) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
    [
      "user",
      "user",
      await reqUtils.encryptPassword("password"),
      "user@demo.com",
      "demo",
      "demo",
      "2022-06-10T18:24:21.381Z",
      "2022-06-10T18:24:21.381Z",
    ]
  );
  let responseModerator = await db.executeQuery(
    "INSERT INTO users (role, username, password, email, firstname, lastname, created_on, updated_on) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
    [
      "moderator",
      "moderator",
      await reqUtils.encryptPassword("password"),
      "moderator@demo.com",
      "demo",
      "demo",
      "2022-06-10T18:24:21.381Z",
      "2022-06-10T18:24:21.381Z",
    ]
  );
  let responseAdmin = await db.executeQuery(
    "INSERT INTO users (role, username, password, email, firstname, lastname, created_on, updated_on) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
    [
      "admin",
      "admin",
      await reqUtils.encryptPassword("password"),
      "admin@demo.com",
      "demo",
      "demo",
      "2022-06-10T18:24:21.381Z",
      "2022-06-10T18:24:21.381Z",
    ]
  );

  let allResponseErrors = responseAlg.errors
    .concat(responseAll.errors)
    .concat(responseDas.errors)
    .concat(responseHol.errors)
    .concat(responseTas.errors)
    .concat(responseUse.errors)
    .concat(responseUser.errors)
    .concat(responseModerator.errors)
    .concat(responseAdmin.errors);

  if (allResponseErrors.length > 0) throw new Error("Initialization of test environment failed");
});

afterAll(async () => {
  jest.setTimeout(20000);
  let responseAlg = await db.executeQuery("TRUNCATE algorithms");
  let responseAll = await db.executeQuery("TRUNCATE allocations");
  let responseDas = await db.executeQuery("TRUNCATE dashboard_settings");
  let responseHol = await db.executeQuery("TRUNCATE holons");
  let responseTas = await db.executeQuery("TRUNCATE tasks");
  let responseUse = await db.executeQuery("TRUNCATE users");

  db.endConnection();
  app.stopServer();
});

describe("testing /auth endpoint", () => {
  test("login with valid credentials", async () => {
    let result = await utils.login("user", "password");

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining("/api/v1/auth/login") }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains only one data object
    expect(result.data.data.length).toBe(1);

    // Response's data object is type of authToken
    expect(result.data).toEqual(
      expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({
            type: "authToken",
          }),
        ]),
      })
    );

    // Response must have a valid token
    expect(typeof (await utils.verifyToken(result.data.data[0].attributes.token, process.env.SECRET_KEY)).userId).toBe("number");
  });

  
  test("login with invalid password", async () => {
    // Expect error
    let result = await utils.login("user", "password1");
    
    // Response has correct link
    expect(result.response.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining("/api/v1/auth/login") }),
      })
    );

    // Response contains no data object
    expect(result.response.data.data.length).toBe(0);

    // Response has one error
    expect(result.response.data.errors.length).toBe(1);

    // Response returns invalid password error
    expect(result.response.data.errors[0].title).toBe("INVALID PASSWORD");
  });

  test("login with invalid username", async () => {
    // Expect error
    let result = await utils.login("username", "password1");
    
    // Response has correct link
    expect(result.response.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining("/api/v1/auth/login") }),
      })
    );

    // Response contains no data object
    expect(result.response.data.data.length).toBe(0);

    // Response has one error
    expect(result.response.data.errors.length).toBe(1);

    // Response returns invalid password error
    expect(result.response.data.errors[0].title).toBe("INVALID USERNAME");
  });
});
