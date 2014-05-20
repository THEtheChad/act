describe('State Class', function() {

  var state;

  beforeEach(function(){
    state = new State();
  });

  it('set -- set + get', function() {

    state.set('123');

    state.get(function(err, val){
      expect(val).toEqual('123');
    });

  });

  it('set -- set + onAll', function(done) {

    state.set('123');

    state.onAll(function(err, data){
      expect(data).toEqual('123');
      done();
    });

  });

  it('onAll', function() {

    var count = 0;

    state.set(1);
    state.set(2);
    state.set(3);

    state.onAll(function(err, data){
      count++;
      expect(data).toBe(count);
    });

    expect(count).toBe(3);

  });

  it('onNext', function() {

    var count = 0;

    state.set(1);
    state.set(2);
    state.set(3);

    state.onNext(function(err, data){
      count++;
      expect(data).toBe(4);
    });

    state.set(4);

    expect(count).toBe(1);

  });

  it('error -- message', function(done) {

    state.error('Data is broken.');

    state.onAll(function(err, data){
      expect(err.message).toEqual('Data is broken.');
      done();
    });

  });

  it('error -- custom-type', function(done) {

    var err = new Error();

    err.message = 'custom message';
    err.type = 'custom';

    state.error(err);

    state.onAll(function(err, data){
      expect(err.message).toEqual('custom message');
      expect(err.type).toEqual('custom');
      done();
    });

  });

  it('timeout -- ms', function(done) {

    state.timeout(1000);
    state.onAll(function(err, data) {
      if(err){
        expect(err.type).toEqual('timeout');
        done();
      }
    });

  });

  it('timeout -- state', function(done) {

    var condition;

    condition = new State();

    state.timeout(condition);
    condition.set(true);

    state.onAll(function(err, data) {
      if(err){
        expect(1).toEqual(1);
        done();
      }
    });

  });

  it('timeout -- state + ms', function(done) {

    var condition;

    condition = new State();

    state.timeout(condition, 1000);
    condition.set(true);

    state.onAll(function(err, data) {
      if(err){
        expect(err.type).toEqual('timeout');
        done();
      }
    });

  });

  it('define -- mutator', function() {

    state.define({
      mutator: function(data){
        return 41;
      }
    });

    state.set(2);

    state.get(function(err, val){
      expect(val).toBe(41);
    });

  });

  it('define -- validator', function() {

    state.define({
      validator: function(data){
        return false;
      }
    });

    expect(state.set(41)).toBe(false);
  });

  it('define -- 2x throw error', function() {

    state.define({
      validator: function(data){
        return false;
      }
    });

    expect(function(){
      state.define({
        validator: function(data){
          return false;
        }
      });
    }).toThrowError();

  });

});