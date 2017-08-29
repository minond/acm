LEIN = lein

default: build

build:
	$(LEIN) cljsbuild once
