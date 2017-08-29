// Compiled by ClojureScript 1.9.521 {:target :nodejs}
goog.provide('acm.core');
goog.require('cljs.core');
acm.core.config = (function acm$core$config(label){
return System.getenv.call(null,label);
});
acm.core.tests = (function acm$core$tests(){
cljs.core.enable_console_print_BANG_.call(null);

return cljs.core.print.call(null,"BASH");
});
acm.core.tests.call(null);

//# sourceMappingURL=core.js.map