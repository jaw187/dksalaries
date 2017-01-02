'use strict';


const Code = require('code');
const Lab = require('lab');
const DKSalaries = require('../lib');

const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

describe('DraftKings Salaries', () => {

    it('gets nfl salaries', (done) => {

        const options = {
            query: {
                draftGroupId: 11996
            },
            sport: 'nfl'
        };

        const salaries = new DKSalaries(options);
        salaries.get((err, result) => {

            expect(err).to.not.exist();

            expect(result['Giants ']).to.exist();
            expect(result['8045748']).to.exist();
            done();
        });
    });

    it('gets nba salaries', (done) => {

        const options = {
            query: {
                draftGroupId: 11915
            },
            sport: 'nba'
        };

        const salaries = new DKSalaries(options);
        salaries.get((err, result) => {

            expect(err).to.not.exist();

            expect(result['LeBron James']).to.exist();
            expect(result['8043882']).to.exist();
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
                draftGroupId: 1
            },
            wreckOptions: {
                timeout: 1
            },
            sport: 'foo'
        };

        const salaries = new DKSalaries(options);
        salaries.get((err) => {

            expect(err).to.exist();
            done();
        });
    });
});
