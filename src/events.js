function Events(){}

Events.prototype = {

	getActions: function(type){
		this.actions || (this.actions = {});
		return this.actions[type] || (this.actions[type] = []);
	},

	fire: function(type, err, data){
		var actions, i;

		actions = this.getActions(type);
		i = actions.length;

		while(i--) actions[i].call(this, err, data, type);

		actions = this.getActions('all');
		i = actions.length;

		while(i--) actions[i](err, data, type);		

		return this;
	},

	on: function(type, func){
		this.getActions(type).push(func);

		return this;
	},

	once: function(type, func){
		var self = this;

		return self.on(type, function once(err, data){
			func(err, data);
			self.off(type, once);
		});
	},

	off: function(type, func){
		var actions, idx;

		actions = this.getActions(type);
		idx = actions.indexOf(func);

		actions.splice(idx, 1);

		return this;
	}
};