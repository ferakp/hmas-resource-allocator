

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
    title: "MISSING AUTHENTICATION CREDENTIALS",
    detail: "Request is missing authentication credentials",
    dbErrorMessage: "",
    time: new Date()
}

export const INVALID_TOKEN = {
    status: 401,
    code: 18,
    title: "INVALID AUTHENTICATION CREDENTIALS",
    detail: "Request has invalid authentication token",
    time: new Date()
}

export const USER_NOT_FOUND= {
    status: 404,
    code: 19,
    title: "USER NOT FOUND",
    detail: "User with given ID does not exist",
    time: new Date()
}

export const INSUFFICIENT_PRIVILEGES = {
    status: 403,
    code: 20,
    title: "INSUFFICIENT PRIVILEGES",
    detail: "Server was unable to process the request due to insufficient privileges",
    time: new Date()
}

export const DUPLICATE_QUERY_KEYS = {
    status: 400,
    code: 21,
    title: "DUPLICATE QUERY KEYS",
    detail: "The request has duplicate query keys",
    time: new Date()
}

export const UNABLE_TO_FORMAT_QUERY = {
    status: 500,
    code: 22,
    title: "UNABLE TO FORMAT QUERY",
    detail: "Server was unable to format query",
    time: new Date()
}

export const DUPLICATE_PARAMETERS = {
    status: 400,
    code: 23,
    title: "DUPLICATE PARAMETERS",
    detail: "The request has duplicate field",
    time: new Date()
}

export const INVALID_PARAMETER_NAMES = {
    status: 400,
    code: 24,
    title: "INVALID PARAMETER NAMES",
    detail: "The request has invalid parameter name(s)",
    time: new Date()
}

export const INVALID_PARAMETER_VALUES = {
    status: 400,
    code: 25,
    title: "INVALID PARAMETER VALUES",
    detail: "The request has invalid parameter value(s)",
    time: new Date()
}

export const MISSING_OR_INVALID_PARAMETERS = {
    status: 400,
    code: 26,
    title: "MISSING OR INVALID PARAMETERS",
    detail: "The request has missing, invalid or illegal parameter(s)",
    time: new Date()
}

export const UNEXPECTED_UPDATE_ERROR = {
    status: 500,
    code: 27,
    title: "UNEXPECTED UPDATE ERROR",
    detail: "Server was unable to update user due to internal server errors",
    time: new Date()
}

export const EMAIL_ALREADY_REGISTERED = {
    status: 400,
    code: 28,
    title: "EMAIL ALREADY REGISTERED",
    detail: "Server was unable to process the request due to already registered email address",
    time: new Date()
}

export const USERNAME_ALREADY_REGISTERED = {
    status: 400,
    code: 29,
    title: "USERNAME ALREADY REGISTERED",
    detail: "Server was unable to process the request due to already registered username",
    time: new Date()
}

export const USERNAME_AND_EMAIL_ALREADY_REGISTERED = {
    status: 400,
    code: 30,
    title: "USERNAME AND EMAIL ALREADY REGISTERED",
    detail: "Server was unable to process the request due to already registered username and email",
    time: new Date()
}

export const UNEXPECTED_ERROR = {
    status: 500,
    code: 31,
    title: "UNEXPECTED ERROR",
    detail: "Server was unable to process the request due to internal error",
    time: new Date()
}

export const HOLON_NOT_FOUND= {
    status: 404,
    code: 32,
    title: "HOLON NOT FOUND",
    detail: "Holon with given ID does not exist",
    time: new Date()
}


export const MISSING_TOKEN = {
    status: 401,
    code: 33,
    title: "INVALID AUTHENTICATION CREDENTIALS",
    detail: "Request has invalid authentication token",
    time: new Date()
}

export const TASK_NOT_FOUND= {
    status: 404,
    code: 34,
    title: "TASK NOT FOUND",
    detail: "Task with given ID does not exist",
    time: new Date()
}


export const MAX_SETTINGS_SIZE_EXCEEDED = {
    status: 400,
    code: 35,
    title: "MAX SETTINGS SIZE EXCEEDED",
    detail: "Number of maximum settings fields is 100",
    time: new Date()
}

export const MISSING_SETTINGS = {
    status: 400,
    code: 36,
    title: "MISSING SETTINGS",
    detail: "The request is missing settings",
    time: new Date()
}

export const SETTINGS_NOT_FOUND= {
    status: 404,
    code: 37,
    title: "SETTINGS NOT FOUND",
    detail: "Settings with given id does not exist",
    time: new Date()
}

export const DUPLICATE_SETTINGS_NOT_ALLOWED= {
    status: 400,
    code: 38,
    title: "DUPLICATE SETTINGS FILE NOT ALLOWED",
    detail: "Settings file with given user id already exists",
    time: new Date()
}

export const BROKEN_ALLOCATION= {
    status: 500,
    code: 39,
    title: "UNABLE TO COMPLETE THE REQUEST",
    detail: "Database returned broken, invalid or corrupt allocation. Please, delete the allocation request.",
    time: new Date()
}

export const ALLOCATION_COMPLETE_REQUEST_NOT_ALLOWED = {
    status: 400,
    code: 40,
    title: "COMPLETING UNFINISHED ALLOCATION IS NOT PERMITTED",
    detail: "The allocation is not ready for complete operation",
    time: new Date()
}

export const INVALID_ALLOCATION_RESULT = {
    status: 500,
    code: 41,
    title: "INVALID ALLOCATION RESULT",
    detail: "The allocation request has invalid allocation result. Please, delete the allocation request.",
    time: new Date()
}

export const FAILED_TO_COMPLETE_ALLOCATION = {
    status: 500,
    code: 42,
    title: "FAILED TO COMPLETE ALLOCATION",
    detail: "Database returned error while trying to complete the allocation",
    time: new Date()
}

export const ALLOCATION_NOT_FOUND = {
    status: 404,
    code: 43,
    title: "ALLOCATION NOT FOUND",
    detail: "Allocation with given id doesn't exist",
    time: new Date()
}


export const ALGORITHM_NOT_FOUND = {
    status: 404,
    code: 44,
    title: "ALGORITHM NOT FOUND",
    detail: "Algorithm with given id doesn't exist",
    time: new Date()
}

export const NO_ALLOCABLE_RESULT = {
    status: 403,
    code: 45,
    title: "NO ALLOCABLE RESULT",
    detail: "The allocation request's result has either error message or can't be completed due to lack of holons or/and tasks. Please, delete the allocation request.",
    time: new Date()
}

export const TOO_MANY_REQUESTS = {
    status: 429,
    code: 46,
    title: "TOO MANY REQUESTS",
    detail: "Server received too many requests from your IP address. Please, try again later.",
    time: new Date()
}
