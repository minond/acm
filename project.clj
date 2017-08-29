(defproject acm "0.1.0-SNAPSHOT"
  :description "another configuration module"
  :url "https://github.com/minond/acm"

  :dependencies [[org.clojure/clojure "1.8.0"]
                 [org.clojure/clojurescript "1.9.521"]]

  ;; [lein-cljsbuild "1.1.7"]
  :plugins [[lein-cljsbuild "1.1.7"]
            [lein-figwheel "0.3.9"]]

  :cljsbuild {:builds
              {:main {:source-paths ["src"]
                      :figwheel true
                      :compiler {
                        :main acm.core
                        :output-to "target/rt/index.js"
                        :output-dir "target/rt"
                        :target :nodejs
                        :optimizations :none}}}})
