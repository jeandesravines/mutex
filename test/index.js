'use strict';

const {describe, it} = require('mocha');
const {expect, should} = require('chai');
const Mutex = require('../lib/Mutex');

describe('Mutex', () => {
	describe('Constructor', () => {
		it('should create a Mutex', () => {
			expect(new Mutex()).to.be.instanceOf(Mutex);
		});
	});

	describe('synchronous', () => {
		let mutex = new Mutex();

		it('should lock', () => {
			return expect(mutex.lock()).to.equal(true);
		});

		it('should unlock', () => {
			return mutex.unlock();
		});

		it('should be unlocked', () => {
			expect(mutex.locked).to.equal(false);
		});
	});

	describe('asynchronous', () => {
		let mutex = new Mutex();

		it('should lock', () => {
			return mutex.asynchronous();
		});

		it('should reject the lock', (done) => {
			mutex.asynchronous()
				.then(() => done(new Error()))
				.catch(() => done());
		});
	});

	describe('delayed', () => {
		let mutex = new Mutex();

		it('should lock', () => {
			return mutex.delayed(500);
		});

		it('should reject the lock', (done) => {
			mutex.delayed(500)
				.then(() => done(new Error()))
				.catch(() => done());
		});

		it('should be unlocked', (done) => {
			setTimeout(() => {
				expect(mutex.locked).to.equal(false);
				done();
			}, 500);
		});
	});
});