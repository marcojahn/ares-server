module.exports = function documenttimestamps (schema, options) {
    schema.add(
        {
            created: {type: Date, index: true, default: new Date},
            lastmodified: {type: Date, index: true}
        }
    );

    schema.pre('save', function (next) {
        this.lastmodified = new Date;
        next();
    });
};