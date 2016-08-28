'use strict';

// Load modules

const Querystring = require('querystring');
const Csv = require('csv');
const Hoek = require('hoek');
const Joi = require('joi');
const Wreck = require('wreck');


// Declare internals

const internals = {};


internals.defaults = {
    wreckOptions: {},
    url: 'https://www.draftkings.com/bulklineup/getdraftablecsv'
};
https://www.draftkings.com/bulklineup/getdraftablecsv?draftGroupId=10519

module.exports = internals.Salaries = function (options) {

    Hoek.assert(options, 'Options are required');

    const schema = Joi.object({
        draftGroupId: Joi.number().required()
    });

    const validation = Joi.validate(options.query, schema);

    Hoek.assert(!validation.error, 'Query string options are required');
    this.settings = Hoek.applyToDefaults(internals.defaults, options);
};


internals.Salaries.prototype.get = function (callback) {

    const settings = this.settings;
    const wreckOptions = settings.wreckOptions;
    const querystring = Querystring.stringify(settings.query);
    const url = settings.url + '?' + querystring;

    Wreck.get(url, wreckOptions, (err, response, payload) => {

        if (err) {
            return callback(err);
        }

        const data = payload.toString();

        Csv.parse(data, (err, results) => {

            if (err) {
                return callback(err);
            }

            const salaries = internals.convertSalaries(results);
            this.salaries = salaries;

            return callback(null, salaries);
        });
    });
};


internals.convertSalaries = function (results) {

    const salaries = {};
    const il = results.length;
    for (let i = 1; i < il; ++i) {
        const salary = internals.convertSalary(results[i]);
        salaries[salary.player] = salary;
        salaries[salary.id] = salary;
    }

    return salaries;
};


internals.convertSalary = function (result) {

    const salary = {
        player: result[12],
        id: result[13],
        position: result[10],
        cost: +result[14],
        game: result[15],
        team: result[16]
    };

    return salary;
};
