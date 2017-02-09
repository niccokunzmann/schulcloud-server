const chai = require('chai'),
	chaiHttp = require('chai-http');

chai.use(chaiHttp);
const app = require('../../src/app');

// Log in

module.exports.getAuthenticatedUser = (credentials = {username: 'admin@schul-cloud.org', password: 'Schul-cloud123' }) => {
		const agent = chai.request.agent(app);
		return agent
			.post('/authentication')
			.set('Accept', 'application/json')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send(credentials)
			.then(function (res) {
				const jwt = res.accessToken;
				if(!jwt) {
					return Promise.reject(new Error(res.error));
				}
				agent.set('Authorization', jwt);
				return Promise.resolve(agent);
			});

};

