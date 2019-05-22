//Functionality for the account page
"use strict";

addEventListener('load', start);
function start() {
  $("#pass_to_check").keyup(check_pass_strength);
  $(".delete_init").click(show_delete_flow)
  $('.nav_account_link').addClass("active");
  $(".submit_acc_changes").click(submit_acc_changes);
  $(".final_delete_button").click(delete_account);

}

//Begins deletion flow
function show_delete_flow() {
  $(".confirm_delete").toggleClass("hidden");
}

//Submit account changes to database
function submit_acc_changes() {
  let data = {
    new_username: $('.new_username').val(),
    new_email: $('.new_email').val(),
    new_password: $('.new_password').val(),
    password: $('.password').val()
  }
  const url = "/account";
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      window.location = xhr.responseURL;
    }
  }
  xhr.open("PUT", url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(data));
}

//Submit account changes to database
function delete_account() {
  let data = {
    password: $('.del_password').val()
  }
  const url = "/account";
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      window.location = xhr.responseURL;
    }
  }
  xhr.open("DELETE", url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(data));
}
