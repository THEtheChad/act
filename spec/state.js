describe('State', function() {

  it('set -- set + get', function() {

    var state;

    state = new State();
    state.set('123');

    expect(state.get()).toEqual('123');

  });

  it('set -- set + onAll', function(done) {

    var state;

    state = new State();
    state.set('123');

    state.onAll(function(err, data){
      expect(data).toEqual('123');
      done();
    });

  });

});

describe('State :: Errors', function(){

  it('error -- message', function(done) {

    var state;

    state = new State();
    state.error('Data is broken.');

    state.onAll(function(err, data){
      expect(err.message).toEqual('Data is broken.');
      done();
    });

  });

  it('error -- custom-type', function(done) {

    var state;

    state = new State();

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

});

describe('State :: Timeout', function() {

  it('timeout -- ms', function(done) {

    var state;

    state = new State();
    state.timeout(1000);
    state.onAll(function(err, data) {
      if(err){
        expect(err.type).toEqual('timeout');
        done();
      }
    });

  });

  it('timeout -- state', function(done) {

    var state, condition;

    state = new State();
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

    var state, condition;

    state = new State();
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

});


// describe('Definition Class', function() {

//   it('on (stateless)', function() {

//     var def, count;

//     def = new Definition();
//     count = 0;

//     def.set(1);

//     def.on('change', function(){
//       count++;
//     });

//     def.set(2);
//     def.set(3);
//     def.set(4);

//     expect(count).toEqual(3);
//   });

//   it('on (stateful)', function() {

//     var def, count;

//     def = new Definition();
//     count = 0;

//     def.set(1);

//     def.on('change', function(){
//       count++;
//     }, true);

//     def.set(2);
//     def.set(3);
//     def.set(4);

//     expect(count).toEqual(4);
//   });

//   it('once pre-fire (stateless)', function() {

//     var def, count;

//     def = new Definition();
//     count = 0;

//     def.set(1);

//     def.one('change', function(){
//       count++;
//     });

//     expect(count).toEqual(0);
//   });

//   it('once post-fire (stateless)', function() {

//     var def, count;

//     def = new Definition();
//     count = 0;

//     def.set(1);

//     def.one('change', function(){
//       count++;
//     });

//     def.set(2);
//     def.set(3);
//     def.set(4);

//     expect(count).toEqual(1);
//   });

//   it('validator', function() {

//     var def, success;

//     def = new Definition({
//       valid: function(data){ return (data == 2) }
//     });

//     success1 = def.set(1);
//     success2 = def.set(2);

//     expect(success1).toBe(false);
//     expect(success2).toBe(true);
//   });

//   it('one create (stateful)', function(done) {

//     var def;

//     def = new Definition();

//     def.set(1);
//     def.set(2);
//     def.set(3);
//     def.set(4);
//     def.set(5);

//     def.one('create', function(data){
//       expect(data).toEqual(1);
//       done();
//     }, true);
//   });

//   it('on create (stateful)', function(done) {

//     var def;

//     def = new Definition();

//     def.set(1);
//     def.set(2);
//     def.set(3);
//     def.set(4);
//     def.set(5);

//     def.on('create', function(data){
//       expect(data).toEqual(1);
//       done();
//     }, true);
//   });

// });