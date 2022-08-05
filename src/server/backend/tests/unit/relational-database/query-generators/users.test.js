import * as usersQueryGenerator from "../../../../relational-database-api/query-generators/users";

// GET USERS
describe("getUsers() query generator tests", () => {
  test("request own profile", () => {
    expect(usersQueryGenerator.getUsers({ requester: case1.params.user, filters: case1.params.filters })).toStrictEqual(
      {
        query: case1.query,
        values: case1.values,
      }
    );
  });

  test("request user with username for auth", () => {
    expect(usersQueryGenerator.getUsers({ isForAuth: true, filters: case2.params.filters })).toStrictEqual({
      query: case2.query,
      values: case2.values,
    });
  });

  test("request other's profile", () => {
    expect(usersQueryGenerator.getUsers({ requester: case3.params.user, filters: case3.params.filters })).toStrictEqual(
      {
        query: case3.query,
        values: case3.values,
      }
    );
  });

  test("request with 1 (role) filter", () => {
    expect(usersQueryGenerator.getUsers({ requester: case4.params.user, filters: case4.params.filters })).toStrictEqual(
      {
        query: case4.query,
        values: case4.values,
      }
    );
  });

  test("request with  5 valid (id, role, lastname, username, email) filters", () => {
    expect(usersQueryGenerator.getUsers({ requester: case5.params.user, filters: case5.params.filters })).toStrictEqual(
      {
        query: case5.query,
        values: case5.values,
      }
    );
  });

  test("request with  8 valid (id, role, lastname, username, email, created_on, updated_on, last_login) filters", () => {
    expect(usersQueryGenerator.getUsers({ requester: case6.params.user, filters: case6.params.filters })).toStrictEqual(
      {
        query: case6.query,
        values: case6.values,
      }
    );
  });

  test("request with  8 valid (id, role, lastname, username, email, created_on.elt, updated_on.e, last_login.gt) filters using conditional parameters", () => {
    expect(usersQueryGenerator.getUsers({ requester: case7.params.user, filters: case7.params.filters })).toStrictEqual(
      {
        query: case7.query,
        values: case7.values,
      }
    );
  });
});

// EDIT USER
describe("editUser() query generator tests", () => {
  test("generate query for email change", () => {
    expect(usersQueryGenerator.editUser({ reqParams: case12.params.filters })).toStrictEqual({
      query: case12.query,
      values: case12.values,
    });
  });

  test("generate query for email and role change", () => {
    expect(usersQueryGenerator.editUser({ reqParams: case13.params.filters })).toStrictEqual({
      query: case13.query,
      values: case13.values,
    });
  });

  test("generate query without id", () => {
    expect(usersQueryGenerator.editUser({ reqParams: case14.params.filters })).toStrictEqual({
      query: null,
      values: null,
    });
  });
});

// DELETE USER
describe("deleteUser() query generator tests", () => {
  test("generate query for deleting user", () => {
    expect(usersQueryGenerator.deleteUser({ filters: case15.params.filters })).toStrictEqual({
      query: case15.query,
      values: case15.values,
    });
  });

  test("attempt to generate query for deleting user without id", () => {
    expect(usersQueryGenerator.deleteUser({ filters: case16.params.filters })).toStrictEqual({
      query: case16.query,
      values: case16.values,
    });
  });
});

// CREATE USER
describe("createUser() query generator tests", () => {
  test("generate query for creating user", () => {
    expect(usersQueryGenerator.createUser({ reqParams: case17.params.reqParams })).toStrictEqual({
      query: case17.query,
      values: case17.values,
    });
  });
});

// CASES FOR CREATE USER
const case17 = {
  params: {
    reqParams: {
      role: "user",
      username: "demo",
      password: "demo",
      email: "demo@demo.com",
      firstname: "demo",
      lastname: "demo",
    },
  },
  query: "INSERT INTO users (role,username,password,email,firstname,lastname) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
  values: ["user", "demo", "demo", "demo@demo.com", "demo", "demo"],
};

// CASES FOR DELETE USER
const case15 = {
  params: {
    filters: {
      id: 24,
    },
  },
  query: "DELETE FROM users WHERE id=$1 RETURNING id",
  values: [24],
};

const case16 = {
  params: {
    filters: {
      role: "user",
    },
  },
  query: null,
  values: null,
};

// CASES FOR EDIT USER
const case12 = {
  params: {
    filters: {
      id: 24,
      email: "demo@demo.com",
      updated_on: "2022-06-03T10:58:25.138Z",
    },
  },
  query: "UPDATE users SET email=$1,updated_on=$2 WHERE id=$3 RETURNING *",
  values: ["demo@demo.com", "2022-06-03T10:58:25.138Z", 24],
};

