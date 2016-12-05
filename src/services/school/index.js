'use strict';

const service = require('feathers-knex');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

	const options = {
		Model: app.db,
		name: 'school',
		paginate: {
			default: 5,
			max: 25
		}
	};

  // Initialize our service with any options it requires
  app.use('/schools', service(options));

  // Get our initialize service to that we can bind hooks
  const schoolService = app.service('/schools');

  // Set up our before hooks
  schoolService.before(hooks.before);

  // Set up our after hooks
  schoolService.after(hooks.after);
};
