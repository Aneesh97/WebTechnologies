//Functionality for the content page
"use strict";

addEventListener('load', start);
function start() {
  $('.nav_journey_link').addClass("active");
  $('.save_to_journal').click(save_entry);
}

function save_entry() {
  var content_url = $('.video_content').attr('src');
  var prompt = $('.prompt').text();
  var thoughts = $('.content_thoughts').val();
  var journal_entry = {
    content_url: content_url,
    prompt: prompt,
    thoughts: thoughts
  }
  const url = '/journal';
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      window.location = xhr.responseURL;
    }
  }
  xhr.open("POST", url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(journal_entry));
}
