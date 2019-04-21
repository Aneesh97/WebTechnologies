"use strict";
console.log("reg script starting");

addEventListener('load', start);
function start() {
  $("#register_password").keyup(check_pass_strength);
  $(".register").click(complete_registration);
}

//Check if password is longer than 8 chars
function check8long(password) {
  var strength = false;
  var arr = [ /.{8,}/ ];
  $.map(arr, function(regexp) {
    if(password.match(regexp)) {
      $(".8long").removeClass("text-muted").addClass("check_passed");
      strength = true;
    } else {
      $(".8long").removeClass("check_passed").addClass("text-muted");
    }
  });
  return strength;
}

//Check if password has one uppercase letter
function check1Upper(password) {
  var strength = false;
  var arr = [ /[A-Z]+/ ];
  $.map(arr, function(regexp) {
    if(password.match(regexp)) {
      $(".1Upper").removeClass("text-muted").addClass("check_passed");
      strength = true;
    } else {
      $(".1Upper").removeClass("check_passed").addClass("text-muted");
    }
  });
  return strength;
}

//Check if password has one lowercase letter
function check1Lower(password) {
  var strength = false;
  var arr = [ /[a-z]+/ ];
  $.map(arr, function(regexp) {
    if(password.match(regexp)) {
      $(".1Lower").removeClass("text-muted").addClass("check_passed");
      strength = true;
    } else {
      $(".1Lower").removeClass("check_passed").addClass("text-muted");
    }
  });
  return strength;
}

//Check if password has one number
function check1Number(password) {
  var strength = false;
  var arr = [ /[0-9]+/ ];
  $.map(arr, function(regexp) {
    if(password.match(regexp)) {
      $(".1Number").removeClass("text-muted").addClass("check_passed");
      strength = true;
    } else {
      $(".1Number").removeClass("check_passed").addClass("text-muted");
    }
  });
  return strength;
}

//Check password strength
function check_pass_strength() {
  var password = $("#register_password").val();
  var fullStrength = false;
  var eightLong = check8long(password);
  var oneUpper = check1Upper(password);
  var oneLower = check1Lower(password);
  var oneNum = check1Number(password);
  if ( eightLong && oneUpper && oneLower && oneNum ) {
    fullStrength = true;
  }
  return fullStrength;
}


//Register an account with email and password
function complete_registration() {
  var email = $("#register_email").val();
  var password = $("#register_password").val();
  var password2 = $("#repeat_password").val();
  var email_check = $("#email_check").prop("checked");
  var safe_check = $("safe_check").prop("checked");

  if (password == password2 && checkPassStrength(password) && email_check == true && safe_check == true) {
    //Clear fields
    $("#register_email").val('');
    $("#register_password").val('');
    $("#repeat_password").val('');

  } else {
    //Display error
  }
}
