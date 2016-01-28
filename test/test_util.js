/* eslint-env mocha, node */
/* global expect */

const zeroPad = require('../build/util').zeroPad;

describe('zeroPad', () => {
  it('should prepend zeros when the number doesn\'t have enough places', () => {
    expect(zeroPad(2, 2)).to.be.equal('02');
    expect(zeroPad(2, 3)).to.be.equal('002');
  });

  it('should leave the number intact when it\'s large enough', () => {
    expect(zeroPad(2, 0)).to.be.equal('2');
    expect(zeroPad(2, 1)).to.be.equal('2');
    expect(zeroPad(20, 2)).to.be.equal('20');
  });
});
