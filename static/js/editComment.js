"use strict";

var btn_editComment = document.querySelectorAll(".editComment");
var btn_deleteComment = document.querySelectorAll(".deleteComment");
var btn_editCompleted = document.querySelectorAll(".editCompleted");
/* hover effect */

var img = document.querySelector(".restaurantImg");

var editComment = function editComment(event) {
  var currentTarget; // claaName comment 로 잡자

  if (event.target.tagName === "I") currentTarget = event.target.parentNode.parentNode.parentNode;else if (event.target.tagName === "SPAN") currentTarget = event.target.parentNode.parentNode; // commentValue.disabled = false;

  currentTarget.childNodes[2].disabled = false; // 체크버튼 활성화

  currentTarget.childNodes[0].childNodes[2].style.opacity = "1";
  currentTarget.childNodes[0].childNodes[2].addEventListener("click", postEditComment(currentTarget));
};

var postEditComment = function postEditComment(currentTarget) {
  return function () {
    // currentTarget : class = comment
    var id = currentTarget.childNodes[0].childNodes[0].id;
    var body = {
      id: id,
      content: currentTarget.childNodes[2].value
    };
    console.log(body);
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        alert("수정완료!");
        location.reload(true);
      }
    };

    xhttp.open("post", "/ajax/postEditComment", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(body));
  };
};

var deleteComment = function deleteComment(event) {
  var currentTarget; // icon으로 잡자

  if (event.target.tagName === "I") currentTarget = event.target.parentNode.parentNode;else if (event.target.tagName === "SPAN") currentTarget = event.target.parentNode;
  var id = currentTarget.childNodes[0].id;
  var body = {
    id: id
  };
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      location.reload(true);
    }
  };

  xhttp.open("post", "/ajax/postDeleteComment", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(body));
};

var init = function init() {
  if (btn_editComment) {
    for (var i = 0; i < btn_editComment.length; i++) {
      btn_editComment[i].addEventListener("click", editComment);
      btn_deleteComment[i].addEventListener("click", deleteComment);
    }
  }

  if (img) {
    var original = "/uploads/".concat(img.id);
    img.style.background = "url(".concat(original, ") no-repeat ");
    img.style.backgroundSize = "400px 500px";
    img.addEventListener("mouseover", function () {
      img.style.background = 'url(/uploads/go.png) no-repeat center';
      img.style.backgroundSize = "200px 250px";
    });
    img.addEventListener("mouseout", function () {
      img.style.background = "url(".concat(original, ") no-repeat ");
      img.style.backgroundSize = "400px 500px";
    });
  }
};

init();