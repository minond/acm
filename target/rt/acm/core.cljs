(ns acm.core)

(defn config [label]
  (System/getenv label))

;;; Tests
(defn tests []
  (enable-console-print!)
  ;; (print (config "BASH"))
  (print "BASH")
)

(tests)
