'use strict';

var DELIM = '.',
    ENV_DELIM = '_';

var fs = require('fs'),
    path = require('path');

var deep = require('deep-get-set'),
    lazy = require('require-lazy-loader'),
    merge = require('lodash-node/modern/objects/merge'),
    partialRight = require('lodash-node/modern/functions/partialRight'),
    template = require('lodash-node/modern/utilities/template'),
    uniq = require('lodash-node/modern/arrays/uniq');

/**
 * @class Configuration
 * @param {Object} object with setup info:
 *  - {Object} argv command line arguments. defaults to process.argv
 *  - {Object} env enviroment variables hash. defaults to prototype.env
 *  - {Array} paths to look for configuration in. defaults to `pwd`/config
 */
function Configuration(config) {
    config = config || {};

    /**
     * enviroment variables hash
     * @property $env
     * @private
     * @type {Object}
     */
    this.$env = config.env || process.env;

    /**
     * command line arguments hash
     * @process $argv
     * @process
     * @type {Object}
     */
    this.$argv = config.argv || require('minimist')(process.argv.slice(2));

    /**
     * list of paths to look for config files in
     * @property $paths
     * @private
     * @type {Array}
     */
    this.$paths = config.paths || [ path.join(process.cwd(), 'config') ];

    /**
     * parsed and merged configuration objects are stored here.
     * key'ed by their file names
     * @property $cache
     * @private
     * @type {Object}
     */
    this.$cache = {};

    /**
     * file formats and their parsers
     * parsers are objects with a `parse` method
     * @property parsers
     * @type {Object}
     */
    this.parsers = {
        ini: lazy('ini parse'),
        json5: lazy('json5 parse'),
        json: JSON.parse,
        yaml: lazy('yamljs parse'),
        yml: lazy('yamljs parse'),
    };

    /**
     * passed to the template library when processing the raw config file
     * @property fields
     * @type {Object}
     */
    this.fields = {
        env: this.$env,
        process: process
    };

    /**
     * enabled and order of preference for readers
     * @property readers
     * @type {Object}
     */
    this.readers = [
        '$readFromArgv',
        '$readFromEnv',
        '$readFromFile'
    ];
}

/**
 * @example call
 *     Configuration.$parseEntryPath('secrets.google.token')
 *
 * @example return
 *     {
 *         file: secrets,
 *         path: google.token
 *     }
 *
 * @methd $parseEntryPath
 * @static
 * @private
 * @param {string} path
 * @return {Object} with a `file` and a `path` key
 */
Configuration.$parseEntryPath = function(path) {
    var parts = (path || '').split(DELIM);
    return {
        file: parts.shift(),
        path: parts.join(DELIM)
    };
};

/**
 * @example call
 *     Configuration.$parseEntryPath('secrets.google.token')
 *
 * @example return
 *     'SECRETS_GOOGLE_TOKEN'
 *
 * @method $parseEntryVariable
 * @static
 * @private
 * @param {string} path
 * @return {string}
 */
Configuration.$parseEntryVariable = function(path) {
    return (path || '')
        .split(DELIM)
        .join(ENV_DELIM)
        .toUpperCase();
};

/**
 * a deep merge function
 * @method $merge
 * @static
 * @private
 * @param {Object*} ob
 * @return {Object}
 */
Configuration.$merge = partialRight(merge, function deep(value, other) {
    return merge(value, other, deep);
});

/**
 * @method $load
 * @private
 * @param {string} file
 * @return {Object}
 */
Configuration.prototype.$load = function(file) {
    var contents,
        filepath,
        merged,
        fields = this.fields,
        parsers = this.parsers;

    if (file in this.$cache) {
        return this.$cache[ file ];
    }

    uniq(this.$paths).forEach(function (dir) {
        Object.keys(parsers).forEach(function (ext) {
            filepath = path.join(dir, file) + '.' + ext;

            if (fs.existsSync(filepath)) {
                contents = fs.readFileSync(filepath);
                contents = template(contents, fields);
                contents = parsers[ ext ](contents);
                merged = Configuration.$merge(merged || {}, contents);
            }
        });
    });

    return (this.$cache[ file ] = merged);
};

/**
 * gets a configuration value from a configuration file
 * @method $readFromFile
 * @private
 * @param {string} path
 * @return {mixed}
 */
Configuration.prototype.$readFromFile = function(path) {
    var config = Configuration.$parseEntryPath(path),
        baseref = this.$load(config.file);

    return config.path ? deep(baseref, config.path) : baseref;
};

/**
 * gets a configuration value from the enviroment variables reference
 * @method $readFromFile
 * @private
 * @param {string} path
 * @return {mixed}
 */
Configuration.prototype.$readFromEnv = function(path) {
    var envvar = Configuration.$parseEntryVariable(path);
    return envvar in this.$env ? this.$env[ envvar ] : undefined;
};

/**
 * gets a configuration value from the command line arguments
 * @method $readFromArgv
 * @private
 * @param {string} path
 * @return {mixed}
 */
Configuration.prototype.$readFromArgv = function(path) {
    return deep(this.$argv, path);
};

/**
 * gets a configration value from (1) a command line argument, (2) an
 * enviroment variable, or (3) a config file
 * @method get
 * @param {string} path
 * @return {mixed}
 */
Configuration.prototype.get = function(path) {
    var index = 0,
        len = this.readers.length,
        val;

    for (; index < len; index++) {
        val = this[ this.readers[ index ] ](path);

        if (val !== undefined) {
            return val;
        }
    }
};

module.exports = Configuration;
