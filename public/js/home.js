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
        // Glow some stuff
        shortener.addClass('glow-green');
        setTimeout(function(){
          shortener.removeClass('glow-green');
        }, 100);

        console.log(msg);

        // TODO: Store which proto in db

        // Update dom to match response
        $("#short-link").attr('href', 'http://' + msg.url + '/' + msg.tag)
          .text('http://' + msg.url + '/' + msg.tag);

        $("#tracking-data").attr('href', 'http://api.wrapulous.com/api/v0/links/' + msg.tag + '/events/')
          .text('http://api.wrapulous.com/api/v0/links/' + msg.tag + '/events/');

      })
      .fail(function(msg) {
        console.log(msg);
        // Glow some stuff
        shortener.addClass('glow-red');
        setTimeout(function(){
          shortener.removeClass('glow-red');
        }, 100);


      });
    }
  });
});
