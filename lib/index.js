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
    url: 'https://www.draftkings.com/lineup/getavailableplayerscsv'
};


module.exports = internals.Salaries = function (options) {

    Hoek.assert(options, 'Options are required');

    const schema = Joi.object({
        contestTypeId: Joi.number().required(),
        draftGroupId: Joi.number().required()
    });

    const validation = Joi.validate(options.query, schema);

    Hoek.assert(!validation.error, 'Query string options are required');
    this.settings = Hoek.applyToDefaults(internals.defaults, options);
};


internals.Salaries.prototype.set = function (callback) {

    const self = this;
    const settings = self.settings;
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
            self.salaries = salaries;

            return callback();
        });
    });
};

internals.Salaries.prototype.find = function (name) {

    const salaries = this.salaries;
    const il = salaries.length;
    for (let i = 0; i < il; ++i) {
        const salary = salaries[i];
        if (salary.player === name) {
            return salary;
        }
    }

    return null;
};


internals.convertSalaries = function (results) {

    const salaries = [];
    const il = results.length;
    for (let i = 1; i < il; ++i) {
        const salary = internals.convertSalary(results[i]);
        salaries.push(salary);
    }

    return salaries;
};


internals.convertSalary = function (result) {

    const salary = {
        player: result[1],
        position: result[0],
        cost: +result[2],
        game: result[3],
        avgPoints: +result[4],
        team: result[5]
    };

    return salary;
};
