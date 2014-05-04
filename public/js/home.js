// On enter

$(function () {
  $('#shortener').keypress(function (event) {
    if (event.which == 13) {
      var url = $("#shortener").val();

      $.ajax({
        type: "POST",
        url: '/ajax/shorten_url/',
        data: JSON.stringify({destination: url})
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
