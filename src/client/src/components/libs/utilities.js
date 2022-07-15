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

  export function debounceOnce(func, timeout = 300){
    let timer;
    return (...args) => {
      if (!timer) {
        func.apply(this, args);
      }
      clearTimeout(timer);
      timer = setTimeout(() => {
        timer = undefined;
      }, timeout);
    };
  }


  export function generateRandomKey() {
    return (Math.random()*99999999999999)+"rnd"+(Math.random()*5452145442254);
  }