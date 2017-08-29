JAVA = java
CLJS = cljs.jar
CLOJURE = clojure.main

default: build

build:
	$(JAVA) -cp $(CLJS):src $(CLOJURE) build.clj
