describe('Accessor Class', function() {

  var obj;

  beforeEach(function() {

    obj = new Accessor({
      'crazy': {
        'nested': {
          'object': {
            'to': {
              'test': {
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
        'nested': {
          'object': {
            'to': {
              'test': {
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

    expect(function() {
      obj.set('non-existent.nested.object', 22, false);
    }).toThrow();

  });

  it('GET: obj.get(path)', function() {
    var val = obj.get('crazy.nested.object.to.test.with');

    expect(val).toEqual(42);
  });

  it('GET: obj.get(path, create)', function() {

    expect(function() {
      var val = obj.get('non-existent.nested.object', false);
    }).toThrow();
  });

});

describe('Definition Class', function() {

  it('on (stateless)', function() {

    var def, count;

    def = new Definition();
    count = 0;

    def.set(1);

    def.on('change', function(){
      count++;
    });

    def.set(2);
    def.set(3);
    def.set(4);

    expect(count).toEqual(3);
  });

  it('on (stateful)', function() {

    var def, count;

    def = new Definition();
    count = 0;

    def.set(1);

    def.on('change', function(){
      count++;
    }, true);

    def.set(2);
    def.set(3);
    def.set(4);

    expect(count).toEqual(4);
  });

  it('once pre-fire (stateless)', function() {

    var def, count;

    def = new Definition();
    count = 0;

    def.set(1);

    def.one('change', function(){
      count++;
    });

    expect(count).toEqual(0);
  });

  it('once post-fire (stateless)', function() {

    var def, count;

    def = new Definition();
    count = 0;

    def.set(1);

    def.one('change', function(){
      count++;
    });

    def.set(2);
    def.set(3);
    def.set(4);

    expect(count).toEqual(1);
  });

  it('validator', function() {

    var def, success;

    def = new Definition({
      valid: function(data){ return (data == 2) }
    });

    success1 = def.set(1);
    success2 = def.set(2);

    expect(success1).toBe(false);
    expect(success2).toBe(true);
  });

});

describe('Act Class', function(){

  it('onChange', function() {

    var act, count;

    act = new Act();
    count = 0;

    act.publish('custom.event', 1234);

    act.onChange('custom.event', function(){
      count++;
    });

    act.publish('custom.event', 2);
    act.publish('custom.event', 3);
    act.publish('custom.event', 4);

    expect(count).toEqual(3);
  });

  it('resolve', function() {

    var act, data;

    act = new Act();

    act.publish('dep.one', 1);
    act.publish('dep.two', 2);
    act.publish('dep.three', 3);
    act.publish('dep.four', 4);

    act.resolve([
      'dep.one',
      'dep.two',
      'dep.three',
      'dep.four'
    ], function(obj){
      data = obj;
    });

    expect(data).toEqual({
      'dep.one': 1,
      'dep.two': 2,
      'dep.three': 3,
      'dep.four': 4
    });
  });

  it('push', function(){
    var data;

    window.act || (act = [])
    act.push({
      command: 'subscribe',
      event: 'mytest.event',
      callback: function(value){
        data = value;
      }
    });

    window.act || (act = [])
    act.push({
      command: 'publish',
      event: 'mytest.event',
      data: 1234
    });

    act = new Act(act);

    expect(data).toEqual(1234);
  });

});