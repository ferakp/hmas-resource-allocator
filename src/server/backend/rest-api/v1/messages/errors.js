
/**
 * RELATIONAL DATABASE ERROR MESSAGES
 */

export const CREATE_TABLE_ERROR = {
    status: 500,
    code: 1,
    title: "Database initialization error",
    detail: "System was unable to create database tables",
    errorTime: new Date()
}

export const POOL_ON_ERROR = {
    status: 500,
    code: 2,
    title: "Database connection error",
    detail: "Connection to database has been lost",
    time: new Date()
}

export const INVALID_API_REQUEST = {
    status: 400,
    code: 3,
    title: "Invalid API REQUEST",
    detail: "Server was unable to process the request",
    time: new Date()
}

export const INVALID_QUERY_STRING_VALUE = {
    status: 400,
    code: 4,
    title: "INVALID QUERY STRING VALUE",
    detail: "Query string has invalid or illegal value(s)",
    time: new Date()
}

export const INVALID_QUERY_STRING_KEY = {
    status: 400,
    code: 5,
    title: "INVALID QUERY STRING KEY",
    detail: "Query string has invalid or illegal key(s)",
    time: new Date()
}

export const UNAUTHORIZED_API_CALL = {
    status: 401,
    code: 6,
    title: "UNAUTHORIZED API CALL",
    detail: "The request lacks valid authentication credentials for the requested resource",
    time: new Date()
}

export const INVALID_ATTRIBUTE_NAME = {
    status: 400,
    code: 7,
    title: "INVALID ATTRIBUTE NAME",
    detail: "The request has invalid attribute name(s)",
    time: new Date()
}

export const INVALID_ATTRIBUTE_VALUE = {
    status: 400,
    code: 8,
    title: "INVALID ATTRIBUTE VALUE",
    detail: "The request has invalid attribute value(s)",
    time: new Date()
}

export const MISSING_ATTRIBUTE = {
    status: 400,
    code: 9,
    title: "MISSING ATTRIBUTE",
    detail: "The request has missing attribute(s)",
    time: new Date()
}


export const DATABASE_CONNECTION_ERROR= {
    status: 500,
    code: 10,
    title: "DATABASE CONNECTION ERROR",
    detail: "The server was unable to execute query",
    time: new Date()
}

export const DATABASE_RESPONSE_ERROR = {
    status: 500,
    code: 11,
    title: "DATABASE RESPONSE ERROR",
    detail: "The database returned error",
    dbErrorMessage: "",
    time: new Date()
}

export const INVALID_ATTRIBUTE_FORMAT = {
    status: 400,
    code: 12,
    title: "INVALID ATTRIBUTE FORMAT",
    detail: "The server could not process request due to wrong attribute format",
    time: new Date()
}

export const INVALID_USERNAME = {
    status: 401,
    code: 13,
    title: "INVALID USERNAME",
    detail: "Invalid username",
    time: new Date()
}

export const INVALID_PASSWORD = {
    status: 401,
    code: 14,
    title: "INVALID PASSWORD",
    detail: "Invalid password",
    time: new Date()
}

export const INVALID_USERNAME_AND_PASSWORD = {
    status: 401,
    code: 15,
    title: "INVALID USERNAME AND PASSWORD",
    detail: "Invalid username and password",
    time: new Date()
}

export const UNEXPECTED_DATABASE_RESPONSE_ERROR = {
    status: 500,
    code: 16,
    title: "UNEXPECTED DATABASE RESPONSE ERROR",
    detail: "Database returned unexpected error",
    dbErrorMessage: "",
    time: new Date()
}

export const MISSING_AUTHENTICATION_CREDENTIALS = {
    status: 401,
    code: 17,
    title: "MISSING AUTHENTICATION CREDENTIALS ",
    detail: "Request is missing authentication credentials",
    dbErrorMessage: "",
    time: new Date()
}

export const INVALID_TOKEN = {
    status: 401,
    code: 18,
    title: "INVALID AUTHENTICATION CREDENTIALS ",
    detail: "Request has invalid authentication token",
    time: new Date()
}

export const USER_NOT_FOUND= {
    status: 404,
    code: 19,
    title: "USER WAS NOT FOUND",
    detail: "User with given ID does not exist",
    time: new Date()
}
