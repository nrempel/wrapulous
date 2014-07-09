$(function () {

  var shortenerButton = $('#shortener-button');
  var shortenerLadda = $('#shortener-button').ladda();
  var shortenerInput = $('#shortener-input');

  var shortenUrl = function () {
    var url = shortenerInput.val();
    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: '/ajax/shorten_url/',
      data: JSON.stringify({destination: url})
    })
    .done(function(msg) {

      var body = msg.body;
      var apiKey = msg.apiKey;

      // Glow some stuff
      shortenerInput.addClass('glow-green');
      setTimeout(function(){
        shortenerInput.removeClass('glow-green');
      }, 100);

      // Update dom to match response
      $("#short-link-placeholder").remove();

      $("#short-link")
        .attr('href', 'http://' + body.url + '/' + body.tag)
        .attr('target', '_blank')
        .text('http://' + body.url + '/' + body.tag);

      $("#tracking-data")
        .attr(
          'href',
          'http://' +
            apiKey + ':@' + 'api.wrapulous.com/v0/links/' +
            body.tag + '/'
        )
        .attr('target', '_blank');

      $('#details').removeClass('details-hide');
      $('#details').removeClass('details-show');

    })
    .fail(function(msg) {
      // Glow some stuff
      $("#short-link-placeholder").text('Enter a valid link.');
      shortenerInput.addClass('glow-red');
      setTimeout(function(){
        shortenerInput.removeClass('glow-red');
      }, 100);
    })
    .always(function () {
      shortenerLadda.ladda('stop');
    });
  };

  // On button press
  shortenerButton.click(function () {
    shortenerLadda.ladda('start');
    shortenUrl();
  });

  // On enter press
  shortenerInput.keypress(function (event) {
    if (event.which == 13) {
      shortenerLadda.ladda('start');
      shortenUrl();
    }
  });
});