const case13 = {
  params: {
    filters: {
      id: 24,
      email: "demo@demo.com",
      role: "user",
      updated_on: "2022-06-03T10:58:25.138Z",
    },
  },
  query: "UPDATE users SET email=$1,role=$2,updated_on=$3 WHERE id=$4 RETURNING *",
  values: ["demo@demo.com", "user", "2022-06-03T10:58:25.138Z", 24],
};

const case14 = {
  params: {
    filters: {
      email: "demo@demo.com",
      role: "user",
      updated_on: "2022-06-03T10:58:25.138Z",
    },
  },
  query: null,
  values: null,
};

// CASES FOR GET USERS

const case1 = {
  params: {
    user: {
      id: 1,
      role: "user",
    },
    filters: {
      id: 1,
    },
  },
  query:
    "SELECT id,role,username,firstname,lastname,email,created_on,last_login,updated_on FROM users WHERE id=$1",
  values: [1],
};

const case2 = {
  params: {
    filters: {
      username: "demo",
    },
  },
  query: "SELECT * FROM users WHERE username=$1",
  values: ["demo"],
};

const case3 = {
  params: {
    user: {
      id: "22",
      role: "moderator",
    },
    filters: {
      id: "23",
    },
  },
  query:
    "SELECT id,role,username,firstname,lastname,email,created_on,last_login,updated_on FROM users WHERE id=$1",
  values: ["23"],
};

const case4 = {
  params: {
    user: {
      id: "22",
      role: "moderator",
    },
    filters: {
      role: "user",
    },
  },
  query:
    "SELECT id,role,username,firstname,lastname,email,created_on,last_login,updated_on FROM users WHERE role=$1",
  values: ["user"],
};

const case5 = {
  params: {
    user: {
      id: "22",
      role: "moderator",
    },
    filters: {
      role: "user",
      id: "24",
      lastname: "demo",
      username: "demo",
      email: "demo@demo.com",
    },
  },
  query:
    "SELECT id,role,username,firstname,lastname,email,created_on,last_login,updated_on FROM users" +
    " WHERE role=$1 AND id=$2 AND lastname=$3 AND username=$4 AND email=$5",
  values: ["user", "24", "demo", "demo", "demo@demo.com"],
};

const case6 = {
  params: {
    user: {
      id: "22",
      role: "admin",
    },
    filters: {
      role: "user",
      id: "24",
      lastname: "demo",
      username: "demo",
      email: "demo@demo.com",
      created_on: "2022-06-03T10:58:25.138Z",
      updated_on: "2022-06-03T10:58:25.138Z",
      last_login: "2022-06-03T10:58:25.138Z",
    },
  },
  query:
    "SELECT id,role,username,firstname,lastname,email,created_on,last_login,updated_on FROM users" +
    " WHERE role=$1 AND id=$2 AND lastname=$3 AND username=$4 AND email=$5 AND created_on=$6 AND updated_on=$7 AND last_login=$8",
  values: [
    "user",
    "24",
    "demo",
    "demo",
    "demo@demo.com",
    "2022-06-03T10:58:25.138Z",
    "2022-06-03T10:58:25.138Z",
    "2022-06-03T10:58:25.138Z",
  ],
};

const case7 = {
  params: {
    user: {
      id: "22",
      role: "moderator",
    },
    filters: {
      role: "user",
      id: "24",
      lastname: "demo",
      username: "demo",
      email: "demo@demo.com",
      "created_on.elt": "2022-06-03T10:58:25.138Z",
      "updated_on.e": "2022-06-03T10:58:25.138Z",
      "last_login.gt": "2022-06-03T10:58:25.138Z",
    },
  },
  query:
    "SELECT id,role,username,firstname,lastname,email,created_on,last_login,updated_on FROM users" +
    " WHERE role=$1 AND id=$2 AND lastname=$3 AND username=$4 AND email=$5 AND created_on<=$6 AND updated_on=$7 AND last_login>$8",
  values: [
    "user",
    "24",
    "demo",
    "demo",
    "demo@demo.com",
    "2022-06-03T10:58:25.138Z",
    "2022-06-03T10:58:25.138Z",
    "2022-06-03T10:58:25.138Z",
  ],
};

const case11 = {
  params: {
    userId: "22",
    filters: {
      role: "user",
      id: "24",
      lastname: "demo",
      username: "demo",
      email: "demo@demo.com",
      "created_on.elt": "2022-06-03T10:58:25.138Z",
      "updated_on.et": "2022-06-03T10:58:25.138Z",
      "last_login.gt": "2022-06-03T10:58:25.138Z",
    },
  },
  query: null,
  values: null,
};
