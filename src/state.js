// issues: 'create' listeners will continue
// to reside in memmory after firing

function State(obj){
	var self = this;

	self.index = 0;
	self.buffer = [];
	// self.data = [];
	// self.data.error = null;

	self.define(obj);

	self.bufferSize || (self.bufferSize = 3);

	if(self.default) self.set(self.default);
}

State.prototype = {

	// ACCESSORS

	get: function(func){
		if(!func){
			var state = this._get();
			return state[0] || state[1];
		}

		if(this.isSet()){
			var state = this._get();
			func(state[0], state[1]);
		}
		else{
			this.once('change', func);
		}
	},

	_get: function(idx){
		var ret;

		idx = idx || this.index;
		ret = this.buffer[idx] || [];

		return ret;
	},

	set: function(data, err){
		if(!this.validator(data)) return false;

		data = this.mutator(data);

  	this.setState(err, data);

  	return true;
	},

	define: function(obj){
		for(var k in obj) this.updateDef(k, obj);
	},

	updateDef: function(key, obj){
		if(this.hasOwnProperty(key)) throw Error(key + ' is already defined for this state.');
		this[key] = obj[key];
	},

	// FALLBACKS

	validator: function(){
		return true;
	},

	mutator: function(data){
		return data;
	},

	complete: function(){
		return true;
	},

	// STATES

	isNew: function(){
		return this.isUnset();
	},

	isUnset: function(){
		return (this.state == null);
	},

	isSet: function(){
		return (this.state == 'set');
	},

	isTransitioning: function(){
		return (this.state == 'transition');
	},

	hasError: function(){
		return (this._get()[0]);
	},

	// TRIGGERS

	onAll: function(func){
		var self = this;
		self.each(function(idx, args){
			func.call(self, args[0], args[1]);
		});
		self.onNext(func);
	},

	onNext: function(func){
		this.on('change', func);
	},

	onCreate: function(func){
		this.onInit(func);
	},

	onInit: function(func){
		if( this.isUnset() ){
			this.once('create', func);
		}
		else{
			var args = this.buffer.initial;
			func.call(this, args[0], args[1]);
		}
	},

	each: function(func){
		var buffer, i;
		buffer = this.buffer;
		for(i = 0, il = buffer.length; i < il; i++){
			func(i, buffer[i]);
		}

		return this;
	},

	error: function(err, data){
		data = data || null;
		err  = (err instanceof Error) ? err : new Error(err);

		this.setState(err, data);

		return this;
	},

	// HELPERS

	setState: function(err, data){
		var idx, dataSet;

		dataSet = [err, data];

		idx = this.buffer.push(dataSet);

		if(idx > this.bufferSize){
			this.buffer.shift();
		}
		else{
			this.index = --idx;
		}

  	if( this.isUnset() ){
  		this.buffer.initial = dataSet;
  		this.state = 'set';
  		this.fire('create', err, data);
  	}

  	if(err) this.fire('error', err, data);

  	this.fire('change', err, data);

  	return this;
	},

	timeout: function(state, delay){
		var self, resolver;

		self = this;

		if(typeof state == 'number'){
			delay = state;
			state = new State();
			state.set(true);
		}

		if(delay){
			resolver = function(){
				setTimeout(function(){
					var err = new Error();

					err.message = 'Timeout: ' + delay + 'ms';
					err.type = 'timeout';

					self.error(err);
					self.fire('timeout');
				}, delay);
			}
		}
		else{
			resolver = function(){
				self.error('Timeout: condition met');
			}
		}

		state.onCreate(resolver);

		return self;
	},

	onError: function(func){
		return this.on('error', func);
	}

};

extend(State.prototype, Events.prototype);