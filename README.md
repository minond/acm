[![Build Status](https://travis-ci.org/minond/acm.svg?branch=master)](https://travis-ci.org/minond/acm)
[![Coverage Status](https://coveralls.io/repos/minond/acm/badge.png?branch=master)](https://coveralls.io/r/minond/acm?branch=master)

`acm - another configuration module` is a configuration reader. it can retrieve
values from command line arguments, environment variables, and local files of
different formats.

#### usage

just `require`ing `acm` will return an instantiated Configuration object that
uses some pretty standard [defaults](#defaults). this object will have a `.get`
method that takes a string which is used to retrieve an configuration entry.
running `config.get('github.username')` will result in the following checks:

1. a `--github.username` command line argument will be checked
2. a `GITHUB_USERNAME` environment variable will be checked
3. a file named `github.{json,json5,yaml,yml,ini}` will be checked and parsed
for the value

#### defaults

`acm` will make sensible decisions about where to check for configuration. for
example, when checking for:

* arguments: defaults to `process.argv`
* environment variables: defaults to `process.env`
* files: defaults to `$PWD/config/` then `$PWD`

#### file extension and parsers

available extensions are: `.ini`, `.json5`, `.json`, `.yaml`, and `.yml`.
parsers for each of these extensions are located in `acm.prototype.parsers`.
adding new properties to this object will add support for addition file
extension. property values should be functions that take a string, parse it,
and return an object.

#### file merge fields

files can use merge fields. [lodash's
template](http://lodash.com/docs#template) function is used to merge data into
string, and `acm.prototype.fields` is passed as the `data` argument. by default
`.fields` comes with a reference to `process` and `process.env` (labeled as
`env`)
