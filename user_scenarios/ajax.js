// scott price

describe('Ajax Request', function(){

  it('should fire when data is ready', function(done) {

    var act = new Act();

    setTimeout(function(){
      act.set('ajax.response', {
        nameFirst: 'Chad',
        nameLast: 'Elliott'
      })
    }, 2000);

    act.onAll('ajax.response', function(err, data){
      expect(data.nameFirst).toBe('Chad');
      expect(data.nameLast).toBe('Elliott');
      done();
    });
  });

  it('should fire when multiple pieces of data have been recieved', function(done) {

    var act = new Act();

    setTimeout(function(){
      act.set('ajax.user', {
        nameFirst: 'Chad',
        nameLast: 'Elliott'
      });
    }, 2000);

    setTimeout(function(){
      act.set('ajax.purchase', {
        orderId: 41,
        products: [
          {
            id: 1,
            name: 'widget'
          },
          {
            id: 2,
            name: 'dongle'
          }
        ]
      });
    }, 1000);

    act.onAll([
      'ajax.user.nameFirst',
      'ajax.purchase.orderId'
    ], function(err, data){

      expect(data['ajax.user.nameFirst']).toBe('Chad');
      expect(data['ajax.purchse.orderId']).toBe(41);
      done();
    });
  });

});