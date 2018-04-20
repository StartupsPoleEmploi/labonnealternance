import React from 'react';
import { unSlug } from '../services/helpers'


// unslug function
const UNSLUG_TESTS = [
    // ['entry','expected']
    ['saint-sebastien-sur-loire','Saint Sebastien Sur Loire'],
    ['saint---sebastien','Saint Sebastien'],
]
test('unslug() tests', () => {
    UNSLUG_TESTS.forEach(test => {
        expect(unSlug(test[0])).toBe(test[1]);
    });
});