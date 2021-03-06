'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication');
const local = require('feathers-authentication-local');

exports.before = function(app) {
	return {
		all: [],
		find: [
			globalHooks.resolveToIds.bind(this, '/roles', 'params.query.roles', 'name')	// resolve ids for role strings (e.g. 'TEACHER')
		],
		get: [],
		create: [
			globalHooks.resolveToIds.bind(this, '/roles', 'data.roles', 'name')
		],
		update: [
			globalHooks.resolveToIds.bind(this, '/roles', 'data.roles', 'name')
		],
		patch: [
			globalHooks.resolveToIds.bind(this, '/roles', 'data.roles', 'name')
		],
		remove: [auth.hooks.authenticate('jwt')]
	};
};

const getDisplayName = (user, app) => {
	// load protected roles
	return app.service('/roles').find({query:{	// TODO: cache these
		name: ['teacher', 'admin']
	}}).then((protectedRoles) => {
		const protectedRoleIds = (protectedRoles.data || []).map(role => role._id);
		let isProtectedUser = protectedRoleIds.find(role => {
			return (user.roles || []).includes(role);
		});

		if(isProtectedUser) {
			return user.lastName ? user.lastName : user._id;
		} else {
			return user.lastName ? `${user.firstName} ${user.lastName}` : user._id;
		}
	});
};

const decorateUser = (hook) => {
	return getDisplayName(hook.result, hook.app)
		.then(displayName => {
			hook.result = (hook.result.constructor.name === 'model') ? hook.result.toObject() : hook.result;
			hook.result.displayName = displayName;
		})
		.then(() => Promise.resolve(hook));
};

const decorateUsers = (hook) => {
	hook.result = (hook.result.constructor.name === 'model') ? hook.result.toObject() : hook.result;
	const userPromises = (hook.result.data || []).map(user => {
		return getDisplayName(user, hook.app).then(displayName => {
			user.displayName = displayName;
			return user;
		});
	});

	return Promise.all(userPromises).then(users => {
		hook.result.data = users;
		return Promise.resolve(hook);
	});
};

const User = require('../model');

exports.after = {
	all: [],
	find: [decorateUsers],
	get: [
		decorateUser,
		globalHooks.computeProperty(User, 'getPermissions', 'permissions')
	],
	create: [],
	update: [],
	patch: [],
	remove: []
};
