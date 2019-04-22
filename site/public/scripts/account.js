//Functionality for the account page
"use strict";

addEventListener('load', start);
function start() {
  $("#pass_to_check").keyup(check_pass_strength);
  $(".delete_init").click(show_delete_flow)
  $(".submit_acc_changes").click(submit_acc_changes)
}

//Begins deletion flow
function show_delete_flow() {
  $(".confirm_delete").toggleClass("hidden");
}

//This will make changes to DB
function submit_acc_changes() {
  $(".email_success").removeClass("hidden");
  $(".pass_success").removeClass("hidden");

}
