import * as app from "../../../app";
import * as utils from "../../utils/utils";
import * as testEnvironment from '../../utils/test-environment';
import * as db from "../../../relational-database-api/database";

// Configuring test environment
jest.useRealTimers();
jest.setTimeout(40000);

beforeEach(async () => {
  // Waiting server to start
  await utils.wait(4);

  // Set up test environment
  await testEnvironment.addTestEnvironment(db);
});

afterAll(async () => {
  jest.setTimeout(20000);
  let responseAlg = await db.executeQuery('TRUNCATE algorithms CASCADE');
  let responseAll = await db.executeQuery('TRUNCATE allocations CASCADE');
  let responseDas = await db.executeQuery('TRUNCATE dashboard_settings CASCADE');
  let responseTas = await db.executeQuery('TRUNCATE tasks CASCADE');
  let responseUse = await db.executeQuery('TRUNCATE users CASCADE');
  let responseHol = await db.executeQuery('TRUNCATE holons CASCADE');

  db.endConnection();
  app.stopServer();
});

describe("testing GET /users endpoint with queries", () => {
  test("user receives all users", async () => {
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
    expect(result.data.data.length).toBe(4);

    // Response's data object is type of users
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: "users",
      })
    );

    // Response contains own profile
    let ownProfile = null;
    result.data.data.forEach(p => {
      if(p.attributes.role === 'user') ownProfile = p.attributes;
    });
    expect(ownProfile).toEqual(
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

  test("moderator receives all users", async () => {
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
    expect(result.data.data.length).toBe(4);

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

  test("look for users using created_on query ", async () => {
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

    // Response contains three data objects (user, moderator, admin (self) and app)
    expect(result.data.data.length).toBe(4);
  });

  test("look for users with username, role, firstname, lastname and created_on query keys", async () => {
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
