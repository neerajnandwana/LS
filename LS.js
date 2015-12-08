(function(window, undefined){
	'use strict';

	var uid = 0,
		slice = Array.prototype.slice,
		store = window.localStorage,
		falsyValues = {
			'0': 		false,
			'': 		false,
			'null': 	false,
			'undefined':false,
			'false': 	false
		},
		listeners = {
			create: [],
			update: [],
			remove: [],
			clear: []
		};

	function empty(val){
		return val === undefined || val === null;
	}

	function isFunc(fn){
		return typeof fn === 'function';
	}

	function isStringFloat(n){
		return n.indexOf('.') > -1 ? true:false;
	}

	function getFnId(type, fn){
		return fn['___' + type + '_id'];
	}

	function getFnScope(type, fn){
		return fn['___' + type + '_scope'];
	}

	function setFnId(type, fn, val){
		fn['___' + type + '_id'] = val;
	}

	function setFnScope(type, fn, val){
		fn['___' + type + '_scope'] = val;
	}

	/* trigger all the listeners registered with given type */
	function trigger(type){
		if(!listeners[type]) return;
		var params = slice.call(arguments, 1),
			callFn = function(fn){
				fn.apply(getFnScope(type, fn), params);
			};
		listeners[type].forEach(callFn);
	}

	/* return unique id */
	function nextId(){
		return 'LS-ID-' + (++uid);
	}

	function LS(){}

	var LSProto = LS.prototype;

	LSProto.get = function(key){
		if(empty(key)) return;
		return store.getItem(key);
	}

	LSProto.getJson = function(key){
		if(empty(key)) return;
		return JSON.parse(store.getItem(key));
	}

	LSProto.getNumber = function(key){
		if(empty(key)) return;
		var val = store.getItem(key);
		return isStringFloat(val) ? parseFloat(val) : parseInt(val, 10);
	}

	LSProto.getBoolean = function(key){
		if(empty(key)) return;
		var val = store.getItem(key) || '';
		return falsyValues[val] === false ? false: true;
	}

	LSProto.set = function(key, value){
		if(empty(key) || empty(value)) return;
		var oldVal = LSProto.get(key);
		store.setItem(key, value);
		trigger(empty(oldVal) ? 'create': 'update', key, value, oldVal);
	}

	LSProto.setJson = function(key, value){
		if(empty(key) || empty(value)) return;
		var oldVal = LSProto.get(key);
		store.setItem(key, JSON.stringify(value));
		trigger(empty(oldVal) ? 'create': 'update', key, value, oldVal);
	}

	LSProto.remove = function(key){
		if(empty(key)) return;
		store.removeItem(key);
		trigger('remove', key);
	}

	LSProto.clear = function(){
		store.clear();
		trigger('clear');
	}

	/* register a listener for type. 
	   It will return the function which can be used for un-registering the listener. */
	LSProto.on = function(type, fn, scope){
		if(!listeners[type] || !isFunc(fn)) return;
		setFnId(type, fn, nextId());
		setFnScope(type, fn, scope || window);
		listeners[type].push(fn);
		return fn;
	}

	/* remove the listener for given type */
	LSProto.un = function(type, fn){
		if(!listeners[type] || !isFunc(fn)) return;
		var fnArr = listeners[type],
			len = fnArr.length;
		while(len--){
			if(getFnId(type, fn) === getFnId(type, fnArr[len])){
				fnArr.splice(len, 1);
				return;
			}
		}
	}

	/* remove all the listeners for given type */
	LSProto.removeAllEventListeners = function(type){
		if(!listeners[type]) return;
		listeners[type] = [];
	}

	window.LS = window.LS || new LS();

	/* Register as a named AMD module */
	if (typeof define === 'function' && define.amd) {
		define('LS', [], function() {
			return LS;
		});
	}
})(window, undefined);
