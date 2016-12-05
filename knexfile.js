module.exports = {

  development: {
	  client: 'pg',
	  debug: true,
	  connection: {
		  host: 'localhost',
		  user: process.env.DB_USERNAME,
		  password: process.env.DB_PASSWORD,
		  database: 'schulcloud'
	  }
  },

	test: {
		client: 'pg',
		debug: false,
		connection: {
			host: 'localhost',
			user: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
			database: 'schulcloud-test'
		}
	},

	production: {
		client: 'pg',
		debug: false,
		connection: {
			host: 'localhost',
			user: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
			database: 'schulcloud'
		}
	},

};
