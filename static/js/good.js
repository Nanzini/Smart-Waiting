"use strict";

var good = document.querySelector(".good");
var checkbox = document.querySelector("input");
var label = document.querySelector("label");
var numGood = label.querySelector("span");

function init() {
  /* 0. 로그인 된 상태일 때 local get해서 좋아요 색칠먼저 하기 */
  checkbox.addEventListener("change", ajaxGood);
  /* 로그인 된 상태라면 */

  if (document.querySelector(".email")) {
    var restaurant = location.pathname.slice(20, location.pathname.length);
    var email = document.querySelector(".email").innerText;

    if (localStorage.getItem("".concat(restaurant, ":").concat(email)) === "true") {
      checkbox.checked = true;
      label.querySelector("i").className = "fas fa-heart"; // numGood.innerText =Number(numGood.innerText)+ 1;
    } else if (localStorage.getItem("".concat(restaurant, ":").concat(email)) === "false") {
      checkbox.checked = false;
      label.querySelector("i").className = "far fa-heart"; // numGood.innerText =Number(numGood.innerText)- 1;
    }
  }
}
/* 1. 좋아요 누르면 Ajax통신하기 */


var ajaxGood = function ajaxGood() {
  /* 좋아요 눌렀을 때 */
  var email = document.querySelector(".email").innerText;

  if (checkbox.checked) {
    var data = {
      good: true,
      url: location.pathname.slice(20, location.pathname.length),
      numGood: Number(numGood.innerText),
      email: email
    };
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        label.querySelector("i").className = "fas fa-heart";
        numGood.innerText = Number(numGood.innerText) + 1;
        /* 로그인 된 userId */

        var key = "".concat(data.url, ":").concat(email);
        localStorage.setItem(key, true);
      }
    };

    xhttp.open("post", "/ajax/good", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(data));
  }
  /* 좋아요 해제 했을 때 */
  else {
      var _data = {
        good: false,
        url: location.pathname.slice(20, location.pathname.length),
        numGood: Number(numGood.innerText),
        email: email
      };

      var _xhttp = new XMLHttpRequest();

      _xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          label.querySelector("i").className = "far fa-heart";
          numGood.innerText = Number(numGood.innerText) - 1;
          var key = "".concat(_data.url, ":").concat(email);
          localStorage.setItem(key, false);
        }
      };

      _xhttp.open("post", "/ajax/good", true);

      _xhttp.setRequestHeader("Content-type", "application/json");

      _xhttp.send(JSON.stringify(_data));
    }
};

init();