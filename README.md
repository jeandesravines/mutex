# Mutex

[![Build Status](https://travis-ci.org/jeandesravines/mutex.svg)](https://travis-ci.org/jeandesravines/mutex)
[![Coverage Status](https://coveralls.io/repos/github/jeandesravines/mutex/badge.svg?branch=master)](https://coveralls.io/github/jeandesravines/mutex?branch=master)

Asynchronous, synchronous and delayed Mutex with ES6 and Promises.


## Table of contents

* [Setup](#setup)
* [Usage](#usage)
* [API](#api)
    * [Properties](#properties) 
    * [Methods](#methods) 
* [Contributing](#contributing) 
* [Tests](#tests) 


## Setup

This module can then be installed with npm:
```shell
npm install @jdes/mutex
```

## Usage

Import module:

```javascript
/**
 * @class {Mutex}
 */
const Gpio = require('@jdes/mutex');
```

Instantiate:

```javascript
/**
 * @type {Mutex}
 */
let mutex = new Mutex();
```

Example:

```javascript
// Instantiate
let mutex = new Mutex(),
    name = null,
    iterations = 0;

// Lock and perform and unlock asynchronously
mutex.asynchronous()
    .then((unlock) => {
    	name = 'Jean Desravines';
    	unlock();
    })
    .catch(() => {
    	console.error('Mutex is locked');
    });

// Lock, perform and unlock asynchronously with delay.
// This section try to lock every 100ms but the delay accept to be locked every 200ms.
const interval = setInterval(() => {
    mutex.delayed(200)
        .then(() => iterations++)
        .then(() => {
            if (iterations === 5) {
                clearInterval(interval);
            } else {
                console.log(iterations);
            }
        });
}, 100);
```


## API

### Properties

#### locked: boolean

Indicate if the mutex is locked

Example:

```javascript
console.log(mutex.locked ? 'Locked' : 'Unlocked');
```

### Methods

#### lock(): boolean

* returns true if the mutex success to lock

Try to lock synchronously the mutex and return true if it success

Example:

```javascript
if (mutex.lock()) {
    console.log('Success');
} else {
    console.error('Error');
}
```

#### unlock(): Promise

* returns a resolved Promise

Unlock the mutex

Example:

```javascript
mutex.unlock()
    .then(() => {
        console.log('Unlocked');
    });
```

#### asynchronous(): Promise

* return a Promise resolved with the unlock callback if the mutex success to lock.

Try to lock the mutex and resolve the promise

Example:

```javascript
mutex.asynchronous()
    .then((unlock) => {
        // Unlock after 1s
        setTimeout(unlock, 1000);
    });
```

#### delayed(delay: number): Promise

* `delay` the delay in ms
* return a Promise resolved with the unlock callback if the mutex success to lock.

Try to lock the mutex and resolve the promise.
The mutex can be unlocked only in a interval of `delay` ms.

The interval is computed when the method is called so you can unlock the mutex before the end of the interval with
`mutex.unlock()` or
invoke an othe `mutex.delay(delay: number)` with a lesser delay.

You should have a mutex for every feature and not reuse a mutex for others.
It is useful to keep performance on polling functions.

Example:

```javascript
let iterations = 0;
const interval = setInterval(() => {
    mutex.delayed(200)
        .then(() => {
            if (iterations++ === 5) {
                clearInterval(interval);
            } else {
                console.log(iterations);
            }
        });
}, 100);
```

## Contributing

Contributions are appreciated, both in the form of bug reports and pull requests.
All pull requests have to pass tests and have a sufficient coverage.

## Tests

You can run the tests with npm:
```shell
npm test
```

The tests use [Mocha](http://mochajs.org) as the test framework and [Chai](http://http://chaijs.com) as the BDD assertion framework.
The coverage is measured with [Istanbul](https://github.com/gotwarlost/istanbul).
