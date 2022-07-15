
const logTemplate = {
    type: "",
    message: "",
    logTime: ""
}


export const logs = [];

export function createLog(type, message) {
    const logCopy = JSON.parse(JSON.stringify(logTemplate));
    logCopy.type = type;
    logCopy.message = message;
    logCopy.logTime = new Date();
}