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


module.exports = internals.Salaries = function (options) {

    Hoek.assert(options, 'Options are required');
    Hoek.assert(options.sport, 'A sport must be specified');

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

        const lines = payload.toString().split('\n');
        const data = lines.slice(8,lines.length).join('\n');

        Csv.parse(data, (err, results) => {

            if (err) {
                return callback(err);
            }

            const salaries = internals.convertSalaries(results, this.settings.sport);
            this.salaries = salaries;

            return callback(null, salaries);
        });
    });
};


internals.convertSalaries = function (results, sport) {

    const salaries = {};
    const il = results.length;
    for (let i = 0; i < il; ++i) {
        const salary = internals.convertSalary(results[i], sport);
        salaries[salary.player] = salary;
        salaries[salary.id] = salary;
    }

    return salaries;
};


internals.convertSalary = function (result, sport) {

    if (sport === 'nfl') {
        return {
            player: result[12],
            id: result[13],
            position: result[10],
            cost: +result[14],
            game: result[15],
            team: result[16]
        };
    }

    return {
        player: result[11],
        id: result[12],
        position: result[9],
        cost: +result[13],
        game: result[14],
        team: result[15]
    };
};
