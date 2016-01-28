/* eslint-env mocha, node */
/* global expect */

'use strict';

const translateDelay = require('../build/delay').translateDelay;
const randint = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min

describe('translateDelay', () => {
  it('should handle synonyms', () => {
    const dict = {
      millisecond: ['milliseconds', 'millis'],
      second: 'seconds',
      minute: 'minutes',
      hour: 'hours',
      day: 'days'
    };
    const units = Object.keys(dict);
    for (let unit of units) {
      const synonyms = [].concat(dict[unit]);
      for (let synonym of synonyms) {
	var value = randint(5, 16);
	expect(translateDelay({ [unit] : value })).to.be.equal(translateDelay({ [synonym] : value }))
      }
    }
  });

  it('should work for known values', () => {
    const knownValues = [
      { arg: { minutes: 6, seconds: 30 }, val: 390000 },
      { arg: { minutes: 60 }, val: 3600000 },
      { arg: { hour: 1, minute: 1, second: 1, millisecond: 1 }, val: 3661001 }
    ];
    for (let knownValue of knownValues) {
      expect(translateDelay(knownValue.arg)).to.be.equal(knownValue.val);
    }
  });
});
