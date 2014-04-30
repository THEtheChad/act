// scott price

describe('Act Class', function(){

  it('onChange (stateless)', function() {

    var act, count;

    act = new Act();
    count = 0;

    act.set('custom.event', 1234);

    act.onChange('custom.event', function(){
      count++;
    }, false);

    act.set('custom.event', 2);
    act.set('custom.event', 3);
    act.set('custom.event', 4);

    expect(count).toEqual(3);
  });

  it('onChange (stateful)', function() {

    var act, count;

    act = new Act();
    count = 0;

    act.set('custom.event', 1234);
    act.set('custom.event', 8);

    act.onChange('custom.event', function(){
      count++;
    });

    act.set('custom.event', 2);
    act.set('custom.event', 3);
    act.set('custom.event', 4);

    expect(count).toEqual(4);
  });

  it('onCreate', function() {

    var act, value;

    act = new Act();

    act.set('custom.event', 1234);

    act.onCreate('custom.event', function(err, data){
      value = data;
    });

    act.set('custom.event', 2);
    act.set('custom.event', 3);
    act.set('custom.event', 4);

    expect(value).toEqual(1234);

    act.onCreate('custom.event', function(err, data){
      value = data;
    }, false);

    expect(value).toEqual(1234);
  });

  it('resolve', function() {

    var act, data;

    act = new Act();

    act.set('dep.one', 1);
    act.set('dep.two', 2);
    act.set('dep.three', 3);
    act.set('dep.four', 4);

    act.resolve([
      'dep.one',
      'dep.two',
      'dep.three',
      'dep.four'
    ], function(err, data){
      expect(data['dep.one']).toEqual(1);
      expect(data['dep.two']).toEqual(2);
      expect(data['dep.three']).toEqual(3);
      expect(data['dep.four']).toEqual(4);
    });
  });

  it('resolve (multiple)', function(done) {

    var act, count;

    act = new Act();
    count = 0;

    act.set('dep.one', 1);
    act.set('dep.two', 2);
    act.set('dep.three', 3);
    act.set('dep.four', 4);

    act.resolve([
      'dep.one',
      'dep.two',
      'dep.three',
      'dep.four'
    ], function(err, data){
      console.log(data);

      expect(data['dep.one']).toEqual(1);
      expect(data['dep.two']).toEqual(2);
      expect(data['dep.three']).toEqual(3);

      if(++count > 2){
        expect(data['dep.four']).toEqual(27);
        done();
      }
      else{
        expect(data['dep.four']).toEqual(4);
      }
    });

    act.set('dep.four', 4);
    act.set('dep.four', 27);
  });

  it('resolve (multiple)', function(done) {

    var act, count;

    act = new Act();
    count = 0;

    act.set('dep.one', 1);
    act.set('dep.two', 2);
    act.set('dep.three', 3);
    act.set('dep.four', 4);

    act.resolve([
      'dep.one',
      'dep.two',
      'dep.three',
      'dep.four'
    ], 'state.to.resolve');

    act.set('dep.four', 4);
    act.set('dep.four', 27);

    window.act = act;

    act.onChange('state.to.resolve', function(err, data){
      expect(1).toEqual(1);
      done();
    });
  });

  it('timeout -- ms', function(done) {

    var act, count;

    act = new Act();

    act.timeout('timeout.state', 1000);

    act.onChange('timeout.state', function(err, data){
      expect(err.type).toEqual('timeout');
      done();
    });
  });

  it('timeout -- state + ms', function(done) {

    var act, count;

    act = new Act();

    act.timeout('timeout.state', 'timeout.dep', 1000);

    act.set('timeout.dep', true);

    act.onChange('timeout.state', function(err, data){
      expect(err.type).toEqual('timeout');
      done();
    });
  });

  it('sub dep set', function() {

    var act;

    act = new Act();

    act.onCreate('parent.state.b', function(err, data){
      expect(data).toEqual(2);
    });

    act.onChange('parent.state.a', function(err, data){
      expect(data).toEqual(1);
    });

    act.set('parent.state', {a:1,b:2,c:3});

  });

});