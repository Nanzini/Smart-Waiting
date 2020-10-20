// user
const modalUserInfo = document.getElementById("modalUserInfo");
const btn_userInfo = document.getElementById("btn_userInfo");
const userInput = document.querySelectorAll(".userInput");
const btn_delUser = document.querySelector(".btn_delUser");

// comment
const modalComment = document.getElementById("modalComment");
const btn_comment = document.getElementById("btn_comment");

// reservation
const modalReservation = document.getElementById("modalReservation");
const btn_reservation = document.getElementById("btn_reservation");

const modalRestaurant = document.getElementById("modalRestaurant");
const btn_restaurant = document.getElementById("btn_restaurant");

const modalMail = document.getElementById("modalMail");
const btn_mail = document.getElementById("btn_mail");

const modalClose = document.querySelectorAll(".modal_close");

/* mail */
const showMail = () => {
  modalMail.style.display = "block";
  const url = window.location.pathname;
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
    }
  };
  xhttp.open("post", "/ajax/userInfo_mail", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify({ url: url }));
  detailMail();
};

const removeMail = (event) => {
  const body = {
    id: event.target.parentElement.id,
  };
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById(body.id).remove();
    }
  };
  xhttp.open("post", "/ajax/removeMail", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(body));
};

const detailMail = () => {
  const everyMail = modalMail.querySelectorAll(".mailHead");
  const deleteMail = document.querySelectorAll(".deleteMail");
  everyMail.forEach(() => {
    addEventListener("mouseover", (event) => {
      if (event.target.childNodes[1] && event.target.className === "mailHead")
        event.target.childNodes[1].style.display = "block";
      else if (event.target && event.target.className === "deleteMail")
        event.target.style.display = "block";
      for (let i = 0; i < deleteMail.length; i++) {
        deleteMail[i].addEventListener("click", removeMail);
      }
    });
    addEventListener("mouseout", (event) => {
      if (event.target.childNodes[1] && event.target.className === "mailHead")
        event.target.childNodes[1].style.display = "none";
    });
    addEventListener("click", showDetailMail);
  });
};

const showDetailMail = (event) => {
  if (event.target.childNodes[2]) {
    const body = {
      id: event.target.id,
    };
    if (event.target.childNodes[2].className !== "mailHead")
      event.target.childNodes[2].style.display = "block";

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        event.target.style.backgroundColor = "white";
        if (document.querySelector(".absoluteChild")) {
          document.querySelector(".absoluteChild").innerText -= 1;
          if (document.querySelector(".absoluteChild").innerText === "0")
            document.querySelector(".absoluteChild").innerText = "";
        }
      }
    };
    xhttp.open("post", "/ajax/readMail", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(body));
  }
};

/* user */
const showUserInfo = () => {
  modalUserInfo.style.display = "block";
  editUserInfo();
  btn_delUser.addEventListener("click", deleteUser);
};

const deleteUser = () => {
  const body = { id: userInput[1].value };
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      location.href = "/login";
    }
  };
  xhttp.open("post", "/ajax/postDeleteUser", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(body));
};

const editUserInfo = () => {
  const btn_edit = userInput[0];
  btn_edit.addEventListener("click", () => {
    for (let i = 2; i < userInput.length; i++) userInput[i].disabled = false;
  });
  userInput[userInput.length - 1].addEventListener("click", postEditUserInfo);
};

