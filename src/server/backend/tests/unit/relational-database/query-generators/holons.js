import * as holonsQueryGenerator from "../../../../relational-database/query-generators/holons";

describe("GetHolons query generator", () => {
  test("getHolons return correct query and values", () => {
    expect(holonsQueryGenerator.getHolons(case1.params.userId, case1.params.filters)).toStrictEqual({
      errorCodes: [],
      query: case1.query,
      values: case1.values,
    });
  });

//   test("getHolons returns error when userId is invalid", () => {
//     expect(holonsQueryGenerator.getHolons(case2.params.userId, case2.params.filters).error).not.toBe(null);
//   });

//   test("getHolons returns error when query has illegal parameter", () => {
//     expect(holonsQueryGenerator.getHolons(case3.params.userId, case3.params.filters).error).not.toBe(null);
//   });

//   test("getHolons returns correct query and values", () => {
//     expect(holonsQueryGenerator.getHolons(case4.params.userId, case4.params.filters)).toStrictEqual({
//       errorCodes: [],
//       query: case4.query,
//       values: case4.values,
//     });
//   });
 });

const case1 = {
  params: {
    userId: "111111111111",
    filters: {
      "age.e": "25",
      type: "employee",
      "experience_years.elt": "6",
    },
  },
  query: "SELECT * FROM holons WHERE age=$1 AND type=$2 AND experience_years<=$3",
  values: ["25", "employee", "6"],
};

const case2 = {
  params: {
    userId: "1w",
    filters: {
      "age.e": "25",
      type: "employee",
      "experience_years.elt": "6",
    },
  },
  query: null,
  values: null,
};

const case3 = {
  params: {
    userId: "1222",
    filters: {
      "age.e": "25",
      type: "employee",
      "experience_years.elt": "6",
      "created_on.egt": "222222222",
      load_data: "aaaa",
    },
  },
  query: null,
  values: null,
};

const case4 = {
  params: {
    userId: "1222",
    filters: {
      "age.e": "25",
      type: "employee",
      "experience_years.elt": "6",
      "created_on.egt": "222222222",
      daily_work_hours: "11",
      "age.lt": "2",
    },
  },
  query:
    "SELECT * FROM holons WHERE age=$1 AND type=$2 AND experience_years<=$3 AND created_on>=$4 AND daily_work_hours=$5 AND age<$6",
  values: ["25", "employee", "6", "222222222", "11", "2"],
};
