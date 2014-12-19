-include scaffold/plugins/js.mk

all:: lint test

dependecies:
	git submodule update --init

install: dependecies
	npm install

test: install js-test
lint: install js-lint
