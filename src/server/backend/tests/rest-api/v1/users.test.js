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
      new Date("2022-06-10T18:24:21.381Z"),
      new Date("2022-06-10T18:24:21.381Z"),
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
      new Date("2022-06-10T18:24:21.381Z"),
      new Date("2022-06-10T18:24:21.381Z"),
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
      new Date("2022-06-10T18:24:21.381Z"),
      new Date("2022-06-10T18:24:21.381Z"),
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

describe("testing GET /users endpoint with queries", () => {
  test("user receives only own profile", async () => {
    let result = await utils.login("user", "password");
    const token = result.data.data[0].attributes.token;
    result = await utils.getUsers(token, "");

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining("/api/v1/users") }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains only one data object
    expect(result.data.data.length).toBe(1);

    // Response's data object is type of users
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: "users",
      })
    );

    // Response has correct user
    expect(result.data.data[0].attributes).toEqual(
      expect.objectContaining({
        role: "user",
        username: "user",
        email: "user@demo.com",
        firstname: "demo",
        lastname: "demo",
        created_on: "2022-06-10T18:24:21.381Z",
      })
    );
  });

  test("moderator receives own profile and the user's profile", async () => {
    let result = await utils.login("moderator", "password");
    const token = result.data.data[0].attributes.token;
    result = await utils.getUsers(token, "");

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining("/api/v1/users") }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains two data objects
    expect(result.data.data.length).toBe(2);

    // Response's data objects are type of users
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: "users",
      })
    );
    expect(result.data.data[1]).toEqual(
      expect.objectContaining({
        type: "users",
      })
    );

    // Response has user
    expect(result.data.data[0].attributes).toEqual(
      expect.objectContaining({
        role: "user",
        username: "user",
        email: "user@demo.com",
        firstname: "demo",
        lastname: "demo",
        created_on: "2022-06-10T18:24:21.381Z",
      })
    );

    // Response has moderator
    expect(result.data.data[1].attributes).toEqual(
      expect.objectContaining({
        role: "moderator",
        username: "moderator",
        email: "moderator@demo.com",
        firstname: "demo",
        lastname: "demo",
        created_on: "2022-06-10T18:24:21.381Z",
      })
    );
  });

  test("admin receives own profile and the profiles of the user and the moderator", async () => {
    let result = await utils.login("admin", "password");
    const token = result.data.data[0].attributes.token;
    result = await utils.getUsers(token, "");

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining("/api/v1/users") }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains three data objects
    expect(result.data.data.length).toBe(3);

    // Response's data objects are type of users
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: "users",
      })
    );
    expect(result.data.data[1]).toEqual(
      expect.objectContaining({
        type: "users",
      })
    );
    expect(result.data.data[2]).toEqual(
      expect.objectContaining({
        type: "users",
      })
    );

    // Response has user
    expect(result.data.data[0].attributes).toEqual(
      expect.objectContaining({
        role: "user",
        username: "user",
        email: "user@demo.com",
        firstname: "demo",
        lastname: "demo",
        created_on: "2022-06-10T18:24:21.381Z",
      })
    );

    // Response has moderator
    expect(result.data.data[1].attributes).toEqual(
      expect.objectContaining({
        role: "moderator",
        username: "moderator",
        email: "moderator@demo.com",
        firstname: "demo",
        lastname: "demo",
        created_on: "2022-06-10T18:24:21.381Z",
      })
    );

    // Response has admin
    expect(result.data.data[2].attributes).toEqual(
      expect.objectContaining({
        role: "admin",
        username: "admin",
        email: "admin@demo.com",
        firstname: "demo",
        lastname: "demo",
        created_on: "2022-06-10T18:24:21.381Z",
      })
    );
  });

  test("admin looks for user with username user", async () => {
    let result = await utils.login("admin", "password");
    const token = result.data.data[0].attributes.token;
    result = await utils.getUsers(token, "?username=user");

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining("/api/v1/users") }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains one data object
    expect(result.data.data.length).toBe(1);

    // Response's data objects are type of users
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: "users",
      })
    );

    // Response has user
    expect(result.data.data[0].attributes).toEqual(
      expect.objectContaining({
        role: "user",
        username: "user",
        email: "user@demo.com",
        firstname: "demo",
        lastname: "demo",
        created_on: "2022-06-10T18:24:21.381Z",
      })
    );
  });

  test("usage of illegal parameter", async () => {
    let result = await utils.login("admin", "password");
    const token = result.data.data[0].attributes.token;
    // Expect error
    result = await utils.getUsers(token, "?password=user");

    // Response has correct link
    expect(result.response.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining("/api/v1/users") }),
      })
    );

    // Response has error
    expect(result.response.data.errors.length).toBe(1);

    // Response contains no data objects
    expect(result.response.data.data.length).toBe(0);

    // Response returns INVALID QUERY STRING KEY
    expect(result.response.data.errors[0].title).toBe("INVALID QUERY STRING KEY");
  });

  test("created_on query ", async () => {
    let result = await utils.login("admin", "password");
    const token = result.data.data[0].attributes.token;
    result = await utils.getUsers(token, "?created_on.elt=" + new Date());

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining("/api/v1/users") }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains three data objects (user, moderator, admin (self))
    expect(result.data.data.length).toBe(3);
  });

  test("username, role, firstname, lastname and created_on query keys", async () => {
    let result = await utils.login("admin", "password");
    const token = result.data.data[0].attributes.token;
    result = await utils.getUsers(
      token,
      "?username=user&role=user&firstname=demo&lastname=demo&created_on.elt=" + new Date()
    );

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining("/api/v1/users") }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains one data object (user)
    expect(result.data.data.length).toBe(1);
  });

  test("call /users with invalid token", async () => {
    const token = "invalidtoken";
    // Expect error
    let result = await utils.getUsers(token, "");

    // Response has correct link
    expect(result.response.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining("/api/v1/users") }),
      })
    );

    // Response has one error
    expect(result.response.data.errors.length).toBe(1);

    // Response contains no data object
    expect(result.response.data.data.length).toBe(0);

    // Response returns INVALID AUTHENTICATION CREDENTIALS
    expect(result.response.data.errors[0].title).toBe("INVALID AUTHENTICATION CREDENTIALS");
  });
});

