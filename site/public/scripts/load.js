//General purpose functionality that is used by many pages
"use strict";
addEventListener('load', start);
function start() {
  $("body").removeClass("hidden");
}

//Functions to ensure safe handling of user input strings
function htmlEncode(value){
  return $('<div/>').text(value).html();
}
function htmlDecode(value){
  return $('<div/>').html(value).text();
}