const postEditUserInfo = () => {
  const body = {
    email: userInput[1].value,
    name: userInput[2].value,
    password: userInput[3].value,
    birthday: userInput[4].value,
  };
  const xhttp = new XMLHttpRequest();
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


/* comment */
const showUserComment = () => {
  modalComment.style.display = "block";
  if (btn_editComment) {
    for(let i=0; i<btn_editComment.length; i++){
      btn_editComment[i].addEventListener("click", editComment);
      btn_deleteComment[i].addEventListener("click", deleteComment);
    }
  }
};

const editComment = (event) => {

  let currentTarget;  // claaName comment 로 잡자
  if(event.target.tagName === "I")
    currentTarget = event.target.parentNode.parentNode.parentNode;
  
  else if(event.target.tagName === "SPAN")  currentTarget = event.target.parentNode.parentNode;
  // commentValue.disabled = false;
  currentTarget.childNodes[2].disabled = false;

  // 체크버튼 활성화
  currentTarget.childNodes[0].childNodes[2].style.opacity = "1";

  currentTarget.childNodes[0].childNodes[2].addEventListener("click",postEditComment(currentTarget))
};

const postEditComment = (currentTarget) => {
  return function(){
    // currentTarget : class = comment
  const id = currentTarget.childNodes[0].childNodes[0].id;
  const body = {
    id,
    content: currentTarget.childNodes[2].value,
  };
  console.log(body)
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
}
};

const deleteComment = (event) => {
  let currentTarget;  // icon으로 잡자
  if(event.target.tagName === "I")
    currentTarget = event.target.parentNode.parentNode;
  
  else if(event.target.tagName === "SPAN")  
    currentTarget = event.target.parentNode;
  const id = currentTarget.childNodes[0].id;
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

/* reservation */
const showUserReservation = () => {
  const everyReservation = document.querySelectorAll(".reservationHead");
  modalReservation.style.display = "block";
  everyReservation.forEach(() => {
    addEventListener("click", showUserDetailReservation);
  });
};

const showUserDetailReservation = (event) => {
  const btn_deleteReservation = document.querySelector(".deleteReservation");
  btn_deleteReservation.addEventListener("click", deleteReservation);
  if (event.target.childNodes[1])
    event.target.childNodes[1].style.display = "block";
};

const deleteReservation = (event) => {
  console.log(event.target.id);
  const body = {
    id: event.target.id,
    restaurant: document.querySelector(".restaurantID").id,
    reservationId: document.querySelector(".deleteReservation").id,
  };
  const xhttp = new XMLHttpRequest();
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

/* restaurant */
const showUserRestaurant = () => {
  const everyRestaurant = document.querySelectorAll(".restaurantHead");
  modalRestaurant.style.display = "block";
  everyRestaurant.forEach(() => {
    addEventListener("click", showUserDetailRestaurant);
  });
};

const showUserDetailRestaurant = (event) => {
  const btn_edit = document.querySelectorAll(".btn_editRestaurant");
  const btn_del = document.querySelectorAll(".btn_delRestaurant");
  const btn_editOK = document.querySelectorAll(".btn_editOK");
  const disabledInput = document.querySelectorAll(".restaurantDisabled");

  if (event.target.childNodes[1]) {event.target.childNodes[1].style.display = "block"; }

    for(let i = 0; i < btn_del.length; i++){
      const btn_form = document.getElementById(`form_file${i}`);
      btn_form.addEventListener("change",pic_changedFile(btn_form));

      btn_del[i].addEventListener("click", deleteRestaurant);
      btn_edit[i].addEventListener("click", () => {
      btn_editOK[i].style.display = "block";
      for (let i = 0; i < disabledInput.length; i++) 
      { disabledInput[i].disabled = false; }
    
  });
}
};

const pic_changedFile = (btn_form) => {
  return function(){
  btn_form.parentNode.childNodes[1].innerHTML = btn_form.value;
  btn_form.parentNode.childNodes[2].style.background = "url(/uploads/OK.png) no-repeat 50%";
  btn_form.parentNode.childNodes[2].style.backgroundSize = "30px";
  
  }
}

// const editRestaurant = (event) => {
//   // event target : submit 완료!
//   const form = event.target.parentNode;
//     const data = {
//       id : form.childNodes[0].id,
//       name : form.childNodes[2].value,
//       tag : form.childNodes[3].value,
//       location : form.childNodes[4].value,
//       pic : form.childNodes[5].childNodes[0].value
//     }
//     const xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function () {
//       if (this.readyState == 4 && this.status == 200) {
//         alert("수정되었습니다!");
//         location.reload(true);
//       }
//     };
//     xhttp.open("post", "/ajax/editRestaurant", true);
//     xhttp.setRequestHeader("Content-type", "application/json");
//     xhttp.send(JSON.stringify(data));
// }

const deleteRestaurant = (event) => {
  

  console.log(event.target)
  const body = {
    id: event.target.id,
  };
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      location.reload(true);
    }
  };
  xhttp.open("post", "/ajax/deleteRestaurant", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(body));

};

const close_modal = (event) => {
  if (event.target.parentElement)
    if (event.target.parentElement.parentElement) {
      const modal = event.target.parentElement.parentElement;
      if (event.target.className === "modal_close")
        modal.style.display = "none";
    }
};


const init = () => {
  btn_mail.addEventListener("click", showMail);
  btn_userInfo.addEventListener("click", showUserInfo);
  btn_comment.addEventListener("click", showUserComment);
  btn_reservation.addEventListener("click", showUserReservation);
  btn_restaurant.addEventListener("click", showUserRestaurant);
  modalClose.forEach(() => {
    addEventListener("click", close_modal);
  });
};
init();
