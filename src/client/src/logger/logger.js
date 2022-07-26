let logs = [];
const printerInterval = setInterval(() => {
  const logsTemp = logs;
  logs = [];
  logsTemp.forEach((log) => {
    console.log(log);
  });
}, 3000);

export function log(type, message) {
  logs.push(type + ' - ' + message);
}
