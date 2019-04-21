"use strict";
console.log("personality script starting");

addEventListener('load', start);
function start() {
  // $("#register_password").keyup(check_pass_strength);
  // $(".register").click(complete_registration);
}


var r = [];
var current_question = 0;

//Save the results of the test to the database
function save_results(e_val, a_val, c_val, n_val, o_val) {
  var user_results = {
    e_val: e_val,
    a_val: a_val,
    c_val: c_val,
    n_val: n_val,
    o_val: o_val
  };
}

//Calulate the final results of the test
//Results between 0-40
function calculate_results() {
  var e_val = 20 + r[0] - r[5] + r[10] - r[15] + r[20] - r[25] + r[30] - r[35] + r[40] - r[45];
  var a_val = 14 - r[1] + r[6] - r[11] + r[16] - r[21] + r[26] - r[31] + r[36] + r[41] + r[46];
  var c_val = 14 + r[2] - r[7] + r[12] - r[17] + r[22] - r[27] + r[32] - r[37] + r[42] + r[47];
  var n_val = 38 - r[3] + r[8] - r[13] + r[18] - r[23] - r[28] - r[33] - r[38] - r[43] - r[48];
  var o_val = 8  + r[4] - r[9] + r[14] - r[19] + r[24] - r[29] + r[34] + r[39] + r[44] + r[49];

  console.log(e_val + " " + a_val + " " + c_val + " " + n_val + " " + o_val);
  save_results(e_val, a_val, c_val, n_val, o_val);
}

//Display the next question
function next_question() {
  if (current_question < 49) {
    current_question++;
    var new_question = questions[current_question];
    console.log(new_question);
    $('.question').text(new_question);
  } else {
    calculate_results();
    $(".test_interface").hide();
    $(".test_done").show();
  }
}

//Add in results to appropriate index
function add_result( value ) {
  r[current_question] = value;
}

//When begin test clicked
$(".make_initial").click(function() {
  $(".test_begin").show();
  $(".initial_goals").hide();
});

//When begin test clicked
$(".begin_test").click(function() {
  $(".test_interface").show();
  $(".test_begin").hide();
});

//When strongly disagree clicked
$(".dis_str").click(function() {
  add_result(1);
  next_question();
});

//When slightly disagree clicked
$(".dis_sli").click(function() {
  add_result(2);
  next_question();
});

//When neither clicked
$(".n_a_d").click(function() {
  add_result(3);
  next_question();
});

//When slightly agree clicked
$(".agr_sli").click(function() {
  add_result(4);
  next_question();
});

//When strongly agree clicked
$(".agr_str").click(function() {
  add_result(5);
  next_question();
});
