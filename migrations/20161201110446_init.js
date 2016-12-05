exports.up = function (knex, Promise) {

	return Promise.all([
		knex.schema.createTable('federal_state', table => {
			table.string('id').notNullable().primary();
		}),

		knex.schema.createTable('school', table => {
			table.increments('id').primary();
			table.string('name').notNullable();
			table.string('federal_state_id').references('federal_state.id').notNullable().onDelete('RESTRICT');
			table.json('address');
		}),

		knex.schema.createTable('system', table => {
			table.increments('id').primary();
			table.enu('type', ['moodle', 'itslearning', 'lernsax', 'local']).notNullable();
			table.string('url');
			table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
		}),

		knex.schema.createTable('school_system', table => {
			table.increments().primary();
			table.integer('school_id').unsigned().references('id').inTable('school');
			table.integer('system_id').unsigned().references('id').inTable('system');
		}),

		knex.schema.createTable('user', table => {
			table.increments('id').primary();
			table.string('firstName');
			table.string('lastName');
		}),

		knex.schema.createTable('account', table => {
			table.increments('id').primary();
			table.string('username').notNullable();
			table.string('token');
			table.integer('user_id').unsigned().references('user.id').notNullable().onDelete('CASCADE');
			table.integer('system_id').unsigned().references('system.id').notNullable().onDelete('RESTRICT');
			table.integer('school_id').unsigned().references('school.id').onDelete('SET NULL');
		}),

		knex.schema.createTable('role', table => {
			table.increments('id').primary();
			table.string('name').notNullable();
		}),

		knex.schema.createTable('user_roles', table => {
			table.increments().primary();
			table.integer('user_id').unsigned().references('id').inTable('user');
			table.integer('role_id').unsigned().references('id').inTable('role');
		}),

		knex.schema.createTable('permission', table => {
			table.increments('id').primary();
			table.string('name').notNullable();
		}),

		knex.schema.createTable('role_permission', table => {
			table.increments().primary();
			table.integer('role_id').unsigned().references('id').inTable('role');
			table.integer('permission_id').unsigned().references('id').inTable('permission');
		}),

		knex.schema.createTable('sub_role', table => {
			table.increments().primary();
			table.integer('role_id').unsigned().references('id').inTable('role');
			table.integer('is_a_role_id').unsigned().references('id').inTable('role');
		})

	]);
};

exports.down = function (knex, Promise) {
	return Promise.all([
		knex.schema.dropTable('sub_role'),
		knex.schema.dropTable('role_permission'),
		knex.schema.dropTable('permission'),
		knex.schema.dropTable('user_roles'),
		knex.schema.dropTable('role'),
		knex.schema.dropTable('account'),
		knex.schema.dropTable('user'),
		knex.schema.dropTable('system'),
		knex.schema.dropTable('school'),
		knex.schema.dropTable('federal_state')
	]);
};
