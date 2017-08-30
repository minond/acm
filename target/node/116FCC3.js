goog.provide('cljs.nodejs');
goog.require('cljs.core');
cljs.nodejs.require = require;
cljs.nodejs.process = process;
cljs.nodejs.enable_util_print_BANG_ = (function cljs$nodejs$enable_util_print_BANG_(){
cljs.core._STAR_print_newline_STAR_ = false;

cljs.core._STAR_print_fn_STAR_ = (function() { 
var G__8489__delegate = function (args){
return console.log.apply(console,cljs.core.into_array.call(null,args));
};
var G__8489 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__8490__i = 0, G__8490__a = new Array(arguments.length -  0);
while (G__8490__i < G__8490__a.length) {G__8490__a[G__8490__i] = arguments[G__8490__i + 0]; ++G__8490__i;}
  args = new cljs.core.IndexedSeq(G__8490__a,0);
} 
return G__8489__delegate.call(this,args);};
G__8489.cljs$lang$maxFixedArity = 0;
G__8489.cljs$lang$applyTo = (function (arglist__8491){
var args = cljs.core.seq(arglist__8491);
return G__8489__delegate(args);
});
G__8489.cljs$core$IFn$_invoke$arity$variadic = G__8489__delegate;
return G__8489;
})()
;

cljs.core._STAR_print_err_fn_STAR_ = (function() { 
var G__8492__delegate = function (args){
return console.error.apply(console,cljs.core.into_array.call(null,args));
};
var G__8492 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__8493__i = 0, G__8493__a = new Array(arguments.length -  0);
while (G__8493__i < G__8493__a.length) {G__8493__a[G__8493__i] = arguments[G__8493__i + 0]; ++G__8493__i;}
  args = new cljs.core.IndexedSeq(G__8493__a,0);
} 
return G__8492__delegate.call(this,args);};
G__8492.cljs$lang$maxFixedArity = 0;
G__8492.cljs$lang$applyTo = (function (arglist__8494){
var args = cljs.core.seq(arglist__8494);
return G__8492__delegate(args);
});
G__8492.cljs$core$IFn$_invoke$arity$variadic = G__8492__delegate;
return G__8492;
})()
;

return null;
});
