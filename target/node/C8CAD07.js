goog.provide('cljs.nodejs');
goog.require('cljs.core');
cljs.nodejs.require = require;
cljs.nodejs.process = process;
cljs.nodejs.enable_util_print_BANG_ = (function cljs$nodejs$enable_util_print_BANG_(){
cljs.core._STAR_print_newline_STAR_ = false;

cljs.core._STAR_print_fn_STAR_ = (function() { 
var G__8445__delegate = function (args){
return console.log.apply(console,cljs.core.into_array.call(null,args));
};
var G__8445 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__8446__i = 0, G__8446__a = new Array(arguments.length -  0);
while (G__8446__i < G__8446__a.length) {G__8446__a[G__8446__i] = arguments[G__8446__i + 0]; ++G__8446__i;}
  args = new cljs.core.IndexedSeq(G__8446__a,0);
} 
return G__8445__delegate.call(this,args);};
G__8445.cljs$lang$maxFixedArity = 0;
G__8445.cljs$lang$applyTo = (function (arglist__8447){
var args = cljs.core.seq(arglist__8447);
return G__8445__delegate(args);
});
G__8445.cljs$core$IFn$_invoke$arity$variadic = G__8445__delegate;
return G__8445;
})()
;

cljs.core._STAR_print_err_fn_STAR_ = (function() { 
var G__8448__delegate = function (args){
return console.error.apply(console,cljs.core.into_array.call(null,args));
};
var G__8448 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__8449__i = 0, G__8449__a = new Array(arguments.length -  0);
while (G__8449__i < G__8449__a.length) {G__8449__a[G__8449__i] = arguments[G__8449__i + 0]; ++G__8449__i;}
  args = new cljs.core.IndexedSeq(G__8449__a,0);
} 
return G__8448__delegate.call(this,args);};
G__8448.cljs$lang$maxFixedArity = 0;
G__8448.cljs$lang$applyTo = (function (arglist__8450){
var args = cljs.core.seq(arglist__8450);
return G__8448__delegate(args);
});
G__8448.cljs$core$IFn$_invoke$arity$variadic = G__8448__delegate;
return G__8448;
})()
;

return null;
});
