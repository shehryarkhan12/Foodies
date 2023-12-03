function debouncePromise(fn, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      return new Promise((resolve, reject) => {
        timeout = setTimeout(() => {
          fn(...args)
            .then(resolve)
            .catch(reject);
        }, delay);
      });
    };
  }