"use strict";

// user
var modalUserInfo = document.getElementById("modalUserInfo");
var btn_userInfo = document.getElementById("btn_userInfo");
var userInput = document.querySelectorAll(".userInput");
var btn_delUser = document.querySelector(".btn_delUser");
var modalComment = document.getElementById("modalComment");
var btn_comment = document.getElementById("btn_comment");
var modalReservation = document.getElementById("modalReservation");
var btn_reservation = document.getElementById("btn_reservation");
var modalRestaurant = document.getElementById("modalRestaurant");
var btn_restaurant = document.getElementById("btn_restaurant");
var modalMail = document.getElementById("modalMail");
var btn_mail = document.getElementById("btn_mail");
var modalClose = document.querySelectorAll(".modal_close");

var showMail = function showMail() {
  modalMail.style.display = "block";
  var url = window.location.pathname;
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("btn_mail").innerHTML = this.responseText;
      console.log(xhttp.responseText);
    }
  };

  xhttp.open("post", "/ajax/userInfo_mail", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify({
    url: url
  }));
  detailMail();
};

var detailMail = function detailMail() {
  var everyMail = modalMail.querySelectorAll(".mailHead");
  everyMail.forEach(function () {
    addEventListener("click", showDetailMail);
  });
};

var showDetailMail = function showDetailMail(event) {
  event.target.childNodes[1].style.display = "block";
};

var showUserInfo = function showUserInfo() {
  modalUserInfo.style.display = "block";
  editUserInfo();
  btn_delUser.addEventListener("click", deleteUser);
};

var deleteUser = function deleteUser() {
  var body = {
    id: userInput[1].value
  };
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      location.href = "/login";
    }
  };

  xhttp.open("post", "/ajax/postDeleteUser", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(body));
};

var showUserComment = function showUserComment() {
  modalComment.style.display = "block";
};

var showUserReservation = function showUserReservation() {
  modalReservation.style.display = "block";
};

var showUserRestaurant = function showUserRestaurant() {
  modalRestaurant.style.display = "block";
};

var close_modal = function close_modal(event) {
  var modal = event.target.parentElement.parentElement;
  if (event.target.className === "modal_close") modal.style.display = "none";
};

var editUserInfo = function editUserInfo() {
  var btn_edit = userInput[0];
  btn_edit.addEventListener("click", function () {
    for (var i = 2; i < userInput.length; i++) {
      userInput[i].disabled = false;
    }
  });
  userInput[userInput.length - 1].addEventListener("click", postEditUserInfo);
};

var postEditUserInfo = function postEditUserInfo() {
  var body = {
    email: userInput[1].value,
    name: userInput[2].value,
    password: userInput[3].value,
    birthday: userInput[4].value
  };
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      alert("수정완료!");
      location.reload(true);
    }
  };

  xhttp.open("post", "/ajax/userInfo_postEditUserInfo", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(body));
};

var init = function init() {
  btn_mail.addEventListener("click", showMail);
  btn_userInfo.addEventListener("click", showUserInfo);
  btn_comment.addEventListener("click", showUserComment);
  btn_reservation.addEventListener("click", showUserReservation);
  btn_restaurant.addEventListener("click", showUserRestaurant);
  modalClose.forEach(function () {
    addEventListener("click", close_modal);
  });
};

init();