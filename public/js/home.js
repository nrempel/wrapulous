// On enter press
$(function () {
  $('#shortener').keypress(function (event) {
    if (event.which == 13) {
      var url = $("#shortener").val();

      $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: '/ajax/shorten_url/',
        data: JSON.stringify({destination: url})
      })
      .done(function(msg) {
        console.log(msg);
      })
      .fail(function(msg) {
        console.log(msg);
      });
    }
  });
});
