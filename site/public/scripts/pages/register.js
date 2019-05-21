//Functionality for the register page
"use strict";

addEventListener('load', start);
function start() {
  $("#pass_to_check").keyup(check_pass_strength);
  
}
