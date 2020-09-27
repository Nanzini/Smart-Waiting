"use strict";

var btn_editComment = document.querySelector(".editComment");
var btn_deleteComment = document.querySelector(".deleteComment");
var content = document.querySelector(".comment");
var commentValue = document.querySelector(".commentValue");

var editComment = function editComment() {
  var btn_editCompleted = document.querySelector(".editCompleted");
  commentValue.disabled = false;
  content.childNodes[2].disabled = false;
  btn_editCompleted.style.display = "block";
  btn_editCompleted.addEventListener("click", postEditComment);
};

var postEditComment = function postEditComment() {
  var id = btn_editComment.id;
  var body = {
    id: id,
    content: commentValue.value
  };
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

var deleteComment = function deleteComment() {
  var id = btn_editComment.id;
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
    btn_editComment.addEventListener("click", editComment);
    btn_deleteComment.addEventListener("click", deleteComment);
  }
};

init();