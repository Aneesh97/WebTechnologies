//Functionality for the register page
"use strict";

addEventListener('load', start);
function start() {
  $("#pass_to_check").keyup(check_pass_strength);
  $(".register").click(complete_registration);
}

//Register an account with email and password
function complete_registration() {
  let email = htmlEncode( $("#register_email").val() );
  let password = htmlEncode( $("#pass_to_check").val() );
  let password2 = htmlEncode( $("#repeat_password").val() );

  if (password == password2 && check_pass_strength(password) && valid_email(email)) {
    //Clear fields
    $("#register_email").val('');
    $("#pass_to_check").val('');
    $("#repeat_password").val('');

  } else {
    //Display error
  }
}
