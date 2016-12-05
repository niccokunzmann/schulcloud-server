'use strict';
const school = require('./school');
const system = require('./system');
const account = require('./account');
const authentication = require('./authentication');
const user = require('./user');
const role = require('./role');
const mongoose = require('mongoose');
const service = require('feathers-knex');
const knex = require('knex');
const parse = require('pg-connection-string').parse;

module.exports = function () {
	const app = this;

	mongoose.connect(app.get('mongodb'), {user: process.env.DB_USERNAME, pass: process.env.DB_PASSWORD});
	mongoose.Promise = global.Promise;


	const config = app.get('postgres');
	const connection = parse(`postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${config.host}:${config.port}/${config.database}`)
	app.db = knex({
		client: 'pg',
		connection: connection
		//searchPath: 'knex,public'
	});

	app.configure(authentication);
	app.configure(user);
	app.configure(role);
	app.configure(account);
	app.configure(system);
	app.configure(school);
};
