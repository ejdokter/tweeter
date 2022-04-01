//character counter for text area

$(document).ready(function() {
  $("#tweet-text").on("input", function() {
    const maxChar = 140;
    let tweetLength = $(this).val().length;
    let remaining = maxChar - tweetLength;
    $(".counter").text(remaining);

    if (remaining < 0) {
      $(".counter").css("color", "red");
    }
  });
});

