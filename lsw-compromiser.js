(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswCompromiser'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswCompromiser'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {

  Promise_extensions: {
    
    globalThis.Promise.prototype.chain = function (nextPromise) {
      return this.then(() => nextPromise);
    };
  }

  class PromiseMap {

    constructor(keys) {
      this.promises = new Map();

      keys.forEach(key => {
        this.set(key);
      });
    }

    static create(keys) {
      return new this(keys);
    }

    has(key) {
      return this.promises.has(key);
    }

    get(key) {
      if (!this.has(key)) {
        throw new Error(`Required argument «key» to be an existing key (not «${key}») on «PromiseMap.get»`);
      }
      return this.promises.get(key);
    }

    set(key) {
      if (this.has(key)) {
        throw new Error(`Required argument «key» to not be an existing key (not «${key}») on «PromiseMap.set»`);
      }
      let resolve, reject;
      const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      this.promises.set(key, { promise, resolve, reject });
    }

    unset(key) {
      if (!this.has(key)) {
        throw new Error(`Required argument «key» to be an existing key (not «${key}») on «PromiseMap.unset»`);
      }
      this.promises.delete(key);
    }

    on(key) {
      if (!this.has(key)) {
        throw new Error(`Required argument «key» to be an existing key (not «${key}») on «PromiseMap.on»`);
      }
      return this.promises.get(key).promise;
    }

    bind(key, key2) {
      this.on(key).then(output => this.get(key2).resolve(output));
    }

    propagate(key) {
      return {
        to: (key2) => {
          this.bind(key, key2);
          return this.propagate(key2);
        }
      }
    }

  }

  globalThis.PromiseMap = PromiseMap;

  return PromiseMap;

});