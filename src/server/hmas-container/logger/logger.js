let isActive = false;

const logTemplate = {
  type: '',
  message: '',
  logTime: '',
};

export const logs = [];
const tempLogs = [];
const clearCacheInterval = setInterval(() => clearCache(), 1000 * 360);

export function createLog(type, message) {
  const logCopy = JSON.parse(JSON.stringify(logTemplate));
  logCopy.type = type;
  logCopy.message = message;
  logCopy.logTime = new Date();
  logs.push(logCopy);
  tempLogs.push(logCopy);
  if (tempLogs.length > 10) {
    tempLogs.length = 0;
  }
  if (isActive) {
    const message = tempLogs.map((i) => i.type + ' ' + i.message + '\n').join('');
    console.log(message);
  }
}

export function stopPrinting() {
  isActive = false;
}

const clearCache = () => {
  logs.length = 0;
};

export const stop = () => {
  clearInterval(clearCacheInterval);
  createLog('Status', 'Logger - stopped');
  if (isActive) {
    const message = tempLogs.map((i) => i.type + ' ' + i.message + '\n').join('');
    tempLogs.length = 0;
  }
};
