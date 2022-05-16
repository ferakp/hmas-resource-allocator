export function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
      if (!timer) {
        func.apply(this, args);
      }
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
        timer = undefined;
      }, timeout);
    };
  }