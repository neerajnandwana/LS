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
	
})(window);
