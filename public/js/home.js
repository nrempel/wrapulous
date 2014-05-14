// On enter press
$(function () {
  var shortener = $('#shortener');
  shortener.keypress(function (event) {
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
        shortener.addClass('glow-green');
        setTimeout(function(){
          shortener.removeClass('glow-green');
        }, 1000);
      })
      .fail(function(msg) {
        console.log(msg);
        shortener.addClass('glow-red');
        setTimeout(function(){
          shortener.removeClass('glow-red');
        }, 1000);
      });
    }
  });
});
