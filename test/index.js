'use strict';


const Code = require('code');
const Lab = require('lab');
const DKSalaries = require('../lib');

const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

describe('DraftKings Salaries', () => {

    it('gets salaries', (done) => {

        const options = {
            query: {
                draftGroupId: 10519
            }
        };

        const salaries = new DKSalaries(options);
        salaries.get((err, result) => {

            expect(err).to.not.exist();

            expect(result['Bears ']).to.exist();
            expect(result['7147717']).to.exist();
            done();
        });
    });

    it('fails to initialize', (done) => {

        try {
            const salaries = new DKSalaries();
            expect(salaries).to.not.exist();
        }
        catch (err) {
            expect(err).to.exist();
        }

        done();
    });

    it('fails to get salaries', (done) => {

        const options = {
            url: 'http://foobar',
            query: {
                draftGroupId: 10519
            },
            wreckOptions: {
                timeout: 1
            }
        };

        const salaries = new DKSalaries(options);
        salaries.get((err) => {

            expect(err).to.exist();
            done();
        });
    });
});
