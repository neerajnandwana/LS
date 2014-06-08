(function(window, undefined){
	'use strict';
	
    var uid = 0,
		toString = {}.toString,
		store = window.localStorage,
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

	/* trigger all the listeners registered with given type */
	function trigger(type){
		if(!listeners[type]) return;
		var params = arguments.slice(1),
			callFn = function(fn){
				fn.apply(fn.___scope, params);
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

    LSProto.set = function(key, value){
        if(empty(key) || empty(value)) return;
		var oldVal = LSProto.get(key);
        store.setItem(key, value);
		trigger(oldVal ? listeners.update: listeners.create, key, value, oldVal);
    }
	
	LSProto.setJson = function(key, value){
        if(empty(key) || empty(value)) return;
		var oldVal = LSProto.get(key);
        store.setItem(key, JSON.stringify(value));
		trigger(oldVal ? listeners.update: listeners.create, key, value, oldVal);
    }

    LSProto.remove = function(key){
        if(empty(key)) return;
        store.removeItem(key);
		trigger(listeners.remove, key);
    }

    LSProto.clear = function(){
        store.clear()
		trigger(listeners.clear);
    }
	
	/* register a listener for type. 
	   It will return the function which can be used for un-registering the listener. */
	LSProto.on = function(type, fn, scope){
		if(!listeners[type] || !isFunc(fn)) return;
		scope = scope || window;		
		fn.___scope = scope;
		fn.___id = nextId();
		listeners[type].push(fn);
		return fn;
	}
	
	/* remove the listener for given type */
	LSProto.un = function(type, fn){
		if(!listeners[type] || !isFunc(fn)) return;
		var fnArr = listeners[type],
			len = fnArr.length;
		while(len--){
			if(fn.___id === fnArr[len].___id){
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
