(function(){

	/* Helpers */

	function isArray(obj) { return (obj instanceof Array)   }
	function isObject(obj){ return (typeof obj == 'object') }
	function isString(obj){ return (typeof obj == 'string') }
	function isNumber(obj){ return (typeof obj == 'number') }

	function toArray(obj){
		if(obj == null) return [];
		if(isArray(obj)) return obj;
		return [obj];
	}

	function slice(arr, idx){
		return Array.prototype.slice.call(arr, idx || 0);
	}

	function extend(target, source){
		var args, source, i, k;

		args = slice(arguments, 1);
		i = args.length;

		while(i--){
			source = args[i];

			for(k in source){
				target[k] = source[k];
			}
		}

		return target;
	}

	/* ACCESSOR CLASS */

	function Accessor(obj){
		this.object = obj;
	}

	Accessor.prototype = {
		traverse: function(path /* array */, create /* truthy */){
			var key, obj;

			obj = this.object;

			while(key = path.shift()){
				if(create && !obj.hasOwnProperty(key)){
					obj[key] = {};
				}
				obj = obj[key];
			}

			return obj;
		},

		set: function(path /* string */, value /* any */, create /* falsy */){
			var last, obj;

			path = path.split('.');
			last = path.pop();
			create = (arguments.length > 2) ? create : true;

			obj = this.traverse(path, create);

			obj[last] = value;

			return this;
		},

		get: function(path /* string */, create /* falsy */){

			path   = path.split('.');
			create = (arguments.length > 1) ? create : true; 

			return this.traverse(path, create);
		}
	};

	/* ACT CLASS */

	function Act(queue){
		this.events  = {};
		this.actions = {};
		this.definitions = {};

		if(queue){
			var i = queue.length;
			while(i--) this.push(queue[i]);
		}
	}

	Act.prototype = {

	  push: function(definition){
	  	var evt  = definition.event;
	  	var func = definition.callback;
	  	var data = definition.data;

	  	switch(definition.operation){
	  		case 'publish'   : return this.publish(evt, data);
	  		case 'subscribe' : return this.subscribe(evt, func);
	  		case 'get'       : return this.get(evt);
	  	}
	  },

	  define: function(opts){
	  	var self, def;

	  	self = this;
	  	def = {};

	  	extend(def, opts);

	  	if(def.timeout) this.defineTimeout(def);

		  this.definitions[def.event] = def;
	  },

	  defineTimeout: function(def){
	  	var opts, self;

	  	self = this;
	  	opts = {};

	  	if( isNumber(def.timeout) ) opts.delay = def.timeout; 

  		def.timer = setTimeout(function(){
	  		self.error(def.event, 'Timeout: ' + opts.delay + 'ms');
	  	}, opts.delay);
	  },

	  fire: function(){
	  	this.publish(evt, data);
	  },

	  on: function(evt, func){
	  	this.subscribe(evt, func);
	  },

	  subscribe: function(evt, func){
	  	var data = this.events[evt];

	  	if(data) func(data);

	  	if(!this.actions[evt]) this.actions[evt] = [];

	  	this.actions[evt].push(func);
	  },

	  publish: function(evt, data){
	  	var def, acts;

	  	def  = this.definitions[evt];
	  	acts = this.actions[evt];

	  	// def  = this.definitions.get(evt);
	  	// acts = def.actions;

	  	this.events[evt] = data;

	  	if(!acts) return;

	  	var i = acts.length;
	  	while(i--) acts[i](data);
	  },

	  error: function(evt, msg){
	  	var err;

	  	err = new Error(msg);

	  	this.publish(evt, err, null);
	  },

	  get: function(evt){
	  	return this.events[evt];
	  }
	}

	window.Accessor = Accessor;
	window.Act = Act;
	
})();