describe("testing POST /users endpoint", () => {
  test("create a new user with user role", async () => {
    let result = await utils.login("admin", "password");
    const token = result.data.data[0].attributes.token;
    result = await utils.post("users", token, {
      role: "user",
      username: "user2",
      password: "password",
      email: "user2@demo.com",
      firstname: "demo",
      lastname: "demo",
    });

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining("/api/v1/users") }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains only one data object
    expect(result.data.data.length).toBe(1);

    // Response's data object is type of users
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: "users",
      })
    );

    // Response has correct user
    expect(result.data.data[0].attributes).toEqual(
      expect.objectContaining({
        role: "user",
        username: "user2",
        email: "user2@demo.com",
        firstname: "demo",
        lastname: "demo",
      })
    );
  });

  test("attempt to create user with forbidden role", async () => {
    let result = await utils.login("admin", "password");
    const token = result.data.data[0].attributes.token;
    result = await utils.post("users", token, {
      role: "admin",
      username: "user3",
      password: "password",
      email: "user3@demo.com",
      firstname: "demo",
      lastname: "demo",
    });

    // Response has correct link
    expect(result.response.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining("/api/v1/users") }),
      })
    );

    // Response has error
    expect(result.response.data.errors.length).toBe(1);

    // Response contains no data object
    expect(result.response.data.data.length).toBe(0);

    // Response error is INSUFFICIENT PRIVILEGES
    expect(result.response.data.errors[0].title).toBe("INSUFFICIENT PRIVILEGES");
  });

  test("attempt to create user with missing parameters", async () => {
    let result = await utils.login("admin", "password");
    const token = result.data.data[0].attributes.token;
    result = await utils.post("users", token, {
      role: "admin",
      username: "user3",
      email: "user3@demo.com",
      firstname: "demo",
      lastname: "demo",
    });

    // Response has correct link
    expect(result.response.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining("/api/v1/users") }),
      })
    );

    // Response has error
    expect(result.response.data.errors.length).toBe(1);

    // Response contains no data object
    expect(result.response.data.data.length).toBe(0);

    // Response error is MISSING OR INVALID PARAMETERS
    expect(result.response.data.errors[0].title).toBe("MISSING OR INVALID PARAMETERS");
  });
});

