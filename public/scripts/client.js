/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// const data = [
//   {
//     "user": {
//       "name": "Newton",
//       "avatars": "https://i.imgur.com/73hZDYK.png"
//       ,
//       "handle": "@SirIsaac"
//     },
//     "content": {
//       "text": "If I have seen further it is by standing on the shoulders of giants"
//     },
//     "created_at": 1461116232227
//   },
//   {
//     "user": {
//       "name": "Descartes",
//       "avatars": "https://i.imgur.com/nlhLi3I.png",
//       "handle": "@rd" },
//     "content": {
//       "text": "Je pense , donc je suis"
//     },
//     "created_at": 1461113959088
//   }
// ]

$(document).ready(function() {

  const renderTweets = function(tweets) {
    for (const tweet of tweets) {
      const $tweet = createTweetElement(tweet)
      $('section.tweet-container').prepend($tweet)
    }
  }

  const escape = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  const createTweetElement = function(tweetData) {
    const $tweet = $(`<article class="tweet"></article>`)

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
    `
    $tweet.append(html)
    return $tweet
  }


  const $newTweet = $('#new-tweet');

  $newTweet.on('submit', function(event) {
    $("#error-message").slideUp()
    event.preventDefault();
    console.log('new tweet created');

    if(!$newTweet.children('textarea').val()) {
      $("#error-message span").text('Tweet cannot be blank')
      $("#error-message").slideDown()
    } else if ($newTweet.children('textarea').val().length > 140) {
      $("#error-message span").text('Tweet cannot exceed 140 characters')
      $("#error-message").slideDown()
    } else {

        const serializedData = $(event.target).serialize()

        $.post('/tweets', serializedData, response => {
          console.log(response)
          loadTweets()
        })
      }
  })

  const loadTweets = function () {
    $.ajax('/tweets', { method: 'GET' })
    .then(function(tweets) {
      renderTweets(tweets)
    })
  }

  loadTweets()

})