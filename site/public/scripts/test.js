"use strict";
console.log("script starting");

addEventListener('load', start);
function start() {
  var button = document.querySelector('#x');
  button.onclick = fetch_data;
}

function fetch_data() {
  var q = new XMLHttpRequest();
  q.onreadystatechange = receive;
  q.open("GET", "/data", true);
  q.send;
}

function receive() {
  if (this.readyState != XMLHttpRequest.DONE) return;
  var list = JSON.parse(this.responseText);
  var html = "<li>" + ...;
  var ul = document.querySelector("#contentList");
  ul.innerHMTL = html;

}
