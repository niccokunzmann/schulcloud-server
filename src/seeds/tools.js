const logger = require('winston');

module.exports = function(app) {
    "use strict";

    const testTools = [
        {
            _id: '5836bb5664582c35df3bc219',
            name: 'Lti Tools Test',
            url: 'http://lti.tools/test/tp.php',
            key: 'jisc.ac.uk',
            secret: 'secret',
            logo_url: 'http://fa-se.de/wp-content/uploads/2016/02/bettermarks-logo-neu.jpg',
            lti_message_type: 'basic-lti-launch-request',
            lti_version: 'LTI-1p0',
            resource_link_id: '0'
        }];

    const ltiToolService = app.service('/ltiTools');

    return Promise.all(testTools.map(t => checkTestTools(t)))
    .catch(error => logger.error(error));

    function checkTestTools(definition) {
        return ltiToolService.find({'_id': definition._id})
                .then(result => {
                if(result.data.length == 0) {
            return createTestTool(definition);
        } else {
            return Promise.resolve(result.data[0]);
        }
    })
    .then(result => {
            logger.info(`Found test ltiTool with id ${result.id} for ${definition.name}`);
        return result;
    });
    }

    function createTestTool(definition) {
        logger.info(`Creating test ltiTool with parameters ${definition}`);
        return ltiToolService.create(definition)
                .catch(error => {
                logger.error(error);
        throw error;
    });
    }
};
