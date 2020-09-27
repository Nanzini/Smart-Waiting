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

const showUserComment = () => {
  modalComment.style.display = "block";
};

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

const showUserRestaurant = () => {
  const everyRestaurant = document.querySelectorAll(".restaurantHead");
  modalRestaurant.style.display = "block";
  everyRestaurant.forEach(() => {
    addEventListener("click", showUserDetailRestaurant);
  });
};

const showUserDetailRestaurant = (event) => {
  const btn_edit = document.querySelector(".btn_editRestaurant");
  const btn_del = document.querySelector(".btn_delRestaurant");
  const btn_editOK = document.querySelector(".btn_editOK");
  const disabledInput = document.querySelectorAll(".restaurantDisabled");

  if (event.target.childNodes[1])
    event.target.childNodes[1].style.display = "block";

  btn_del.addEventListener("click", deleteRestaurant);
  btn_edit.addEventListener("click", () => {
    btn_editOK.style.display = "block";
    for (let i = 0; i < disabledInput.length; i++)
      disabledInput[i].disabled = false;
    btn_editOK.addEventListener("click", editRestaurant);
  });
};

const deleteRestaurant = () => {
  const body = {
    id: document.querySelector(".btn_delRestaurant").id,
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
