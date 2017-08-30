// Compiled by ClojureScript 1.9.521 {:target :nodejs}
goog.provide('acm.core');
goog.require('cljs.core');
acm.core.config = (function acm$core$config(label){
return acm.core.config_env.call(null,label);
});
acm.core.config_env = (function acm$core$config_env(label){
acm.core.label = "notfound";


return null;
});
module.exports = ({"config": acm.core.config});
acm.core.tests = (function acm$core$tests(){
cljs.core.enable_console_print_BANG_.call(null);

cljs.core.print.call(null,acm.core.config.call(null,"BASH"));

return cljs.core.print.call(null,"BASH");
});
acm.core.tests.call(null);
