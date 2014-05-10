function Act(){
  this.states = {};
}

Act.prototype = {

  state: function(name, opts){
    var state;

    state = this.states[name] || (this.states[name] = new State());

    opts && extend(state, opts);

    return state;
  },

  resolve: function(deps, acts, once){
    var method, depCount, completed, data, error, errors, resolver, name, state;

    method = once ? 'onCreate' : 'onChange';

    deps = toArray(deps);
    acts = toArray(acts);
    data = {};
    error = null;
    errors = {};
    depCount = deps.length;
    completed = [];

    var i = acts.length;
    while(i--){
      if( isString(acts[i]) ){
        acts[i] = this.state(acts[i]);
      }
    }

    function tracker(name, err, value){
      data[name]   = value;
      errors[name] = err;
      if(err) error = true;

      if(completed.indexOf(name) == -1) completed.push(name);
      if(completed.length == depCount){
        var i = acts.length;
        while(i--){
          var func = acts[i];

          if(func.set){
            func.set(data);
            err && func.error(errors);
          }
          else{
            func(err && errors, data);
          }
        }
      }
    }

    var i = depCount;
    while(i--){
      name = deps[i];
      state = this.state(name);

      resolver = (function(name, tracker){
        return function(err, data){
          tracker(name, err, data);
        }
      })(name, tracker);

      state[method](resolver);
    }

  	// var i, evt, def, depCount, collector, completed;

   //  if( isString(func) ){
   //    func = this.state(func);
   //  }

  	// depCount  = i = deps.length;
  	// completed = [];
  	// collector = {};

  	// while(i--){
  	// 	evt = deps[i];
  	// 	def = this.state(evt);
  	// 	collector[evt] = def;

  	// 	resolver = (function(evt, depCount, collector, completed, func){
  	// 		return function(){
  	// 			if(completed.indexOf(evt) == -1){
  	// 				completed.push(evt);
  	// 			}

  	// 			if(completed.length == depCount){
   //          if(func instanceof State){
   //            func.set(collector);
   //          }
   //          else{
   //            func(collector);
   //          }
   //        }
  	// 		}
  	// 	})(evt, depCount, collector, completed, func);

  	// 	def.on('change', resolver, true);
  	// }
  },

  timeout: function(name, state, delay){
    if( !isNumber(state) ){
      if( !(state instanceof State) ){
        state = this.state(state);
      }
    }

    return this.state(name).timeout(state, delay);
  },

  subState: function(deps){
    var depCount, dep;

    depCount = deps.length;

    var i = depCount;
    while(i--){
      dep = deps[i];

      dep.onChange();
    }
  },

  onChange: function(name, func, stateful){
  	return this.state(name).onChange(func, stateful);
  },

  onCreate: function(name, func){
  	return this.state(name).onCreate(func);
  },

  transition: function(name, func){
    return this.state(name).transition();
  },

  error: function(name, msg){
  	return this.state(name).error(msg);
  },

  get: function(name){
  	return this.state(name).get();
  },

  set: function(name, value, opts){
    opts = extend({
      delimeter: '.',
      nested: true
    }, opts);

    if( opts.nested && isObject(value) ){
      for(var key in value){
        this.set(name + opts.delimeter + key, value[key]);
      }
    }

    return this.state(name).set(value);
  }
}