"use strict";

var banner = document.querySelector(".banner");
var reservation = document.querySelector(".reservationMode");
var restaurant = document.querySelector(".restaurantMode");
var server = document.querySelector(".serverMode");
/* 가게등록할 때 form */

var file = document.getElementById("form_file");
var label_text = document.getElementById("label_text");
var label_img = document.getElementById("label_img");

var init = function init() {
  if (banner) banner.addEventListener("mouseover", changeBanner1);

  if (reservation) {
    reservation.addEventListener('mouseover', hover(reservation));
    restaurant.addEventListener("mouseover", hover(restaurant));
    server.addEventListener("mouseover", hover(server));
  }

  if (file) file.addEventListener("change", changedFile(file, label_text, label_img));
};

var changedFile = function changedFile(file, text, img) {
  return function () {
    text.innerHTML = file.value;
    img.style.background = "url(/uploads/OK.png) no-repeat 50%";
    img.style.backgroundSize = "30px";
    console.log(file);
  };
};

var changeBanner1 = function changeBanner1() {
  banner.style.backgroundImage = "url('/uploads/home_reservation.png')";
  banner.addEventListener("mouseout", changeBanner2);
};

var changeBanner2 = function changeBanner2() {
  banner.style.backgroundImage = "url('/uploads/home_banner.png')";
};

var hover = function hover(tmp) {
  return function () {
    tmp.style.filter = "blur(0)";
    tmp.style.transform = "scale(1.2)";
    tmp.childNodes[0].style.display = "block";
    tmp.addEventListener("mouseout", sndHover(tmp));
  };
};

var sndHover = function sndHover(tmp) {
  return function () {
    tmp.style.filter = "blur(5px)";
    tmp.style.transform = "scale(1)";
    tmp.childNodes[0].style.display = "none";
  };
};

init();