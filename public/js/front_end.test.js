const {validateColor} = require('./code');

test.each(['Red', 'crimson'])('accepts %s', (c) => expect(validateColor(c)).toBe(true));
test.each(['', '  ', null])('rejects %p', (c) => expect(validateColor(c)).toBe(false));