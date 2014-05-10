// issues: 'create' listeners will continue
// to reside in memmory after firing

function State(obj){
	var self = this;

	self.actions = {};

	self.index = 0;
	self.bufferLength = 2;
	self.buffer = [];
	self.buffer.error = null;
	// self.data = [];
	// self.data.error = null;

	extend(self, obj);

	if(self.default) self.set(self.default);
}

State.prototype = {

	// ACCESSORS

	get: function(idx, ret){
		idx = idx || this.index;
		ret = this.buffer[idx];

		return ret[0] || ret[1];
	},

	set: function(data, err){
		if(!this.validator(data)) return false;

		data = this.mutator(data);

  	this.setState(err, data);

  	return true;
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
		return (this.state == null);
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
		return (this.get() instanceof Error);
	},

	// TRIGGERS

	onAll: function(func){
		this.each(func);
		this.onNext(func);
	},

	onNext: function(func){
		this.on('change', func);
	},

	onCreate: function(func){
		if( this.isUnset() ){
			this.once('create', func);
		}
		else{
			var args = this.buffer.initial;
			func(args[0], args[1]);
		}
	},

	each: function(func){
		var buffer, i, args;
		for(i = 0, il = buffer.length; i < il; i++){
			args = buffer[i];

			func(args[0], args[1]);
		}

		return this;
	},

	error: function(err, data){
		data = data || null;
		err  = new Error(err);

		this.setState(err, data);

		return this;
	}

	// fire: function(type, data){
	// 	var acts, data, i;

	// 	acts = this.getActions(type);
	// 	i    = acts.length;
	// 	data = data || this.get();
	// 	err  = this.buffer.error;

	// 	while(i--) acts[i](err, data);

	// 	return this;
	// },

	// error: function(opts){
	// 	var err;

	// 	opts = !opts.message ? {message: opts} : opts;

	// 	err = extend(new Error(), opts);

	// 	this.buffer.error = err;
	// 	this.state = 'error';

	// 	this.fire('error');
	// 	this.fire('change');

	// 	return this;
	// },

	// transition: function(){
	// 	this.state = 'transition';
	// 	this.fire('transition');

	// 	return this;
	// },

	// EVENTS

	// on: function(type, func, stateful){
	// 	if(type == 'create' || stateful == null) stateful = true;

	// 	if(stateful) this.checkState(type, func);

	// 	this.getActions(type).push(func);

	// 	return this;
	// },

	// once: function(type, func, stateful){
	// 	var self = this;

	// 	return self.on(type, function once(err, data){
	// 		func(err, data);
	// 		self.off(type, once);
	// 	}, stateful);
	// },

	// off: function(type, func){
	// 	var actions, idx;

	// 	actions = this.getActions(type);
	// 	idx = actions.indexOf(func);

	// 	actions.splice(idx, 1);

	// 	return this;
	// },

	// HELPERS

	setState: function(err, data){
		var idx, dataSet;

		dataSet = [err, data];

		idx = this.buffer.push(dataSet);

		if(idx > this.bufferLength){
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
					self.error({
						message: 'Timeout: ' + delay + 'ms',
						type: 'timeout'
					});
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
	}

	// checkState: function(type, func){
	// 	if(!this.isNew()){
	// 		var data = (type == 'create') ? this.buffer.initial : this.get();
	// 		func(this.buffer.error, data);
	// 	}
	// },

	// getActions: function(type){
	// 	return this.actions[type] || (this.actions[type] = []);
	// },

	// SUGAR

	// onChange: function(func, stateful){
	// 	return this.on('change', func, stateful);
	// },

	// onTransition: function(func, stateful){
	// 	return this.on('transition', func, stateful)
	// },

	// onCreate: function(func){
	// 	return this.on('create', func);
	// },

	// onError: function(func){
	// 	return this.on('error', func);
	// },

	// onTimeout: function(func){
	// 	return this.on('timeout', func);
	// }
};

addEvents(State);