//Functionality for the personality test page
"use strict";

console.log("personality script starting");
//Global variables for text functionality
let q_index = 0;
let r = new Array();

//Function called on loading of page
addEventListener('load', start);
function start() {
  $('.nav_results_link').addClass("active");
  $(".make_initial").click(submit_goals);
  $(".begin_test").click(begin_test);
  $(".dis_str").click(1, add_result);
  $(".dis_sli").click(2, add_result);
  $(".n_a_d").click(3, add_result);
  $(".agr_sli").click(4, add_result);
  $(".agr_str").click(5, add_result);
}

//Save the results of the test to the database
function save_results(e_val, a_val, c_val, n_val, o_val) {
  let user_results = {
    e_val: e_val,
    a_val: a_val,
    c_val: c_val,
    n_val: n_val,
    o_val: o_val
  };
  //Get working with DB
  const url = "/test";
  var xhr = new XMLHttpRequest();
  xhr.open("PUT", url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(user_results));
}

//Calulate the final results of the test
//Results between 0-40
function calculate_results() {
  let e_val = 20 + r[0] - r[5] + r[10] - r[15] + r[20] - r[25] + r[30] - r[35] + r[40] - r[45];
  let a_val = 14 - r[1] + r[6] - r[11] + r[16] - r[21] + r[26] - r[31] + r[36] + r[41] + r[46];
  let c_val = 14 + r[2] - r[7] + r[12] - r[17] + r[22] - r[27] + r[32] - r[37] + r[42] + r[47];
  let n_val = 38 - r[3] + r[8] - r[13] + r[18] - r[23] - r[28] - r[33] - r[38] - r[43] - r[48];
  let o_val = 8  + r[4] - r[9] + r[14] - r[19] + r[24] - r[29] + r[34] + r[39] + r[44] + r[49];

  o_val = Math.round((o_val/40)*100);
  c_val = Math.round((c_val/40)*100);
  e_val = Math.round((e_val/40)*100);
  a_val = Math.round((a_val/40)*100);
  n_val = Math.round((n_val/40)*100);

  console.log(e_val + " " + a_val + " " + c_val + " " + n_val + " " + o_val);

  save_results(e_val, a_val, c_val, n_val, o_val);
}

//Display the next question
function next_question() {
  if (q_index < 49) {
    q_index++;
    let new_question = questions[q_index];
    console.log(new_question);
    $('.question').text(new_question);
  } else {
    calculate_results();
    $(".test_interface").addClass("hidden");
    $(".test_done").removeClass("hidden");
  }
}

//Add in results to appropriate index
function add_result( value ) {
  r.push(value.data);
  next_question();
}

//When begin test clicked
function submit_goals() {
  $(".test_begin").removeClass("hidden");
  $(".initial_goals").addClass("hidden");
}

//When begin test clicked
function begin_test() {
  $(".test_interface").removeClass("hidden");
  $(".test_begin").addClass("hidden");
}
