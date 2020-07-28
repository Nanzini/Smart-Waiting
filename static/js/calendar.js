"use strict";

// 완료
var btn_reservePopup = document.getElementById("btn_reserve");
var popup = document.getElementById("calendar"); // 헤더

var header_year = document.getElementById("header_year");
var header_month = document.getElementById("header_month");
var btn_left = document.getElementById("btn_left");
var btn_right = document.getElementById("btn_right"); // 모달

var modalClose = document.querySelectorAll(".modal_close"); // 변수부분

var monthDate = [31, function (year) {
  if (year % 4) return 28;else return 29;
}, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var now = new Date();
var year = now.getFullYear();
var month = now.getMonth(); // 0 : 1월, 11 : 12월

var day = now.getDay(); // 0 : 일요일, 6 : 토요일

var date = now.getDate(); // ////////////////////////////////// 메서드부분

var display_popup = function display_popup() {
  // 오늘 날짜에 해당하는 달력불러오기!
  // btn_modalExit.addEventListener("click", () => {
  //   popup.style.display = "none";
  // });
  display_header(year, month + 1);
  draw_calendar(year, month, new Date(year, month, 1).getDay());
};

var color_todayCalendar = function color_todayCalendar() {
  if (arguments.length === 1) document.getElementById(day).style.backgroundColor = "#6495ed";else document.getElementById(date + day).style.backgroundColor = "#6495ed";
};

var draw_calendar = function draw_calendar(year, month, day) {
  // day : 0일 1월 2화 3수...
  var date = month === 1 ? monthDate[month](year) : monthDate[month]; // 몇일 까지 있을까?

  for (var i = 0; i < date; i++) {
    document.getElementById(day + i).innerText = i + 1;
    document.getElementById(day + i).addEventListener("click", ajax_click_calendar);
  }
};

var clear_calendar = function clear_calendar() {
  for (var i = 0; i < 37; i++) {
    document.getElementById(i).innerText = null;
    document.getElementById(i).removeEventListener("click", ajax_click_calendar);
  }
};

var display_header = function display_header(year, month) {
  header_year.innerHTML = year;
  header_month.innerHTML = month;
};

var month_right = function month_right() {
  return_month_right();
  display_header(year, month + 1);
  clear_calendar();
  draw_calendar(year, month, new Date(year, month, 1).getDay());
};

var return_month_right = function return_month_right() {
  if (month === 11) {
    year += 1;
    month = 0;
    return 0;
  }

  month += 1;
};

var month_left = function month_left() {
  return_month_left();
  display_header(year, month + 1);
  clear_calendar();
  draw_calendar(year, month, new Date(year, month, 1).getDay());
};

var return_month_left = function return_month_left() {
  if (month === 0) {
    year -= 1;
    month = 11;
    return 0;
  }

  month -= 1;
}; // AJAX FUNCTION
// 달력클릭하면 해당 날짜 서버에 전송하고 테이블데이터


var ajax_click_calendar = function ajax_click_calendar(event) {
  var click = clickDate(event);
  var send = sendDate(click.year, click.month, click.date);
  console.log("AJAX CLICK CALENDAR 최종적으로 보낼 데이터");
  console.log(send);
  var date = JSON.stringify(send);
  var xhttp = new XMLHttpRequest();

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

var sendDate = function sendDate(year, month, date) {
  var sendDate = {
    url: window.location.pathname,
    year: year,
    month: month + 1 < 10 ? "0".concat(month) : month,
    date: date < 10 ? "0".concat(date) : date
  };
  return sendDate;
};

var clickDate = function clickDate(event) {
  var clickDate = {
    year: year,
    month: month + 1,
    date: event.target.innerHTML
  };
  year = clickDate.year;
  month = clickDate.month;
  date = clickDate.date;
  return clickDate;
}; // 예약시간 클릭해서 확인눌러서 서버로 데이터보내기


var ajax_click_reserveTime = function ajax_click_reserveTime(time) {
  var modal = document.getElementById("modal".concat(time));
  open_modal(modal);
  modalClose.forEach(function () {
    addEventListener("click", close_modal);
  });
  var sendReservation = document.getElementById("sendReservation".concat(time));
  sendReservation.addEventListener("click", ajax_send_reservationData);
}; // OK버튼 누르면 서버로 데이터 전송


var ajax_send_reservationData = function ajax_send_reservationData(event) {
  var modalParent = event.target.parentElement.parentElement;
  var modalContent = modalParent.querySelector(".modal-content");
  var send = sendDate(year, month, date);
  var time = event.target.parentElement.parentElement.id.slice(5, 7);
  var reservationForm = {
    name: modalContent.childNodes[2].value,
    guests: modalContent.childNodes[3].value,
    restaurant: modalContent.childNodes[4].value,
    date: Number("".concat(send.year).concat(send.month).concat(send.date).concat(time))
  };
  var data = JSON.stringify(reservationForm);
  console.log(data);
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      console.log(xhttp.responseText);
      var res = JSON.parse(xhttp.responseText);
      console.log(res);

      if (!res.user) {
        alert("\uB85C\uADF8\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4");
        window.location.href = "http://localhost:4001".concat(res.url);
      } else {
        alert("\uC608\uC57D\uC131\uACF5!");
        window.location.href = "http://localhost:4001";
      }

      console.log("뭐지");
    }
  };

  xhttp.open("post", "/ajax/postReservation", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(data);
};

var open_modal = function open_modal(modal) {
  modal.style.display = "block";
};

var close_modal = function close_modal(event) {
  var modal = event.target.parentElement.parentElement;
  console.log(event.target.className);
  if (event.target.className === "modal_close") modal.style.display = "none";
};

var init = function init() {
  // btn_reservePopup.addEventListener("click", display_popup);
  display_popup();
  btn_right.addEventListener("click", month_right);
  btn_left.addEventListener("click", month_left);
};

init();