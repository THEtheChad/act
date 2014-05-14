function Act(queue){
  queue = queue || [];

  this.states = {};
  this.delimeter = '.';

  var i = queue.length;
  while(i--) this.push(queue[i]);
}

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
    var resolved, complete, depCount, errs, collector;

    complete = new State();
    complete.onAll(acts);

    resolved = [];

    depCount = list.length;

    errs = null;
    collector = {};

    var resolver = function(err, data, type){
      var name = this.name;

      if(err){
        errs || (errs = {});
        errs[name] = err;
      }

      collector[name] = data;

      if(resolved.indexOf(this.name) == -1){
        resolved.push(this.name);
      }

      if(resolved.length == depCount){
        complete.setState(errs, collector);
      }
    };

    for(var i = 0, il = depCount; i < il; i++){
      this.state(list[i])[method](resolver);
    }

    return this;
  },

  onAll: function(name, func){
    if(isArray(name)) return this.resolve('onAll', name, func);

    return this.state(name).onAll(func);
  },

  onNext: function(name, func){
    return this.state(name).onNext(func);
  },

  onInit: function(name, func){
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

  get: function(name){
  	return this.state(name).get();
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

ACT = new Act(ACT);