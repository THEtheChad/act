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

		last: function(path /* string */, action /* func */, create /* truthy */){
			var last, obj;

			path = path.split('.');
			last = path.pop();

			obj = this.traverse(path, create);

			return action(last, obj);	
		},

		set: function(path /* string */, value /* any */, create /* truthy */){
			create = (arguments.length > 2) ? create : true;

			this.last(path, function(key, obj){
				obj[key] = value;
			}, create);

			return this;
		},

		get: function(path /* string */, create /* truthy */){
			create = (arguments.length > 1) ? create : true;

			return this.last(path, function(key, obj){
				return obj[key];
			}, create);
		},

		push: function(path /* string */, value /* any */, create /* truthy */){
			var arr;

			create = (arguments.length > 2) ? create : true;

			this.last(path, function(key, obj){
				arr = obj[key] || (obj[key] = []);
			});

			arr.push(value);

			return this;
		}
	};

	/* DEFINITION CLASS */

	function Definition(obj){
		this.actions = {
			create: [],
			change: [],
			transitioning: [],
			error: []
		};

		this.history = 0;

    // event: 'pageName'
    // timeout: 4000
		extend(this, obj);
	}

	Definition.prototype = {

		// ACCESSORS

		get: function(){
			return this.data;
		},

		set: function(data){
			if(!this.valid(data)) return false;

	  	this.data = this.mutate(data);

			if(!this.isSet()){
				if(!this.isTransitioning()) this.fire('create');

				this.state = 'set';
			}

	  	this.fire('change');

	  	return true;
		},

		// FALLBACKS

		valid: function(){
			return true;
		},

		mutate: function(data){
			return data;
		},

		complete: function(){
			return true;
		},

		// STATES

		isSet: function(){
			return (this.state == 'set');
		},

		isTransitioning: function(){
			return (this.state == 'transitioning');
		},

		hasError: function(){
			return (this.state == 'error');
		},

		// TRIGGERS

		fire: function(type){
			var acts, data, i;

			type = type || 'change';
			acts = this.actions[type];
			i    = acts.length;
			data = this.data;

			while(i--) acts[i](data);
		},

		error: function(msg){
			this.state = 'error';
			this.fire('error');
		},

		transitioning: function(){
			this.state = 'transitioning';
			this.fire('transitioning');
		},

		// EVENTS

		on: function(type, func, stateful){
			if(stateful && this.isSet()) func(this.data);

			this.actions[type].push(func);
		},

		one: function(type, func, stateful){
			var self = this;

			if(stateful && this.isSet()){
				func(self.data);
			}
			else{
				this.actions[type].push(function once(){
					func(self.data);
					self.off(type, once);
				});
			}
		},

		off: function(type, func){
			var actions, idx;

			actions = this.actions[type];
			idx = actions.indexOf(func);

			actions.splice(idx, 1);
		},

		// SUGAR

		onChange: function(func, stateful){
			this.on('change', func, stateful);
		}
	};

	/* ACT CLASS */

	function Act(queue){
		this.definitions = new Accessor({});

		if(queue){
			for(var i = 0, l = queue.length; i < l; i++){
				this.push(queue[i]);
			}
		}
	}

	Act.prototype = {

	  push: function(def){
	  	switch(def.operation || def.command){
	  		case 'publish'   : return this.publish(def.event, def.data);
	  		case 'subscribe' : return this.subscribe(def.event, def.callback);
	  		case 'get'       : return this.get(def.event);
	  	}
	  },

	  getDefinition: function(evt){
			return this.definitions.last(evt, function(key, obj){
	  		return obj[key] || (obj[key] = new Definition());
	  	}, true);
	  },

	  define: function(opts){
	  	var def = new Definition(opts);

	  	if(def.timeout) this.defineTimeout(def);

		  this.definitions.set(def.event, def);
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

	  subscribe: function(evt, func){
	  	this.getDefinition(evt).on('change', func);
	  },

	  publish: function(evt, data){
	  	this.getDefinition(evt).set(data);
	  },

	  resolve: function(deps, func){
	  	var l, i, evt, counter, resolver, collector;

	  	l = i = deps.length;
	  	counter = {count: l};
	  	collector = {};

	  	while(i--){
	  		evt = deps[i];
	  		resolver = (function(evt, collector, counter, func){
	  			return function(data){
	  				collector[evt] = data;

	  				if(!--counter.count) func(collector);
	  			}
	  		})(evt, collector, counter, func);

	  		this.getDefinition(evt).one('change', resolver, true);
	  	}
	  },

	  onChange: function(evt, func, stateful){
	  	this.getDefinition(evt).onChange(func, stateful);
	  },

	  onCreate: function(evt, func, stateful){
	  	this.getDefinition(evt).onCreate(func, stateful);
	  },

	  error: function(evt, msg){
	  	this.getDefinition(evt).error(msg);
	  },

	  get: function(evt){
	  	return this.getDefinition(evt).get();
	  }
	}

	window.Accessor = Accessor;
	window.Act = Act;
	window.Definition = Definition;
	
})();