describe("testing PATCH /users endpoint", () => {
  test("change firstname and lastname", async () => {
    let result = await utils.login("admin", "password");
    const token = result.data.data[0].attributes.token;
    const id = (await utils.getUsers(token, "?username=admin")).data.data[0].attributes.id;

    result = await utils.patch("users/" + id, token, {
      firstname: "test",
      lastname: "test",
    });

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining("/api/v1/users") }),
      })
    );

    // Response has no error
    expect(result.data.errors.length).toBe(0);

    // Response contains one data object
    expect(result.data.data.length).toBe(1);

    // Confirm firstname and lastname have been changed
    expect(result.data.data[0].attributes).toEqual(
      expect.objectContaining({
        firstname: "test",
        lastname: "test",
      })
    );
  });

  test("increase role", async () => {
    let result = await utils.login("admin", "password");
    const token = result.data.data[0].attributes.token;
    const id = (await utils.getUsers(token, "?username=user")).data.data[0].attributes.id;

    result = await utils.patch("users/" + id, token, {
      role: "moderator",
    });

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining("/api/v1/users") }),
      })
    );

    // Response has no error
    expect(result.data.errors.length).toBe(0);

    // Response contains one data object
    expect(result.data.data.length).toBe(1);

    // Confirm role has been changed
    expect(result.data.data[0].attributes).toEqual(
      expect.objectContaining({
        role: "moderator",
      })
    );
  });

  test("attempt to increase role to forbidden level (from user to admin)", async () => {
    let result = await utils.login("admin", "password");
    const token = result.data.data[0].attributes.token;
    const id = (await utils.getUsers(token, "?username=user")).data.data[0].attributes.id;

    result = await utils.patch("users/" + id, token, {
      role: "admin",
    });

    // Response has correct link
    expect(result.response.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining("/api/v1/users") }),
      })
    );

    // Response has error
    expect(result.response.data.errors.length).toBe(1);

    // Response contains no data object
    expect(result.response.data.data.length).toBe(0);

    // Confirm error is INSUFFICIENT PRIVILEGES
    expect(result.response.data.errors[0].title).toBe("INSUFFICIENT PRIVILEGES");
  });

  test("attempt to change id (invalid parameter)", async () => {
    let result = await utils.login("admin", "password");
    const token = result.data.data[0].attributes.token;
    const id = (await utils.getUsers(token, "?username=user")).data.data[0].attributes.id;

    result = await utils.patch("users/" + id, token, {
      id: 1,
    });

    // Response has correct link
    expect(result.response.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining("/api/v1/users") }),
      })
    );

    // Response has error
    expect(result.response.data.errors.length).toBe(1);

    // Response contains no data object
    expect(result.response.data.data.length).toBe(0);

    // Confirm error is INVALID PARAMETER NAMES
    expect(result.response.data.errors[0].title).toBe("INVALID PARAMETER NAMES");
  });
});

describe("testing DELETE /users endpoint", () => {
  test("delete the user", async () => {
    let result = await utils.login("admin", "password");
    const token = result.data.data[0].attributes.token;
    const id = (await utils.getUsers(token, "?username=user")).data.data[0].attributes.id;

    result = await utils.del("users/" + id, token);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining("/api/v1/users") }),
      })
    );

    // Response has no error error
    expect(result.data.errors.length).toBe(0);

    // Response contains data object
    expect(result.data.data.length).toBe(1);

    // Confirm the user is deleted
    expect(result.data.data[0].attributes).toEqual(
      expect.objectContaining({
        id: id,
      })
    );
  });

  test("attempt to delete admin with insufficient privileges", async () => {
    let result = await utils.login("admin", "password");
    let token = result.data.data[0].attributes.token;
    const id = (await utils.getUsers(token, "?username=admin")).data.data[0].attributes.id;

    result = await utils.login("user", "password");
    token = result.data.data[0].attributes.token;
    result = await utils.del("users/" + id, token);

    // Response has correct link
    expect(result.response.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining("/api/v1/users") }),
      })
    );

    // Response has error
    expect(result.response.data.errors.length).toBe(1);

    // Response contains no data object
    expect(result.response.data.data.length).toBe(0);

    // Confirm the user is deleted
    expect(result.response.data.errors[0]).toEqual(
      expect.objectContaining({
        title: "UNAUTHORIZED API CALL",
      })
    );
  });
});
