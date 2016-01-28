/* eslint-env mocha, node */
/* global expect */

'use strict';

const schedule = require('../build/schedule').schedule;
const after = require('../build/schedule').after;

describe('schedule', () => {
  const expectError = (e) => expect(e).to.be.an.instanceOf(Error);

  it('should require options', () => {
    return schedule(() => null)
      .catch(expectError);
  });

  it('should require `options.stop` to be a function', () => {
    return schedule(() => null, { stop: 42, every: {} })
      .catch(expectError);
  });

  it('should require `options.every` to be an object', () => {
    return schedule(() => null, { stop: () => null, every: 42 })
      .catch(expectError);
  });

  const options = { stop: after({ millis: 0}), every: { millis: 1 } };

  it('should schedule single action', () => {
    return schedule(() => 42, options, new Date())
      .then((result) => expect(result).to.be.equal(42));
  });

  it('should schedule multiple actions', () => {
    const date = new Date();

    return schedule(() => 2, options, date)
      .then((result) =>
	    schedule(() => result + 3, options, date))
      .then((result) => expect(result).to.be.equal(5));
  });
});
