"use strict";

var checkbox = document.querySelectorAll(".check_input");
var checkValue = ['korean', 'japanese', 'west', 'chinese', 'southAsia'];
var selectValue = document.getElementById("tags");
var searchInput = document.querySelector(".searchInput");

function init() {
  selectValue.addEventListener("change", function () {
    if (selectValue.value === '태그') {
      document.querySelector(".checkbox").style.display = "block";
      searchInput.style.display = "none";
    } else {
      document.querySelector(".checkbox").style.display = "none";
      searchInput.style.display = "block";
    }
  });
}

init();