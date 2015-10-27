describe('Configuration', function () {
    'use strict';

    var Configuration, config, configuration, expect, path, test_configs;

    beforeEach(function () {
        path = require('path');
        expect = require('expect.js');
        config = require('../src/configuration');
        Configuration = config.Configuration;
        configuration = new Configuration();

        test_configs = [
            path.join(__dirname, 'files', 'one'),
            path.join(__dirname, 'files', 'two'),
            path.join(__dirname, 'files', 'three')
        ];
    });

    describe('#call()', function () {
        it('calling the default exports is a shortcut call get function', function () {
            process.env.ACM_TEST_VALUE = '123';
            expect(config('acm.test.value')).to.be(process.env.ACM_TEST_VALUE);
        });

        it('has a set function', function () {
            config.set('acm.test.value', '321');
            expect(config('acm.test.value')).to.be('321');
        });
    });

    describe('#constructor()', function () {
        it('can be instanciated', function () {
            expect(configuration).to.be.a(Configuration);
        });

        it('comes with its own parser objects', function () {
            expect(configuration.parsers).to.be.a(Object);
        });

        describe('arguments', function () {
            it('takes custom paths', function () {
                configuration = new Configuration({ paths: ['one', 'two'] });
                expect(configuration.$paths).to.eql(['one', 'two']);
            });

            it('takes custom env vars', function () {
                configuration = new Configuration({ env: { hi: true } });
                expect(configuration.$env).to.eql({ hi: true });
            });

            it('takes file_links', function () {
                configuration = new Configuration({ file_links: { one: 'one.txt' } });
                expect(configuration.$file_links).to.eql({ one: 'one.txt' });
            });
        });

        describe('defaults argument values', function () {
            it('local config directory for paths', function () {
                configuration = new Configuration();
                expect(configuration.$paths).to.eql([
                    path.join(process.cwd(), 'config'),
                    process.cwd()
                ]);
            });

            it('global process for env', function () {
                configuration = new Configuration();
                expect(configuration.$env).to.be(process.env);
            });
        });

        describe('package configuration', function () {
            it('pushes the package default config directory when a package_root property is passed', function () {
                configuration = new Configuration({ package_root: __dirname });
                expect(configuration.$paths[2]).to.be(path.join(__dirname, 'config'));
            });

            it('pushes the package custom config directory when a package_config property is passed', function () {
                configuration = new Configuration({ package_config: __dirname + 'hihihi' });
                expect(configuration.$paths[2]).to.be(__dirname + 'hihihi');
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
            configuration = new Configuration({ paths: test_configs });
            contents = configuration.$load('config');
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
                contents = configuration.$load('fsfdsadfasdf');
                expect(contents).to.eql(undefined);
            });

            it('follows links', function () {
                configuration.$file_links.xconfig = path.join(__dirname, 'files', 'three', 'linktest.json');
                contents = configuration.$load('xconfig');
                expect(contents.hi).to.be(true);
            });

            it('follows links and merges contents', function () {
                configuration = new Configuration({ paths: test_configs });
                configuration.$file_links.config = path.join(__dirname, 'files', 'three', 'linktest.json');
                contents = configuration.$load('config');
                expect(contents.hi).to.be(true);
                expect(contents.two).to.be(true);
            });
        });

        describe('content', function () {
            describe('caching', function () {
                it('caches to memory', function () {
                    expect(configuration.$cache.config).to.be.an(Object);
                });

                it('returns a reference', function () {
                    configuration.$cache.config.manual = true;
                    contents = configuration.$load('config');
                    expect(contents.manual).to.be(true);
                });
            });

            describe('parsing', function () {
                it('supports custom extensions', function () {
                    configuration.parsers.type = configuration.parsers.yaml;
                    contents = configuration.$load('another');
                    expect(contents).to.be.an(Object);
                    expect(contents.hi).to.be('there');
                });
            });
        });
    });

    describe('#$readFromFile()', function () {
        it('can read files with merge fields', function () {
            configuration = new Configuration({ paths: test_configs });
            configuration.fields.name = 'Marcos';
            expect(configuration.$readFromFile('fields.name')).to.be('Marcos');
        });

        it('throws an error for invalid extensions', function () {
            expect(function () {
                configuration.$readFile('test.blah', 'blah');
            }).to.throwError();
        });
    });

    describe('#$readFromFile()', function () {
        beforeEach(function () {
            configuration = new Configuration({ paths: test_configs });
        });

        it('actually gets a configuration value', function () {
            expect(configuration.$readFromFile('config.ini')).to.be(true);
        });

        it('handles single level requests', function () {
            expect(configuration.$readFromFile('hey')).to.eql({ test: true });
        });

        describe('bad inputs', function () {
            it('handles bad files', function () {
                expect(configuration.$readFromFile('hihihi')).to.eql(undefined);
            });

            it('handles bad values', function () {
                expect(configuration.$readFromFile('config.bad.bad.bad')).to.eql(undefined);
            });
        });
    });

    describe('#$readFromEnv()', function () {
        var env;

        beforeEach(function () {
            env = {};
            configuration = new Configuration({ env: env });
        });

        it('returns undefined when not found', function () {
            expect(configuration.$readFromEnv('config.ini.hey')).to.be(undefined);
        });

        it('finds variables', function () {
            env.CONFIG_INI_HEY = true;
            expect(configuration.$readFromEnv('config.ini.hey')).to.be(true);
        });
    });

    describe('#$readFromArgv()', function () {
        var argv;

        beforeEach(function () {
            argv = {};
            configuration = new Configuration({ argv: argv });
        });

        it('returns undefined when not found', function () {
            expect(configuration.$readFromArgv('config.ini.hey')).to.be(undefined);
        });

        it('finds variables', function () {
            argv.config = { ini: { hey: true } };
            expect(configuration.$readFromArgv('config.ini.hey')).to.be(true);
        });
    });

    describe('#readFromUser()', function () {
        it('handles unset variables', function () {
            expect(configuration.$readFromUser('tests.test.test')).to.be(undefined);
        });
    });

    describe('#set()', function () {
        it('saves values to the $user object', function () {
            configuration.set('user.name', 'Marcos');
            expect(configuration.$user['user.name']).to.be('Marcos');
        });
    });

    describe('#get()', function () {
        var env, argv;

        beforeEach(function () {
            env = {};
            argv = {};
            configuration = new Configuration({ paths: test_configs, env: env, argv: argv });
        });

        it('prefers a command line argument over an enviroment variable', function () {
            argv.config = { ini: 'heyhey' };
            env.CONFIG_INI = 'heyhey1';
            expect(configuration.get('config.ini')).to.be('heyhey');
        });

        it('prefers an enviroment variable over a configuration file', function () {
            env.CONFIG_INI = 'heyhey';
            expect(configuration.get('config.ini')).to.be('heyhey');
        });

        it('takes from the config file when no env var is set', function () {
            expect(configuration.get('config.ini')).to.be(true);
        });

        it('users user set values over everything', function () {
            argv.config = { ini: 'one' };
            env.CONFIG_INI = 'two';
            configuration.set('config.ini', 'hey man');
            expect(configuration.get('config.ini')).to.be('hey man');
        });
    });
});
