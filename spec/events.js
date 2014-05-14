describe('Events Class', function() {

  var instance;

  function Class(){}
  Class.prototype = {};

  beforeEach(function(){
    extend(Class.prototype, Events.prototype);
    instance = new Class();
  });

  it('should have an on method that fires multiple times', function() {

    var err  = 1;
    var data = 2;

    var count = 0;

    instance.on('meep', function(e, d){
      expect(e).toEqual(err);
      expect(d).toEqual(data);
      count++;
    });

    instance.fire('meep', err, data);
    expect(count).toBe(1);
    instance.fire('meep', err, data);
    expect(count).toBe(2);
  });

  it('should have a once method that fires one time', function() {

    var err  = 1;
    var data = 2;

    var count = 0;

    instance.once('meep', function(e, d){
      expect(e).toEqual(err);
      expect(d).toEqual(data);
      count++;
    });

    instance.fire('meep', err, data);
    expect(count).toBe(1);
    instance.fire('meep', err, data);
    expect(count).toBe(1);
  });

  it('should have an off method that removes the listener', function() {

    var err  = 1;
    var data = 2;

    var count = 0;

    function listener(e, d){
      expect(e).toEqual(err);
      expect(d).toEqual(data);
      count++;
    }

    instance.on('meep', listener);

    instance.fire('meep', err, data);
    expect(count).toBe(1);

    instance.off('meep', listener);

    instance.fire('meep', err, data);
    expect(count).toBe(1);
  });

  it('should have a method for firing on all actions', function() {

    var err  = 1;
    var data = 2;

    var type = '';

    function listener(e, d, t){ type = t }

    instance.on('all', listener);

    instance.fire('meep', err, data);
    expect(type).toBe('meep');

    instance.fire('change', err, data);
    expect(type).toBe('change');

    instance.fire('error', err, data);
    expect(type).toBe('error');
  });

});