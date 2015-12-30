'use strict';


const Code = require('code');
const Lab = require('lab');
const DKSalaries = require('../lib');

const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

describe('DraftKings Salaries', () => {

    it('sets salaries', (done) => {

        const options = {
            query: {
                contestTypeId: 29,
                draftGroupId: 7842
            }
        };

        const salaries = new DKSalaries(options);
        salaries.set((err) => {

            expect(err).to.not.exist();

            const realPlayer = 'Bears ';
            const realResult = salaries.find(realPlayer);
            const fakePlayer = 'Foobar';
            const fakeResult = salaries.find(fakePlayer);

            expect(realResult).to.exist();
            expect(fakeResult).to.not.exist();
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

    it('fails to set salaries', (done) => {

        const options = {
            url: 'http://foobar',
            query: {
                contestTypeId: 29,
                draftGroupId: 7842
            },
            wreckOptions: {
                timeout: 1
            }
        };

        const salaries = new DKSalaries(options);
        salaries.set((err) => {

            expect(err).to.exist();
            done();
        });
    });
});
