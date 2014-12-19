-include vendor/minond/scaffold/plugins/js.mk

dependecies:
	git submodule update --init

install: dependecies
	npm install

test: install js-test
lint: install js-lint
