'use strict';

const assert = require('assert');
const helper = require('./login');
const chai = require('chai');

describe('login helper', function () {
	it('allows access to a protected resource with default values', () => {
		return helper.getAuthenticatedUser()
			.then(agent => {
				agent.get('/role/0000d186816abba584714c95')
					.then(function (res) {
						chai.expect(res).to.have.status(200);
					});
			})
			.catch(error => {
				chai.expect(error).to.be.undefined;
			})

	});
});
