(ns acm.core
  (:require-macros [adzerk.env :as env]))

(defn config [label]
  (config-env label))

(defn config-env [label]
  (env/def label "notfound"))

(set! (.-exports js/module)
  #js {:config config})

;;; Tests
(defn tests []
  (enable-console-print!)
  (print (env/def "BASH"))
  (print "BASH")
)

(tests)
