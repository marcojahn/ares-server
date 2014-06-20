var timestamps = require('../../../middleware/enrichDocument').timestamps;

module.exports = function documenttimestamps (schema, options) {
    schema.add(
        {
            created: {type: Date, index: true},
            lastmodified: {type: Date, index: true}
        }
    );

    schema.pre('save', function (next) {
        //this.lastmodified = new Date;
        timestamps(this);
        next();
    });
};