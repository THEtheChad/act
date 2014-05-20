function Act(queue){
  queue = queue || [];

  this.states = {};
  this.delimeter = Act.delimeter;

  var i = queue.length;
  while(i--) this.push(queue[i]);
}

Act.bufferSize = 3;
Act.delimeter = '.';

Act.prototype = {

  isSet: function(){
    var states = this.states;
    var ret = [];

    for(var k in states){
      if(states[k].isSet()) ret.push(k);
    }

    return ret;
  },

  isUnset: function(list){
    var states = this.states;
    var ret = [];

    for(var k in states){
      if(states[k].isUnset()) ret.push(k);
    }

    return ret;
  },

  push: function(arr){
    var method = arr.shift();

    if(this[method]){
      this[method].apply(this, arr);      
    }
    else{
      console.log(method + ' is undefined');
    }
  },

  state: function(name, opts){
    opts = opts || {};
    opts.name = name;
    opts.bufferSize = Act.bufferSize;

    return this.states[name] || (this.states[name] = new State(opts));
  },

  define: function(name, opts){
    
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

  resolve: function(method, list, acts){
    var resolved, complete, depCount, self;

    self = this;

    complete = new State();
    complete.onAll(acts);

    resolved = [];

    depCount = list.length;

    var resolver = function(err, data, type){
      var name = this.name;

      if(resolved.indexOf(this.name) == -1){
        resolved.push(this.name);
      }

      if(resolved.length < depCount) return;

      var collector = {};
      var errs = null;

      for(var i = 0, il = resolved.length; i < il; i++){
        var name = resolved[i];
        var value = self.state(name).get();

        if(value instanceof Error){
          (errs || (errs = {}))[name] = value;
        }
        else{
          collector[name] = value;
        }
      }

      complete.setState(errs, collector);
      if(method == 'once'){
        complete.off(acts);
      }
    };

    for(var i = 0, il = depCount; i < il; i++){
      self.state(list[i]).onAll(resolver);
    }

    return self;
  },

  on: function(name, func){
    return this.state(name).on(func);
  },

  onAll: function(name, func){
    if(isArray(name)) return this.resolve('onAll', name, func);

    return this.state(name).onAll(func);
  },

  once: function(name, func){
    if(isArray(name)) return this.resolve('once', name, func);

    return this.state(name).once(func);
  },

  onNext: function(name, func){
    return this.state(name).onNext(func);
  },

  onInit: function(name, func){
    if(isArray(name)) return this.resolve('onInit', name, func);

    return this.state(name).onInit(func);
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

  get: function(name, func){
  	return this.state(name).get(func);
  },

  set: function(name, value, opts){
    opts = extend({
      nested: true
    }, opts);

    if( opts.nested && isObject(value) ){
      for(var key in value){
        this.set(name + this.delimeter + key, value[key]);
      }
    }

    return this.state(name).set(value);
  }
}

// ACT = new Act(ACT);