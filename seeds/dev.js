
const federalStates = ["BW", "BY", "BE", "BB", "HB", "HH", "HE", "MV", "NI", "NW", "RP", "SL", "SN", "ST", "SH", "TH"];

let testSchools = [
	{ name: 'Schiller-Oberschule',
		federal_state_id: 'BW'},
	{ name: 'Gymnasium Friedensburg',
		federal_state_id: 'HH'}];
let testSystems = [{ type: 'moodle', url: 'http://moodle.schul.tech/'}, { type: 'itslearning'}, { type: 'local'}];
let systemMappings = [
	{school_id: 0, system_id: 0},
	{school_id: 0, system_id: 1},
	{school_id: 1, system_id: 0},
	{school_id: 1, system_id: 1},
	{school_id: 1, system_id: 2}
]
const testRoles = [
	{ name: 'user', permissions: ['BACKEND_VIEW', 'DASHBOARD_VIEW'], roles: [] },	// TODO: rename BACKEND_VIEW
	{ name: 'student', permissions: [], roles: ['user'] },
	{ name: 'teacher', permissions: ['LESSONS_VIEW'], roles: ['user'] },
	{ name: 'administrator', permissions: [], roles: ['user'] },
	{ name: 'superhero', permissions: [], roles: ['user'] }
];

exports.seed = function(knex, Promise) {

  return knex.raw(`INSERT INTO federal_state (id) VALUES ${ federalStates.map(s => {return "('" + s + "')"}) } ON CONFLICT DO NOTHING;`)
	  .then(() => Promise.all(
		  	testSchools.map(school => insertOrFind({definition: school, table: 'school', knex: knex}))
		  ))
	  .then(schoolIds => assignIds(schoolIds, testSchools))
	  .then(() => Promise.all(testSystems.map(system => insertOrFind({definition: system, table: 'system', knex: knex}))))
	  .then(systemIds => assignIds(systemIds, testSystems))
	  .then(() => Promise.all(systemMappings.map(m => {
		  m.school_id = testSchools[m.school_id].id;
		  m.system_id = testSystems[m.system_id].id;
		  return insertOrFind({definition: m, table: 'school_system', knex: knex});
	  })))
	  .then(() => {
		  
	  })
};


function insertOrFind({definition, table, resolveField = 'id', knex}) {
	return knex(table).select(resolveField).where(definition)
		.then(result => {
			if(result.length > 0) {
				return Promise.resolve(result[0][resolveField]);
			} else {
				return knex(table).insert(definition).returning(resolveField);
			}
		})
}

function assignIds(ids, collection) {
	collection.forEach((element, i) => {
		element.id = ids[i];	// assign the generated ids
	});
}
