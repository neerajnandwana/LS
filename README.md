LS
==

Wrapper around the window.localStorage with useful functionality apart from normal get/set value. <br>

**For example**

* Accessors for JSON/Boolean/Number,
* Event registering for type create/update/remove/clear events



###API functions
```javascript
LS.set(key, value)
LS.setJson(key, jsonObject)
LS.remove(key)
LS.clear()

LS.get(key): String
LS.getJson(key): Json Object
LS.getNumber(key): Int
LS.getBoolean(key): Boolean


//Event API
LS.on(event, listenerFunction, scope): function //this return function can be used for unregistering from event

//different type and listeners callback param
events type: 'create'	listenerFunction callback param: key, value
events type: 'update'	listenerFunction callback param: key, newValue, oldValue
events type: 'remove'	listenerFunction callback param: key
events type: 'clear'	listenerFunction callback param: key, value

//remove all the registered event for given event type
LS.removeAllEventListeners(eventType) 
```

**Event registering/unregistering example**

```javascript
//registering listener
var updateListenerFn = LS.on('update', function(key, newValue, oldValue){
	//code	
});

//unregistering listener
LS.un('update', updateListenerFn);
```
