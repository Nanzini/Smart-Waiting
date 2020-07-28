"use strict";

var modalUserInfo = document.getElementById("modalUserInfo");
var btn_userInfo = document.getElementById("btn_userInfo");
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
  console.log(event.target.childNodes);
  event.target.childNodes[1].style.display = "block";
};

var showUserInfo = function showUserInfo() {
  modalUserInfo.style.display = "block";
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
  console.log(event.target.className);
  if (event.target.className === "modal_close") modal.style.display = "none";
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