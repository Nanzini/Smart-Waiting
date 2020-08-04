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
let hour = now.getHours();
// ////////////////////////////////// 메서드부분
const display_popup = () => {
  // 오늘 날짜에 해당하는 달력불러오기!
  // btn_modalExit.addEventListener("click", () => {
  //   popup.style.display = "none";
  // });
  display_header(year, month + 1);
  draw_calendar(year, month, new Date(year, month, 1).getDay(), date);
  block_time();
};

const color_todayCalendar = () => {
  // 하나만 색칠하기
  const clickDate = event.target.id;
  const clickedElement = document.getElementById(clickDate);
  for (let i = 0; i < 36; i++)
    document.getElementById(i).style.backgroundColor = "white";
  if (clickedElement.style.color !== "gray")
    clickedElement.style.backgroundColor = "#6495ed";
};

const block_calendar = (maxDate, day, currentDate) => {
  const currentMonth = new Date().getMonth();
  for (let i = 0; i < maxDate; i++) {
    const realDay = day + i;
    document.getElementById(realDay).innerText = i + 1;

    // 현재
    if (currentMonth === month) {
      if (currentDate + day - 1 <= realDay) {
        document
          .getElementById(realDay)
          .addEventListener("click", ajax_click_calendar);
        document
          .getElementById(realDay)
          .addEventListener("click", color_todayCalendar);
      } else document.getElementById(realDay).style.color = "gray";
    } else if (currentMonth < month) {
      document
        .getElementById(realDay)
        .addEventListener("click", ajax_click_calendar);
      document
        .getElementById(realDay)
        .addEventListener("click", color_todayCalendar);
      document.getElementById(realDay).style.color = "black";
    } else document.getElementById(realDay).style.color = "gray";
  }
};

const block_time = () => {
  const currentMonth = now.getMonth();
  const currentDate = now.getDate();
  for (let i = 0; i < 13; i += 2) {
    const time = document.querySelector(".reserveList").childNodes[i];
    if (
      currentMonth === month &&
      currentDate === Number(date) &&
      hour > time.name
    )
      time.disabled = true;
    else time.disabled = false;
  }
};

const draw_calendar = (year, month1, day, date) => {
  // day : 0일 1월 2화 3수...
  // month1은 현재 or 지날달 or 다음달이 될 수 있다.

  const maxDate = month1 === 1 ? monthDate[month1](year) : monthDate[month1]; // 몇일 까지 있을까?
  const currentDate = new Date().getDate();
  const currentMonth = now.getMonth();

  // 회색표시
  block_calendar(maxDate, new Date(year, month1, 1).getDay(), currentDate);

  // 달력 다음달 이번달 전달 해당날짜 칠하기
  if (month1 > currentMonth)
    document.getElementById(date + day - 1).style.backgroundColor = "#6495ed";
  if (month1 === currentMonth)
    document.getElementById(date + day - 1).style.backgroundColor = "#6495ed";
};

const clear_calendar = () => {
  for (let i = 0; i < 37; i++) {
    document.getElementById(i).innerText = null;
    document
      .getElementById(i)
      .removeEventListener("click", ajax_click_calendar);
    document.getElementById(i).style.backgroundColor = "white";
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
  draw_calendar(year, month, new Date(year, month, 1).getDay(), 1);
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
  const getDate = month === 1 ? monthDate[month](year) : monthDate[month];
  draw_calendar(year, month, new Date(year, month, 1).getDay(), getDate);
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
  const currentMonth = now.getMonth();
  const currentDate = now.getDate();

  console.log("AJAX CLICK CALENDAR 최종적으로 보낼 데이터");
  console.log(send);

  // 예약타임 블락하기
  block_time();

  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      // 디비 테이블데이터& 예약데이터 가져오기
      console.log(xhttp.responseText);
    }
  };

  xhttp.open("post", "/ajax/getReservation", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(send));
};

// 예약시간 클릭해서 확인눌러서 서버로 데이터보내기
// 예약가능인원 보여주기
const ajax_click_reserveTime = (time) => {
  const modal = document.getElementById(`modal${time}`);
  const reservedPeople = modal.childNodes[0].querySelector("h2");
  const reservePeople = modal.childNodes[0].childNodes[4].value;
  open_modal(modal);
  modalClose.forEach(() => {
    addEventListener("click", close_modal);
  });
  const sendReservation = document.getElementById(`sendReservation${time}`);
  if (reservedPeople > reservePeople)
    sendReservation.addEventListener("click", ajax_send_reservationData);

  const send = sendDate(year, month, date, time);
  console.log(send);

  // 데이터 잘나오고~ 이제 서버로 보내자
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      // 디비 예약데이터 가져오기

      reservedPeople.innerHTML = xhttp.responseText;
    }
  };

  xhttp.open("post", "/ajax/getReservation", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(send));
};

// OK버튼 누르면 서버로 데이터 전송
// 예약인원 꽉찼을때 OK누르면 예외처리해야한다
const ajax_send_reservationData = (event) => {
  const modalParent = event.target.parentElement.parentElement;
  const modalContent = modalParent.querySelector(".modal-content");
  const time = event.target.parentElement.parentElement.id.slice(5, 7);
  const reservedPeople = modalContent.querySelector("h2");
  const send = sendDate(year, month, date, time);
  const reservationForm = {
    name: modalContent.childNodes[3].value,
    guests: modalContent.childNodes[4].value,
    restaurant: modalContent.childNodes[5].value,
    date: Number(`${send.year}${send.month}${send.date}${time}`),
  };
  const data = JSON.stringify(reservationForm);

  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      const res = JSON.parse(xhttp.responseText);
      console.log(res);

      if (!res.user) {
        alert(`로그인이 필요합니다`);
        window.location.href = `http://localhost:4001${res.url}`;
      } else if (res.accepted === false) {
        alert("예약초과!");
        window.location.href = `http://localhost:4001/reserve/finalReserve/restaurant:${reservationForm.restaurant}`;
      } else {
        alert(`${reservationForm.name}님 ${reservationForm.date} 예약완료!`);
        window.location.href = "http://localhost:4001";
      }
    }
  };

  xhttp.open("post", "/ajax/postReservation", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(data);
};

const sendDate = (...argu) => {
  let sendDate;
  if (argu.length === 3) {
    sendDate = {
      url: window.location.pathname,
      year: argu[0],
      month: argu[1] < 9 ? `0${argu[1] + 1}` : argu[1] + 1,
      date: argu[2] < 10 ? `0${argu[2]}` : argu[2],
    };
  }
  if (argu.length === 4) {
    sendDate = {
      url: window.location.pathname,
      year: argu[0],
      month: argu[1] < 9 ? `0${argu[1] + 1}` : argu[1] + 1,
      date: argu[2] < 10 ? `0${argu[2]}` : argu[2],
      time: argu[3],
    };
  }

  return sendDate;
};

const clickDate = (event) => {
  const clickDate = {
    year: year,
    month: month,
    date: event.target.innerHTML,
  };

  date = clickDate.date;

  return clickDate;
};

const open_modal = (modal) => {
  modal.style.display = "block";
};

const close_modal = (event) => {
  const modal = event.target.parentElement.parentElement;
  if (event.target.className === "modal_close") modal.style.display = "none";
};

const init = () => {
  // btn_reservePopup.addEventListener("click", display_popup);
  display_popup();
  btn_right.addEventListener("click", month_right);
  btn_left.addEventListener("click", month_left);
};

init();
