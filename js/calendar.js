// 완료
const btn_reservePopup = document.getElementById("btn_reserve");
const popup = document.getElementById("calendar");

// 헤더
const header_year = document.getElementById("header_year");
const header_month = document.getElementById("header_month");
const btn_left = document.getElementById("btn_left");
const btn_right = document.getElementById("btn_right");

// 모달
const modalClose = document.querySelectorAll(".modal_close");

// 변수부분
const monthDate = [
  31,
  function (year) {
    if (year % 4) return 28;
    else return 29;
  },
  31,
  30,
  31,
  30,
  31,
  31,
  30,
  31,
  30,
  31,
];

let now = new Date();
let year = now.getFullYear();
let month = now.getMonth(); // 0 : 1월, 11 : 12월
let day = now.getDay(); // 0 : 일요일, 6 : 토요일
let date = now.getDate();

// ////////////////////////////////// 메서드부분
const display_popup = () => {
  // 오늘 날짜에 해당하는 달력불러오기!
  // btn_modalExit.addEventListener("click", () => {
  //   popup.style.display = "none";
  // });
  display_header(year, month + 1);
  draw_calendar(year, month, new Date(year, month, 1).getDay());
};

const color_todayCalendar = (...argu) => {
  if (argu.length === 1)
    document.getElementById(day).style.backgroundColor = "#6495ed";
  else document.getElementById(date + day).style.backgroundColor = "#6495ed";
};

const draw_calendar = (year, month, day) => {
  // day : 0일 1월 2화 3수...
  const date = month === 1 ? monthDate[month](year) : monthDate[month]; // 몇일 까지 있을까?

  for (let i = 0; i < date; i++) {
    document.getElementById(day + i).innerText = i + 1;
    document
      .getElementById(day + i)
      .addEventListener("click", ajax_click_calendar);
  }
};

const clear_calendar = () => {
  for (let i = 0; i < 37; i++) {
    document.getElementById(i).innerText = null;
    document
      .getElementById(i)
      .removeEventListener("click", ajax_click_calendar);
  }
};
const display_header = (year, month) => {
  header_year.innerHTML = year;
  header_month.innerHTML = month;
};

const month_right = () => {
  return_month_right();
  display_header(year, month + 1);
  clear_calendar();
  draw_calendar(year, month, new Date(year, month, 1).getDay());
};

const return_month_right = () => {
  if (month === 11) {
    year += 1;
    month = 0;
    return 0;
  }
  month += 1;
};

const month_left = () => {
  return_month_left();
  display_header(year, month + 1);
  clear_calendar();
  draw_calendar(year, month, new Date(year, month, 1).getDay());
};

const return_month_left = () => {
  if (month === 0) {
    year -= 1;
    month = 11;
    return 0;
  }
  month -= 1;
};

// AJAX FUNCTION
// 달력클릭하면 해당 날짜 서버에 전송하고 테이블데이터
const ajax_click_calendar = (event) => {
  const click = clickDate(event);
  const send = sendDate(click.year, click.month, click.date);
  console.log("AJAX CLICK CALENDAR 최종적으로 보낼 데이터");
  console.log(send);
  const date = JSON.stringify(send);

  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      // 디비 테이블데이터& 예약데이터 가져오기
      console.log(xhttp.responseText);
    }
  };

  xhttp.open("post", "/ajax/getReservation", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(date);
};

const sendDate = (year, month, date) => {
  const sendDate = {
    url: window.location.pathname,
    year: year,
    month: month + 1 < 10 ? `0${month}` : month,
    date: date < 10 ? `0${date}` : date,
  };
  return sendDate;
};

const clickDate = (event) => {
  const clickDate = {
    year: year,
    month: month + 1,
    date: event.target.innerHTML,
  };
  year = clickDate.year;
  month = clickDate.month;
  date = clickDate.date;
  return clickDate;
};

// 예약시간 클릭해서 확인눌러서 서버로 데이터보내기
const ajax_click_reserveTime = (time) => {
  const modal = document.getElementById(`modal${time}`);
  open_modal(modal);
  modalClose.forEach(() => {
    addEventListener("click", close_modal);
  });
  const sendReservation = document.getElementById(`sendReservation${time}`);
  sendReservation.addEventListener("click", ajax_send_reservationData);
};

// OK버튼 누르면 서버로 데이터 전송
const ajax_send_reservationData = (event) => {
  const modalParent = event.target.parentElement.parentElement;
  const modalContent = modalParent.querySelector(".modal-content");
  const send = sendDate(year, month, date);

  const time = event.target.parentElement.parentElement.id.slice(5, 7);

  const reservationForm = {
    name: modalContent.childNodes[2].value,
    guests: modalContent.childNodes[3].value,
    restaurant: modalContent.childNodes[4].value,
    date: Number(`${send.year}${send.month}${send.date}${time}`),
  };
  const data = JSON.stringify(reservationForm);
  console.log(data);

  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      console.log(xhttp.responseText);
      const res = JSON.parse(xhttp.responseText);
      console.log(res);
      if (!res.user) {
        alert(`로그인이 필요합니다`);
        window.location.href = `http://localhost:4001${res.url}`;
      } else {
        alert(`예약성공!`);
        window.location.href = "http://localhost:4001";
      }
      console.log("뭐지");
    }
  };

  xhttp.open("post", "/ajax/postReservation", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(data);
};

const open_modal = (modal) => {
  modal.style.display = "block";
};

const close_modal = (event) => {
  const modal = event.target.parentElement.parentElement;
  console.log(event.target.className);
  if (event.target.className === "modal_close") modal.style.display = "none";
};

const init = () => {
  // btn_reservePopup.addEventListener("click", display_popup);
  display_popup();
  btn_right.addEventListener("click", month_right);
  btn_left.addEventListener("click", month_left);
};

init();
