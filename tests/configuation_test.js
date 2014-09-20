describe('Configuration', function () {
    'use strict';

    var Configuration, config, expect, path, test_configs;

    beforeEach(function () {
        path = require('path');
        expect = require('expect.js');
        config = require('../src/configuration');
        Configuration = config.Configuration;

        test_configs = [
            path.join(__dirname, 'files', 'one'),
            path.join(__dirname, 'files', 'two'),
            path.join(__dirname, 'files', 'three')
        ];
    });

    describe('#constructor()', function () {
        it('can be instanciated', function () {
            expect(config).to.be.a(Configuration);
        });

        it('comes with its own parser objects', function () {
            expect(config.parsers).to.be.a(Object);
        });

        describe('arguments', function () {
            it('takes custom paths', function () {
                config = new Configuration({ paths: ['one', 'two'] });
                expect(config.$paths).to.eql(['one', 'two']);
            });

            it('takes custom env vars', function () {
                config = new Configuration({ env: { hi: true } });
                expect(config.$env).to.eql({ hi: true });
            });
        });

        describe('defaults argument values', function () {
            it('local config directory for paths', function () {
                config = new Configuration();
                expect(config.$paths).to.eql([ path.join(process.cwd(), 'config') ]);
            });

            it('global process for env', function () {
                config = new Configuration();
                expect(config.$env).to.be(process.env);
            });
        });
    });

    describe('#$parseEntryPath()', function () {
        it('treats the only entry as the file with no path', function () {
            expect(Configuration.$parseEntryPath('hi').file).to.be('hi');
            expect(Configuration.$parseEntryPath('hi').path).to.eql('');
        });

        it('treats the first entry as the file and second as path', function () {
            expect(Configuration.$parseEntryPath('hi.there').file).to.be('hi');
            expect(Configuration.$parseEntryPath('hi.there').path).to.eql('there');
        });

        it('treats the first entry as the file and rest as path', function () {
            expect(Configuration.$parseEntryPath('hi.there').file).to.be('hi');
            expect(Configuration.$parseEntryPath('hi.there.again').path).to.eql('there.again');
        });

        it('can handle no arguments', function () {
            expect(Configuration.$parseEntryPath().file).to.be('');
            expect(Configuration.$parseEntryPath().path).to.eql('');
        });

        it('can take a string', function () {
            expect(Configuration.$parseEntryPath('').file).to.eql('');
            expect(Configuration.$parseEntryPath('').path).to.eql('');
        });
    });

    describe('#$parseEntryVariable(', function () {
        it('can handle no arguments', function () {
            expect(Configuration.$parseEntryVariable()).to.be('');
        });

        it('can take a string', function () {
            expect(Configuration.$parseEntryVariable('hi')).to.be('HI');
        });

        it('switches periods for underscores', function () {
            expect(Configuration.$parseEntryVariable('hi.there.man')).to.be('HI_THERE_MAN');
        });
    });

    describe('#$merge()', function () {
        var merged;

        it('takes properties from left to right', function () {
            merged = Configuration.$merge(
                {
                    hi: true
                },
                {
                    bye: false
                }
            );

            expect(merged.hi).to.be(true);
        });

        it('does not overwrite properties', function () {
            merged = Configuration.$merge(
                {
                    hi: true
                },
                {
                    hi: false
                }
            );

            expect(merged.hi).to.be(true);
        });

        it('does a deep merge', function () {
            merged = Configuration.$merge(
                {
                    one: {
                        two: {
                            hey: true,
                            three: {
                                four: true
                            }
                        }
                    }
                },
                {
                    one: {
                        hey: true,
                        two: {
                            three: {
                                five: true
                            }
                        }
                    }
                }
            );

            expect(merged.one.hey).to.be(true);
            expect(merged.one.two.hey).to.be(true);
            expect(merged.one.two.three.five).to.be(true);
            expect(merged.one.two.three.four).to.be(true);
        });
    });

    describe('#$load()', function () {
        var contents;

        beforeEach(function () {
            config = new Configuration({ paths: test_configs });
            contents = config.$load('config');
        });

        describe('file search', function () {
            it('finds files of supported extensions', function () {
                expect(contents.yml).to.be(true);
                expect(contents.ini).to.be(true);
            });

            it('scans all directories', function () {
                expect(contents.one).to.be(true);
                expect(contents.two).to.be(true);
                expect(contents.three).to.be(true);
            });

            it('returns undefined when the file is not found', function () {
                contents = config.$load('fsfdsadfasdf');
                expect(contents).to.eql(undefined);
            });
        });

        describe('content', function () {
            describe('caching', function () {
                it('caches to memory', function () {
                    expect(config.$cache.config).to.be.an(Object);
                });

                it('returns a reference', function () {
                    config.$cache.config.manual = true;
                    contents = config.$load('config');
                    expect(contents.manual).to.be(true);
                });
            });

            describe('parsing', function () {
                it('supports custom extensions', function () {
                    config.parsers.type = config.parsers.yaml;
                    contents = config.$load('another');
                    expect(contents).to.be.an(Object);
                    expect(contents.hi).to.be('there');
                });
            });
        });
    });

    describe('#$readFromFile()', function () {
        beforeEach(function () {
            config = new Configuration({ paths: test_configs });
        });

        it('actually gets a configuration value', function () {
            expect(config.$readFromFile('config.ini')).to.be(true);
        });

        it('handles single level requests', function () {
            expect(config.$readFromFile('hey')).to.eql({ test: true });
        });

        describe('bad inputs', function () {
            it('handles bad files', function () {
                expect(config.$readFromFile('hihihi')).to.eql(undefined);
            });

            it('handles bad values', function () {
                expect(config.$readFromFile('config.bad.bad.bad')).to.eql(undefined);
            });
        });
    });

    describe('#$readFromEnv()', function () {
        var env;

        beforeEach(function () {
            env = {};
            config = new Configuration({ env: env });
        });

        it('returns undefined when not found', function () {
            expect(config.$readFromEnv('config.ini.hey')).to.be(undefined);
        });

        it('finds variables', function () {
            env.CONFIG_INI_HEY = true;
            expect(config.$readFromEnv('config.ini.hey')).to.be(true);
        });
    });

    describe('#$readFromArgv()', function () {
        var argv;

        beforeEach(function () {
            argv = {};
            config = new Configuration({ argv: argv });
        });

        it('returns undefined when not found', function () {
            expect(config.$readFromArgv('config.ini.hey')).to.be(undefined);
        });

        it('finds variables', function () {
            argv.config = { ini: { hey: true } };
            expect(config.$readFromArgv('config.ini.hey')).to.be(true);
        });
    });

    describe('#get()', function () {
        var env, argv;

        beforeEach(function () {
            env = {};
            argv = {};
            config = new Configuration({ paths: test_configs, env: env, argv: argv });
        });

        it('prefers a command line argument over an enviroment variable', function () {
            argv.config = { ini: 'heyhey' };
            env.CONFIG_INI = 'heyhey1';
            expect(config.get('config.ini')).to.be('heyhey');
        });

        it('prefers an enviroment variable over a config file', function () {
            env.CONFIG_INI = 'heyhey';
            expect(config.get('config.ini')).to.be('heyhey');
        });

        it('takes from the config file when no env var is set', function () {
            expect(config.get('config.ini')).to.be(true);
        });
    });
});
