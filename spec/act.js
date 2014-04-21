describe('Accessor Class', function() {

  var obj;

  beforeEach(function(){

    obj = new Accessor({
      'crazy': {
        'nested' : {
          'object' : {
            'to' : {
              'test' : {
                'with': 42
              }
            }
          }
        }
      }
    });

  });

  it('SET: obj.set(path, value)', function() {
    obj.set('create.a.new.nested.object', 22);

    expect(obj.object).toEqual({
      'crazy': {
        'nested' : {
          'object' : {
            'to' : {
              'test' : {
                'with': 42
              }
            }
          }
        }
      },
      'create': {
        'a': {
          'new': {
            'nested': {
              'object': 22
            }
          }
        }
      }
    });
  });

  it('SET: obj.set(path, value, create)', function() {

    expect(function(){
      obj.set('non-existent.nested.object', 22, false);
    }).toThrow();

  });

  it('GET: obj.get(path)', function() {
    var val = obj.get('crazy.nested.object.to.test.with');

    expect(val).toEqual(42);
  });

  it('GET: obj.get(path, create)', function() {

    expect(function(){
      var val = obj.get('non-existent.nested.object', false);
    }).toThrow();
  });

});


describe('Act Class', function() {

  beforeEach(function(){
  });

  it('blah', function(done){
    var act = new Act();

    act.define({
      event: 'pageName',
      timeout: 4000
    });

    act.on('pageName', function(err, data){
      console.log(err);
      expect().toEqual();
      done();
    });
  }); 

  it('publish', function() {

    var act = new Act(), data;
    act.publish('test', 1234);

    data = act.events;

    expect(data).toEqual({test:1234});
  });

  it('subscribe', function(done) {

    var act = new Act();

    act.subscribe('test', function(data){
      expect(data).toEqual(1234);
      done();
    });

    act.publish('test', 1234);
  });

  it('get', function() {

    var act = new Act(), data;

    act.publish('test', 1234);
    data = act.get('test');

    expect(data).toEqual(1234);
  });

});
/*
describe('complex API', function() {
  var ACT;

  beforeEach(function(){
    ACT = new Act();

    ACT.define({
      event: 'pageName',
      validator: function(){ return true; },
      mutator: function(d){ return d; },
      timeout: 4000,
      onTimeout: function(act){ act.publish(this.event) },
      onSuccess: function(){},
      onError: function(){},
      history: 0,
      complete: function(){ return true; },
      updateable: false
    });
  });

  it('timeout', function(done) {

    ACT.subscribe('pageName', function(data){
      done();
    });
  });
});
*/