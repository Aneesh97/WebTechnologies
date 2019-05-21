//Functionality for the results page
"use strict";

addEventListener('load', start);
function start() {
  $('.nav_results_link').addClass("active");
  $(".ext").hover(toggle_ext);
  $(".agr").hover(toggle_agr);
  $(".con").hover(toggle_con);
  $(".neu").hover(toggle_neu);
  $(".ope").hover(toggle_ope);
}

//Open collapsible on hover
function toggle_ext() {
  $('#ext_collapse').collapse('toggle');
}
function toggle_agr() {
  $('#agr_collapse').collapse('toggle');
}
function toggle_con() {
  $('#con_collapse').collapse('toggle');
}
function toggle_neu() {
  $('#neu_collapse').collapse('toggle');
}
function toggle_ope() {
  $('#ope_collapse').collapse('toggle');
}
