import * as usersQueryGenerator from "../../../../relational-database/query-generators/users";

describe("getUsers query generator tests", () => {
  test("request own profile", () => {
    expect(usersQueryGenerator.getUsers({ requester: case1.params.user, filters: case1.params.filters })).toStrictEqual(
      {
        query: case1.query,
        values: case1.values,
      }
    );
  });

  test("request user with username", () => {
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
    expect(
      usersQueryGenerator.getUsers({ requester:  case6.params.user, filters: case6.params.filters })
    ).toStrictEqual({
      query: case6.query,
      values: case6.values,
    });
  });

  test("request with  8 valid (id, role, lastname, username, email, created_on.elt, updated_on.e, last_login.gt) filters using conditional parameters", () => {
    expect(
      usersQueryGenerator.getUsers({ requester:  case7.params.user, filters: case7.params.filters })
    ).toStrictEqual({
      query: case7.query,
      values: case7.values,
    });
  });
});

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
    "SELECT * FROM (SELECT id,role,username,firstname,lastname,email,created_on,last_login,updated_on FROM users WHERE id=$1) users WHERE id=$2",
  values: [1, 1],
  requireAdminPrivileges: false,
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
    "SELECT * FROM (SELECT id,role,username,firstname,lastname,email,created_on,last_login,updated_on FROM users WHERE id=$1) users WHERE (id=$2 OR role=$3)",
  values: ["23", "22", "user"],
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
    "SELECT * FROM (SELECT id,role,username,firstname,lastname,email,created_on,last_login,updated_on FROM users WHERE role=$1) users WHERE (id=$2 OR role=$3)",
  values: ["user", "22", "user"],
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
    "SELECT * FROM (SELECT id,role,username,firstname,lastname,email,created_on,last_login,updated_on FROM users" +
    " WHERE role=$1 AND id=$2 AND lastname=$3 AND username=$4 AND email=$5) users WHERE (id=$6 OR role=$7)",
  values: ["user", "24", "demo", "demo", "demo@demo.com", "22", "user"],
};

const case6 = {
  params: {
    user: {
      id: "22",
      role: "admin"
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
    "SELECT * FROM (SELECT id,role,username,firstname,lastname,email,created_on,last_login,updated_on FROM users" +
    " WHERE role=$1 AND id=$2 AND lastname=$3 AND username=$4 AND email=$5 AND created_on=$6 AND updated_on=$7 AND last_login=$8) users WHERE (id=$9 OR role=$10 OR role=$11)",
  values: [
    "user",
    "24",
    "demo",
    "demo",
    "demo@demo.com",
    "2022-06-03T10:58:25.138Z",
    "2022-06-03T10:58:25.138Z",
    "2022-06-03T10:58:25.138Z",
    "22",
    "user",
    "moderator"
  ],
};

const case7 = {
  params: {
    user: {
      id: "22",
      role: "moderator"
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
    "SELECT * FROM (SELECT id,role,username,firstname,lastname,email,created_on,last_login,updated_on FROM users" +
    " WHERE role=$1 AND id=$2 AND lastname=$3 AND username=$4 AND email=$5 AND created_on<=$6 AND updated_on=$7 AND last_login>$8) users WHERE (id=$9 OR role=$10)",
  values: [
    "user",
    "24",
    "demo",
    "demo",
    "demo@demo.com",
    "2022-06-03T10:58:25.138Z",
    "2022-06-03T10:58:25.138Z",
    "2022-06-03T10:58:25.138Z",
    "22",
    "user"
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
  requireAdminPrivileges: false,
};
