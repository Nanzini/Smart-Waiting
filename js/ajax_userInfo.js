const modalUserInfo = document.getElementById("modalUserInfo");
const btn_userInfo = document.getElementById("btn_userInfo");

const modalComment = document.getElementById("modalComment");
const btn_comment = document.getElementById("btn_comment");

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
      document.getElementById("btn_mail").innerHTML = this.responseText;
      console.log(xhttp.responseText);
    }
  };
  xhttp.open("post", "/ajax/userInfo_mail", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify({ url: url }));
  detailMail();
};

const detailMail = () => {
  const everyMail = modalMail.querySelectorAll(".mailHead");
  everyMail.forEach(() => {
    addEventListener("click", showDetailMail);
  });
};

const showDetailMail = (event) => {
  console.log(event.target.childNodes);
  event.target.childNodes[1].style.display = "block";
};

const showUserInfo = () => {
  modalUserInfo.style.display = "block";
};

const showUserComment = () => {
  modalComment.style.display = "block";
};

const showUserReservation = () => {
  modalReservation.style.display = "block";
};

const showUserRestaurant = () => {
  modalRestaurant.style.display = "block";
};

const close_modal = (event) => {
  const modal = event.target.parentElement.parentElement;
  console.log(event.target.className);
  if (event.target.className === "modal_close") modal.style.display = "none";
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
