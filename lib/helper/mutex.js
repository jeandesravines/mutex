'use strict';

/**
 * Class representing a Mutex managed with Promises
 * @class
 * @author Jean Desravines <hi@jeandesravines.com>
 */
class Mutex {
  /**
   * Instantiate a Mutex
   * @constructor
   */
  constructor() {
    /**
     * True if the mutex is locked
     * @private
     * @type {boolean}
     */
    this._locked = false;

    /**
     * Last time when the mutex was lock with delay
     * @private
     * @type {number}
     */
    this._time = 0;
  }

  /**
   * Able to execute asynchronous code safety.
   * Lock, execute
   * @return {Promise<function>} a resolved promise with an unlock handler
   */
  asynchronous() {
    return new Promise((resolve, reject) => {
      if (this.lock()) {
        resolve(this.unlock.bind(this));
      } else {
        reject();
      }
    });
  }

  /**
   * Return a promise on an asynchronous mutex with a parameter to define
   * the minimum interval of time
   * between 2 executions
   * @param {number} delay
   * @return {Promise<function>} a resolved Promise with an unlock handler
   */
  delayed(delay) {
    const time = Date.now();

    return new Promise((resolve, reject) => {
      if (time - this._time >= delay) {
        this.asynchronous()
          .then((unlock) => {
            resolve(unlock);
            unlock();

            this._time = time;
          }).catch(reject);
      } else {
        reject();
      }
    });
  }

  /**
   * Lock the mutex if it is possible and return true if mutex was not
   * already locked
   * @return {boolean} true if the mutex has been locked
   */
  lock() {
    return this._locked ? false : this._locked = true;
  }

  /**
   * unlock the mutex
   * @return {Promise} a self-resolved Promise
   */
  unlock() {
    this._locked = false;

    return Promise.resolve();
  }

  /**
   * Return true if the mutex is unlocked
   * @return {boolean} true if the mutex is locked
   */
  get locked() {
    return this._locked;
  }
}


module.exports = Mutex;
