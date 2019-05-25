//Functionality for the content page
"use strict";

addEventListener('load', start);
function start() {
  $('.nav_journey_link').addClass("active");
  $('.save_to_journal').click(save_entry);
}

function save_entry() {
  var window_url = window.location.pathname.split('/');
  var contentid = window_url[2];
  var prompt = $('.prompt').text();
  var thoughts = $('.content_thoughts').val();
  var journal_entry = {
    contentid: contentid,
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
