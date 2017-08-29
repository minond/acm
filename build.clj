(require 'cljs.build.api)

(cljs.build.api/build "src"
  {:main 'acm.core
   :output-to "index.js"
   :target :nodejs})
