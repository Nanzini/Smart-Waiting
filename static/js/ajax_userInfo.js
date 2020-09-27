"use strict";

// user
var modalUserInfo = document.getElementById("modalUserInfo");
var btn_userInfo = document.getElementById("btn_userInfo");
var userInput = document.querySelectorAll(".userInput");
var btn_delUser = document.querySelector(".btn_delUser"); // comment

var modalComment = document.getElementById("modalComment");
var btn_comment = document.getElementById("btn_comment"); // reservation

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
    if (this.readyState == 4 && this.status == 200) {}
  };

  xhttp.open("post", "/ajax/userInfo_mail", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify({
    url: url
  }));
  detailMail();
};

var removeMail = function removeMail(event) {
  var body = {
    id: event.target.parentElement.id
  };
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById(body.id).remove();
    }
  };

  xhttp.open("post", "/ajax/removeMail", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(body));
};

var detailMail = function detailMail() {
  var everyMail = modalMail.querySelectorAll(".mailHead");
  var deleteMail = document.querySelectorAll(".deleteMail");
  everyMail.forEach(function () {
    addEventListener("mouseover", function (event) {
      if (event.target.childNodes[1] && event.target.className === "mailHead") event.target.childNodes[1].style.display = "block";else if (event.target && event.target.className === "deleteMail") event.target.style.display = "block";

      for (var i = 0; i < deleteMail.length; i++) {
        deleteMail[i].addEventListener("click", removeMail);
      }
    });
    addEventListener("mouseout", function (event) {
      if (event.target.childNodes[1] && event.target.className === "mailHead") event.target.childNodes[1].style.display = "none";
    });
    addEventListener("click", showDetailMail);
  });
};

var showDetailMail = function showDetailMail(event) {
  if (event.target.childNodes[2]) {
    var body = {
      id: event.target.id
    };
    if (event.target.childNodes[2].className !== "mailHead") event.target.childNodes[2].style.display = "block";
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        event.target.style.backgroundColor = "white";

        if (document.querySelector(".absoluteChild")) {
          document.querySelector(".absoluteChild").innerText -= 1;
          if (document.querySelector(".absoluteChild").innerText === "0") document.querySelector(".absoluteChild").innerText = "";
        }
      }
    };

    xhttp.open("post", "/ajax/readMail", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(body));
  }
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
  var everyReservation = document.querySelectorAll(".reservationHead");
  modalReservation.style.display = "block";
  everyReservation.forEach(function () {
    addEventListener("click", showUserDetailReservation);
  });
};

var showUserDetailReservation = function showUserDetailReservation(event) {
  var btn_deleteReservation = document.querySelector(".deleteReservation");
  btn_deleteReservation.addEventListener("click", deleteReservation);
  if (event.target.childNodes[1]) event.target.childNodes[1].style.display = "block";
};

var deleteReservation = function deleteReservation(event) {
  console.log(event.target.id);
  var body = {
    id: event.target.id,
    restaurant: document.querySelector(".restaurantID").id,
    reservationId: document.querySelector(".deleteReservation").id
  };
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      alert("삭제되었습니다!");
      location.reload(true);
    }
  };

  xhttp.open("post", "/ajax/deleteReservation", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(body));
};

var showUserRestaurant = function showUserRestaurant() {
  var everyRestaurant = document.querySelectorAll(".restaurantHead");
  modalRestaurant.style.display = "block";
  everyRestaurant.forEach(function () {
    addEventListener("click", showUserDetailRestaurant);
  });
};

var showUserDetailRestaurant = function showUserDetailRestaurant(event) {
  var btn_edit = document.querySelector(".btn_editRestaurant");
  var btn_del = document.querySelector(".btn_delRestaurant");
  var btn_editOK = document.querySelector(".btn_editOK");
  var disabledInput = document.querySelectorAll(".restaurantDisabled");
  if (event.target.childNodes[1]) event.target.childNodes[1].style.display = "block";
  btn_del.addEventListener("click", deleteRestaurant);
  btn_edit.addEventListener("click", function () {
    btn_editOK.style.display = "block";

    for (var i = 0; i < disabledInput.length; i++) {
      disabledInput[i].disabled = false;
    }

    btn_editOK.addEventListener("click", editRestaurant);
  });
};

var deleteRestaurant = function deleteRestaurant() {
  var body = {
    id: document.querySelector(".btn_delRestaurant").id
  };
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      location.reload(true);
    }
  };

  xhttp.open("post", "/ajax/deleteRestaurant", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(body));
};

var close_modal = function close_modal(event) {
  if (event.target.parentElement) if (event.target.parentElement.parentElement) {
    var modal = event.target.parentElement.parentElement;
    if (event.target.className === "modal_close") modal.style.display = "none";
  }
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