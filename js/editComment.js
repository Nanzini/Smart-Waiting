const btn_editComment = document.querySelector(".editComment");
const btn_deleteComment = document.querySelector(".deleteComment");
const content = document.querySelector(".comment");
const commentValue = document.querySelector(".commentValue");

const editComment = () => {
  const btn_editCompleted = document.querySelector(".editCompleted");

  commentValue.disabled = false;
  content.childNodes[2].disabled = false;
  btn_editCompleted.style.display = "block";
  btn_editCompleted.addEventListener("click", postEditComment);
};

const postEditComment = () => {
  const id = btn_editComment.id;
  const body = {
    id,
    content: commentValue.value,
  };
  const xhttp = new XMLHttpRequest();
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

const deleteComment = () => {
  const id = btn_editComment.id;
  const body = { id };
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      location.reload(true);
    }
  };
  xhttp.open("post", "/ajax/postDeleteComment", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(body));
};

const init = () => {
  if (btn_editComment) {
    btn_editComment.addEventListener("click", editComment);
    btn_deleteComment.addEventListener("click", deleteComment);
  }
};
init();
