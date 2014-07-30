(function( window ) {

	function range(n){
		return (function(arr){while(n--)arr[n]=n;return arr;})([]);
	}

	function createData(){
		var dataList = [];
		range(10).forEach(function(n){
			dataList.push({ key: 'key-'+n, value:'value-'+n});
		});
		return dataList;
	}

	function createJsonData(){
		var dataList = [];
		range(10).forEach(function(n){
			dataList.push({ key: 'keyObj-'+n, value: {name: 't-'+n, age: 30+n, dob: n+'/2/3', description: 'test desc "~!@#$%^&*()_+{}|:"<>?"'}});
		});
		return dataList;
	}

	var store = window.localStorage,
		testObjArr = createJsonData(),
		testArr = createData();

	QUnit.module( "LS", {
		setup: function() {
			store.clear();
		}, 
		teardown: function() {
			store.clear();
		}
	});

	QUnit.test('LS.set', function(assert){
		testArr.forEach(function(data){
			LS.set(data.key, data.value);
		});
		testArr.forEach(function(data){
			assert.equal(store.getItem(data.key), data.value, 'Testing LS.set for '+JSON.stringify(data));
		});
	});

	QUnit.test('LS.setJson', function(assert){		
		testObjArr.forEach(function(data){
			LS.setJson(data.key, data.value);
		});
		testObjArr.forEach(function(data){
			var valAct = store.getItem(data.key),
				valExp = JSON.stringify(data.value);
			assert.equal(valAct, valExp, 'Testing LS.setJson for '+JSON.stringify(data));		
		});		
	});

	QUnit.test('LS.get', function(assert){
		testArr.forEach(function(data){
			store.setItem(data.key, data.value);
		});
		testArr.forEach(function(data){
			assert.equal(LS.get(data.key), data.value, 'Testing LS.get for '+JSON.stringify(data));
		});
	});	

	QUnit.test('LS.getJson', function(assert){		
		testObjArr.forEach(function(data){
			store.setItem(data.key, JSON.stringify(data.value));
		});
		testObjArr.forEach(function(data){
			var valAct = LS.getJson(data.key),
				valExp = data.value;
			assert.deepEqual(valAct, valExp, 'Testing LS.getJson for '+JSON.stringify(data));		
		});		
	});

	QUnit.test('LS.clear', function(assert){
		testArr.forEach(function(data){
			store.setItem(data.key, data.value);
		});
		LS.clear();
		assert.equal(JSON.stringify(store).length, 2, 'Teseting LS.clear, now store is: '+JSON.stringify(store)); //empty object will be "{}"
	});		


	QUnit.test('LS.on, LS.un and LS.removeAllEventListeners', function(assert){
		var key1 = 'k-1',
			value1 = 'v-1',
			valueUpdated1 = 'v-1-updated',
			key2 = 'k-2',
			value2 = 'v-2',
			valueUpdated2 = 'v-2-updated',
			create1FnCalled = false,
			update1FnCalled = false,
			remove1FnCalled = false,
			clear2FnCalled = false,
			create2FnCalled = false,
			update2FnCalled = false,
			remove2FnCalled = false,
			clearFnCalled = false,
			fnCreate, fnUpdate, fnRemove, fnClear;

		fnCreate = LS.on('create', function(k, v){
			assert.equal(k, key1, '[onCreate] new entry added with key: '+k);
			assert.equal(v, value1, '[onCreate] new entry added with value: '+v);
			create1FnCalled = true;
		});
		fnUpdate = LS.on('update', function(k, newV, oldV){
			assert.equal(k, key1, '[onUpdate] entry updated with key: '+k);
			assert.equal(newV, valueUpdated1, '[onUpdate] new value: '+newV);	
			assert.equal(oldV, value1, '[onUpdate] old value: '+oldV);		
			update1FnCalled = true;			
		});
		fnRemove = LS.on('remove', function(k){
			assert.equal(k, key1, '[onRemove] remove entry with key: '+k);	
			remove1FnCalled = true;
		});

		//test for value1 
		LS.set(key1, value1);
		assert.ok(create1FnCalled, 'create1 fn invoked');
		LS.set(key1, valueUpdated1);
		assert.ok(update1FnCalled, 'update1 fn invoked');
		LS.remove(key1);
		assert.ok(remove1FnCalled, 'remove1 fn invoked');	
		//un-register the listeners and reset the value
		LS.un('create', fnCreate);
		LS.un('update', fnUpdate);
		LS.un('remove', fnRemove);
		create1FnCalled = update1FnCalled = remove1FnCalled = false;
		//non of the listener flag should set to true as we have removed all
		LS.set(key1, value1);
		assert.ok(create1FnCalled === false, 'create1 fn should not invoke');
		LS.set(key1, valueUpdated1);
		assert.ok(update1FnCalled === false, 'update1 fn should not invoke');
		LS.remove(key1);
		assert.ok(remove1FnCalled === false, 'remove1 fn should not invoke');	


		//test for value2
		fnCreate = LS.on('create', function(k, v){
			assert.equal(k, key2, '[onCreate] new entry added with key: '+k);
			assert.equal(v, value2, '[onCreate] new entry added with value: '+v);			
			create2FnCalled = true;
		});
		fnUpdate = LS.on('update', function(k, newV, oldV){
			assert.equal(k, key2, '[onUpdate] entry updated with key: '+k);
			assert.equal(newV, valueUpdated2, '[onUpdate] new value: '+newV);	
			assert.equal(oldV, value2, '[onUpdate] old value: '+oldV);
			update2FnCalled = true;
		});
		fnRemove = LS.on('remove', function(k){
			assert.equal(k, key2, '[onRemove] remove entry with key: '+k);	
			remove2FnCalled = true;
		});

		LS.set(key2, value2);
		assert.ok(create2FnCalled, 'create2 fn invoked');
		LS.set(key2, valueUpdated2);
		assert.ok(update2FnCalled, 'update2 fn invoked');
		assert.ok(remove2FnCalled === false, 'remove2 fn did not invoke');
		//un-register the listeners and reset the value
		LS.un('create', fnCreate);
		LS.un('update', fnUpdate);
		create2FnCalled = update2FnCalled = remove2FnCalled = false;
		//non of the listener flag should set to true as we have removed all
		LS.set(key2, value2);
		assert.ok(create2FnCalled === false, 'create1 fn should not invoke');
		LS.set(key2, valueUpdated2);
		assert.ok(update2FnCalled === false, 'update1 fn should not invoke');
		LS.remove(key2);
		assert.ok(remove2FnCalled, 'remove1 fn invoked');	


		fnClear = LS.on('clear', function(){
			assert.ok(true, '[onClear] all entries cleared');
			clearFnCalled = true;
		});	
		LS.clear();
		assert.ok(clearFnCalled, 'clear fn invoked');
		LS.un('clear', fnClear);
		clearFnCalled = false;
		assert.ok(clearFnCalled === false, 'clear fn should not invoke');


		//test remove all listeners
		var listenerFlag = false;
		LS.on('create', function(){ listenerFlag = true;});
		LS.on('create', function(){ listenerFlag = true;});
		LS.on('create', function(){ listenerFlag = true;});
		LS.on('update', function(){ listenerFlag = true;});
		LS.on('update', function(){ listenerFlag = true;});
		LS.on('update', function(){ listenerFlag = true;});
		LS.on('remove', function(){ listenerFlag = true;});
		LS.on('remove', function(){ listenerFlag = true;});
		LS.on('remove', function(){ listenerFlag = true;});
		LS.on('clear', function(){ listenerFlag = true;});
		LS.on('clear', function(){ listenerFlag = true;});
		LS.on('clear', function(){ listenerFlag = true;});
		LS.removeAllEventListeners('create');
		LS.set(key1, value1);
		LS.removeAllEventListeners('update');
		LS.set(key1, valueUpdated1);
		LS.removeAllEventListeners('remove');
		LS.remove(key1);	
		LS.removeAllEventListeners('clear');
		LS.clear();
		assert.ok(listenerFlag === false, 'after removeAllEventListeners non of the listener should invoke');
	});	

	QUnit.test('Test multiple event listener create/update/remove/clear', function(assert){
		var onCreate = 0,
			onUpdate = 0,
			onRemove = 0,
			onClear = 0,
			key = 'key',
			value = 'value',
			valueUpdated = 'value-updated',
			keyJson = 'keyJson',
			valueJson = {name: 'name-1', age: '22'},
			valueJsonUpdated = {name: 'name-1-updated', age: '22-updated'};

		LS.on('create', function(){ onCreate++;});
		LS.on('create', function(){ onCreate++;});
		LS.on('create', function(){ onCreate++;});
		LS.on('update', function(){ onUpdate++;});
		LS.on('update', function(){ onUpdate++;});
		LS.on('update', function(){ onUpdate++;});
		LS.on('remove', function(){ onRemove++;});
		LS.on('remove', function(){ onRemove++;});
		LS.on('remove', function(){ onRemove++;});
		LS.on('clear', function(){ onClear++});
		LS.on('clear', function(){ onClear++});
		LS.on('clear', function(){ onClear++});

		LS.set(key, value);
		LS.set(key, valueUpdated);
		LS.setJson(keyJson, valueJson);
		LS.setJson(keyJson, valueJsonUpdated);
		LS.remove(key);
		LS.remove(keyJson);
		LS.clear();

		assert.equal(onCreate, 6, '6- create listener invoked');
		assert.equal(onUpdate, 6, '6- update listener invoked');
		assert.equal(onRemove, 6, '6- remove listener invoked');
		assert.equal(onClear, 3, '3- clear listener invoked');
	});

	QUnit.test('Test single listener register for multiple event type', function(assert){
		var listenerInvoked = 0,
			key = 'key',
			value = 'value',
			valueUpdated = 'value-updated',
			keyJson = 'keyJson',
			valueJson = {name: 'name-1', age: '22'},
			valueJsonUpdated = {name: 'name-1-updated', age: '22-updated'};
		
		function commonListener(){ listenerInvoked ++ };

		LS.on('create', commonListener);
		LS.on('update', commonListener);
		LS.on('remove', commonListener);
		LS.on('clear', commonListener);

		LS.set(key, value);
		LS.set(key, valueUpdated);
		LS.setJson(keyJson, valueJson);
		LS.setJson(keyJson, valueJsonUpdated);
		LS.remove(key);
		LS.remove(keyJson);
		assert.equal(listenerInvoked, 6, '6 times common listener invoked');
		
		LS.un('create', commonListener);
		listenerInvoked = 0; //reset counter
		LS.set(key, value);
		LS.set(key, valueUpdated);
		LS.setJson(keyJson, valueJson);
		LS.setJson(keyJson, valueJsonUpdated);
		LS.remove(key);
		LS.remove(keyJson);
		LS.clear();
		//only update, remove and clear event will be listened 
		assert.equal(listenerInvoked, 5, '5 times common listener invoked'); 
		
		LS.un('update', commonListener);
		listenerInvoked = 0; //reset counter
		LS.set(key, value);
		LS.set(key, valueUpdated);
		LS.setJson(keyJson, valueJson);
		LS.setJson(keyJson, valueJsonUpdated);
		LS.remove(key);
		LS.remove(keyJson);
		LS.clear();
		//only remove and clear event will be listened 
		assert.equal(listenerInvoked, 3, '3 times common listener invoked');
		
		LS.un('remove', commonListener);
		listenerInvoked = 0; //reset counter
		LS.set(key, value);
		LS.set(key, valueUpdated);
		LS.setJson(keyJson, valueJson);
		LS.setJson(keyJson, valueJsonUpdated);
		LS.remove(key);
		LS.remove(keyJson);
		LS.clear();
		//only clear event will be listened 
		assert.equal(listenerInvoked, 1, '1 times common listener invoked');		
		
		LS.un('clear', commonListener);
		listenerInvoked = 0; //reset counter
		LS.set(key, value);
		LS.set(key, valueUpdated);
		LS.setJson(keyJson, valueJson);
		LS.setJson(keyJson, valueJsonUpdated);
		LS.remove(key);
		LS.remove(keyJson);
		LS.clear();
		//no event will be listened 
		assert.equal(listenerInvoked, 0, '0 times common listener invoked');
	});

})(window);
