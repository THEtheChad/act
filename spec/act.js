// scott price

describe('Act Class', function(){

  it('desc', function(){

    var act;
    act = new Act();

    act.onAll('page.load', function(err, data){

      act.get([
        'userName',
        'intellgience'
      ], function(err, data){
        expect(data.userName).toBe('Chad');
        expect(data.intellgience).toBe('genius');
      });
    });

    act.set('userName', 'Chad');
    act.set('intellgience', 'genius');

    act.set('page.load', true);
  });

  it('onAll', function(){

    var act, count;

    act = new Act();
    count = 0;

    act.set('custom.event', 1234);
    act.set('custom.event', 8);

    act.onAll('custom.event', function(){
      count++;
    });

    act.set('custom.event', 2);
    act.set('custom.event', 3);
    act.set('custom.event', 4);

    expect(count).toEqual(5);
  });

  it('onInit', function() {

    var act, value;

    act = new Act();

    act.set('custom.event', 1234);
    act.set('custom.event', 2);
    act.set('custom.event', 3);
    act.set('custom.event', 4);

    act.onInit('custom.event', function(err, data){
      value = data;
    });

    expect(value).toEqual(1234);

    act.onCreate('custom.event', function(err, data){
      value = data;
    }, false);

    expect(value).toEqual(1234);
  });

  it('onCreate', function() {

    var act, value;

    act = new Act();

    act.set('custom.event', 1234);
    act.set('custom.event', 2);
    act.set('custom.event', 3);
    act.set('custom.event', 4);

    act.onCreate('custom.event', function(err, data){
      value = data;
    });

    expect(value).toEqual(1234);

    act.onCreate('custom.event', function(err, data){
      value = data;
    }, false);

    expect(value).toEqual(1234);
  });

  it('onAll (multi)', function(done){

    var act;

    act = new Act();

    act.set('data1', 1234);
    act.set('data2', 2);
    act.set('data3', 3);
    act.set('data4', 4);

    act.onAll([
      'data1',
      'data2',
      'data3',
      'data4'
    ], function(err, data){
      expect(1).toBe(1);
      done();
    });

  });

  it('onInit (multi)', function(done){

    var act;

    act = new Act();

    act.set('data1', 1234);
    act.set('data2', 2);
    act.set('data3', 3);
    act.set('data4', 4);

    act.onInit([
      'data1',
      'data2',
      'data3',
      'data4'
    ], function(err, data){
      expect(1).toBe(1);
      done();
    });

  });

  it('once', function(){

    var act;

    act = new Act();

    act.set('data1', 1234);
    act.set('data2', 2);
    act.set('data3', 3);
    act.set('data4', 4);

    act.set('data4', 7);
    act.set('data4', 88);

    act.once([
      'data1',
      'data2',
      'data3',
      'data4'
    ], function(err, data){
      expect(data).toEqual({
        'data1': 1234,
        'data2': 2,
        'data3': 3,
        'data4': 88
      });
    });

    act.set('data1', 11);
    act.set('data2', 11);
    act.set('data3', 11);
    act.set('data4', 11);
  });

  // it('resolve', function() {

  //   var act, data;

  //   act = new Act();

  //   act.set('dep.one', 1);
  //   act.set('dep.two', 2);
  //   act.set('dep.three', 3);
  //   act.set('dep.four', 4);

  //   act.resolve([
  //     'dep.one',
  //     'dep.two',
  //     'dep.three',
  //     'dep.four'
  //   ], function(err, data){
  //     expect(data['dep.one']).toEqual(1);
  //     expect(data['dep.two']).toEqual(2);
  //     expect(data['dep.three']).toEqual(3);
  //     expect(data['dep.four']).toEqual(4);
  //   });
  // });

  // it('resolve (multiple)', function(done) {

  //   var act, count;

  //   act = new Act();
  //   count = 0;

  //   act.set('dep.one', 1);
  //   act.set('dep.two', 2);
  //   act.set('dep.three', 3);
  //   act.set('dep.four', 4);

  //   act.resolve([
  //     'dep.one',
  //     'dep.two',
  //     'dep.three',
  //     'dep.four'
  //   ], function(err, data){
  //     expect(data['dep.one']).toEqual(1);
  //     expect(data['dep.two']).toEqual(2);
  //     expect(data['dep.three']).toEqual(3);

  //     if(++count > 2){
  //       expect(data['dep.four']).toEqual(27);
  //       done();
  //     }
  //     else{
  //       expect(data['dep.four']).toEqual(4);
  //     }
  //   });

  //   act.set('dep.four', 4);
  //   act.set('dep.four', 27);
  // });

  // it('resolve (multiple)', function(done) {

  //   var act, count;

  //   act = new Act();
  //   count = 0;

  //   act.set('dep.one', 1);
  //   act.set('dep.two', 2);
  //   act.set('dep.three', 3);
  //   act.set('dep.four', 4);

  //   act.resolve([
  //     'dep.one',
  //     'dep.two',
  //     'dep.three',
  //     'dep.four'
  //   ], 'state.to.resolve');

  //   act.set('dep.four', 4);
  //   act.set('dep.four', 27);

  //   window.act = act;

  //   act.onChange('state.to.resolve', function(err, data){
  //     expect(1).toEqual(1);
  //     done();
  //   });
  // });

  it('timeout -- ms', function(done) {

    var act, count;

    act = new Act();

    act.timeout('timeout.state', 1000);

    act.onAll('timeout.state', function(err, data){
      expect(err.type).toEqual('timeout');
      done();
    });
  });

  it('timeout -- state + ms', function(done) {

    var act, count;

    act = new Act();

    act.timeout('timeout.state', 'timeout.dep', 1000);

    act.set('timeout.dep', true);

    act.onAll('timeout.state', function(err, data){
      expect(err.type).toEqual('timeout');
      done();
    });
  });

  // it('sub dep set', function() {

  //   var act;

  //   act = new Act();

  //   act.onCreate('parent.state.b', function(err, data){
  //     expect(data).toEqual(2);
  //   });

  //   act.onChange('parent.state.a', function(err, data){
  //     expect(data).toEqual(1);
  //   });

  //   act.set('parent.state', {a:1,b:2,c:3});

  // });

});