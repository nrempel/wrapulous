// On enter

$(function () {
  $('#shortener').keypress(function (event) {
    if (event.which == 13) {
      var url = $("#shortener").val();

      $.ajax({
        type: "POST",
        url: 'http://api.wrapulous.com/api/v0/links',
        data: { destination: url }
      })
      .done(function( msg ) {
        console.log('done: ' + msg);
      })
      .fail(function( msg ) {
        console.log('fail: ' + msg);
      })
      .always(function( msg ) {
        console.log('always: ' + msg);
      });
    }
  });
});
