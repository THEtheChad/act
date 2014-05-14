function Dependencies(list){
	this.actions = [];
	this.deps = [];
	this.depCount = 0;
}

Dependencies.prototype = {
	add: function(state){
		this.deps.push(state);
		this.depCount++;

		state.on('all', function(err, data, type){

		});
	},

	do: function(func){
		this.actions.push(func);
	},






};

extend(Dependencies.prototype, Events.prototype);