/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


$(document).ready(function() {

  // renderTweets takes in an array of tweet objects and appends each one to the #tweet-container
  const renderTweets = function(tweets) {
    for (const tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      $('section.tweet-container').prepend($tweet);
    }
  };

  // escape function to prevent xss attacks
  const escape = function(str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  // creating tweets using html template
  const createTweetElement = function(tweetData) {
    const $tweet = $(`<article class="tweet"></article>`);

    const html = `
    <header>
            <img src=${tweetData.user.avatars}>
            <h3>${tweetData.user.name}</h3>
            <p>${tweetData.user.handle}</p>
          </header>
            <p id="content">${escape(tweetData.content.text)}</p>
          <footer>
            <p>${timeago.format(tweetData.created_at)}</p>
            <div>
              <i class='fa fa-flag'></i>
              <i class='fa fa-retweet'></i>
              <i class='fa fa-heart'></i>
            </div>
          </footer>
    `;
    $tweet.append(html);
    return $tweet;
  };

  //ajax request to load tweets from /tweets
  const loadTweets = function() {
    $.ajax('/tweets', { method: 'GET' })
      .then(function(tweets) {
        renderTweets(tweets);
      });
  };
  
  loadTweets();

  //error message when incorrectly composing a tweet
  const $newTweet = $('#tweet-form');

  $newTweet.on('submit', function(event) {
    $("#error-message").slideUp(); //slide up any current message
    event.preventDefault(); //prevent refresh

    if (!$newTweet.children('textarea').val()) { //if tweet is blank
      $("#error-message span").text('Tweet cannot be blank');
      $("#error-message").slideDown();
      return;
    }

    if ($newTweet.children('textarea').val().length > 140) { //if tweet exceeds 140 characters
      $("#error-message span").text('Tweet cannot exceed 140 characters');
      $("#error-message").slideDown();
      return;
    }

    //post request to create tweet from data
    const serializedData = $(event.target).serialize();
    $.ajax({url: '/tweets', method: 'POST', data: serializedData})
      .then(function() {
        return $.get('/tweets');
      })
      .then(function(response) {
        const latestTweet = [response[response.length - 1]];
        renderTweets(latestTweet);
      });
    $newTweet.trigger('reset');
  });

  // toggling the tweet container and focusing it
  const $rightHeader = $('#rightHeader');

  $rightHeader.on('click', function(event) {
    $('#new-tweet').slideToggle();
    $('#tweet-text').focus();
    event.preventDefault();
  });

  // scrolling to the top when clicking the button
  const $scrollTop = $('#scroll-top');

  $(window).scroll(function() {
    if ($(window).scrollTop() > 200) {
      $scrollTop.addClass('show');
    } else {
      $scrollTop.removeClass('show');
    }
  });

  $scrollTop.on('click', function(event) {
    event.preventDefault();
    $('html, body').animate({scrollTop:0}, '300');
    $('#new-tweet').slideDown();
    $('#tweet-text').focus();
  });

  //hiding the nav when scrolling down
  const $nav = $('nav');
  let prevScroll = window.pageYOffset;

  $(window).scroll(function() {
    let currentScroll = window.pageYOffset;
    if (prevScroll > currentScroll) {
      $nav.css('top', '0');
    } else {
      $nav.css('top','-120px');
    }
    prevScroll = currentScroll;
  });

});