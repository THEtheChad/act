function Collection(states){
	this.states = [];
}

Collection.prototype = {

	add: function(state){
		var self;

		self = this;

		self.states.push(state);

		state.onChange(function(){
			self.
		});
	},


};