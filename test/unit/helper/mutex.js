/**
 * Copyright 2017 Jean Desravines <hi@jeandesravines.com>
 */

'use strict';

const {beforeEach, describe, it} = require('mocha');
const {expect} = require('chai');
const Mutex = require('../../../lib/helper/mutex');

describe('Mutex', () => {
  /**
   * @type {Mutex}
   */
  let mutex;

  beforeEach('Instantiate', () => {
    mutex = new Mutex();
  });

  describe('Synchronous', () => {
    it('should lock', () => {
      expect(mutex.lock()).to.be.equal(true);
      expect(mutex.locked).to.be.equal(true);
    });
  });

  describe('Asynchronous', () => {
    it('should lock and unlock', () => {
      return mutex.asynchronous()
        .then(() => mutex.unlock())
        .then(() => {
          expect(mutex.locked).to.be.equal(false);
        });
    });

    it('should reject the lock', () => {
      return mutex.asynchronous()
        .then(() => mutex.asynchronous())
        .then(() => Promise.reject())
        .catch(() => Promise.resolve());
    });
  });

  describe('Delayed', () => {
    it('should lock', () => {
      return mutex.delayed(500);
    });

    it('should reject the lock', () => {
      return mutex.delayed(500)
        .then(() => mutex.delayed(500))
        .then(() => Promise.reject())
        .catch(() => Promise.resolve());
    });

    it('should be unlocked', () => {
      return mutex.delayed(500)
        .then(() => new Promise((resolve) => {
          setTimeout(() => {
            expect(mutex.locked).to.be.equal(false);
            resolve();
          }, 500);
        }));
    });
  });
});
