//Script for checking that the user password input conforms to requirements
"use strict";

//Check if the email is valid
function valid_email(email) {
  let regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if(!regex.test(email)) {
    return false;
  }else{
    return true;
  }
}

//Check if password is longer than 8 chars
function check_8_long(password) {
  let strength = false;
  let arr = [ /.{8,}/ ];
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
function check_1_upper(password) {
  let strength = false;
  let arr = [ /[A-Z]+/ ];
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
function check_1_lower(password) {
  let strength = false;
  let arr = [ /[a-z]+/ ];
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
function check_1_number(password) {
  let strength = false;
  let arr = [ /[0-9]+/ ];
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
  let password = htmlEncode( $("#pass_to_check").val() );
  let fullStrength = false;
  let eightLong = check_8_long(password);
  let oneUpper = check_1_upper(password);
  let oneLower = check_1_lower(password);
  let oneNum = check_1_number(password);
  if ( eightLong && oneUpper && oneLower && oneNum ) {
    fullStrength = true;
  }
  return fullStrength;
}
