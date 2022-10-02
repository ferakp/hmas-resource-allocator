const printer = false;

let logs = [];
const printerInterval = setInterval(() => {
  const logsTemp = logs;
  logs = [];
  logsTemp.forEach((log) => {
    if (printer) console.log(log);
  });
}, 3000);

export function log(type, message) {
  logs.push(type + ' - ' + message);
}
