'use strict';

/**
 * Copyright 2016 Jean Desravines <hi@jeandesravines.com>
 */

const {afterEach, beforeEach, describe, it} = require('mocha');
const {expect, should} = require('chai');
const Mutex = require('../lib/helper/mutex');

describe('Mutex', () => {
	/**
	 * @type {Mutex}
	 */
	let mutex;

	beforeEach('Instantiate', () => {
		mutex = new Mutex();
	});

	afterEach('Destroy', () => {
		mutex = null;
	});

	describe('Synchronous', () => {
		it('should lock', () => {
			expect(mutex.lock()).to.equal(true);
			expect(mutex.locked).to.equal(true);
		});
	});

	describe('Asynchronous', () => {
		it('should lock and unlock', () => {
			return mutex.asynchronous()
				.then(() => mutex.unlock())
				.then(() => {
					expect(mutex.locked).to.equal(false);
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
				.then(() => new Promise((resolve, reject) => {
					setTimeout(() => {
						expect(mutex.locked).to.equal(false);
						resolve();
					}, 500);
				}));
		});
	});
});