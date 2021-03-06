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

var date = now.getDate();
var hour = now.getHours();

var display_popup = function display_popup() {
  // 오늘 날짜에 해당하는 달력불러오기!
  display_header(year, month + 1);
  draw_calendar(year, month, new Date(year, month, 1).getDay(), date);
  block_time();
};

var color_todayCalendar = function color_todayCalendar() {
  // 하나만 색칠하기
  var clickDate = event.target.id;
  var clickedElement = document.getElementById(clickDate);

  for (var i = 0; i < 36; i++) {
    document.getElementById(i).style.backgroundColor = "#302326";
  }

  if (clickedElement.style.color !== "gray") clickedElement.style.backgroundColor = "#6495ed";
};

var block_calendar = function block_calendar(maxDate, day, currentDate) {
  var month = document.getElementById("header_month").innerText - 1;
  var currentMonth = new Date().getMonth();
  var currentYear = new Date().getFullYear();

  for (var i = 0; i < maxDate; i++) {
    var realDay = day + i;
    document.getElementById(realDay).innerText = i + 1;
    /* 예약불가 2020년인데 2019년으로 넘겻을 때 */

    if (currentYear > year) document.getElementById(realDay).style.color = "gray";
    /* 2020년인데 2021년으로 넘겼을 때 예약가능 */
    else if (currentYear < year) {
        document.getElementById(realDay).addEventListener("click", ajax_click_calendar);
        document.getElementById(realDay).addEventListener("click", color_todayCalendar);
        document.getElementById(realDay).style.color = "#d9d9d9";
      } else {
        /* 같은 달일 때 이미 지나버린 날짜 골라내서 블락하기 */
        if (currentMonth === month) {
          /* 3일일 때 1일 2일외에 다 가능 */
          if (currentDate + day - 1 <= realDay) {
            document.getElementById(realDay).addEventListener("click", ajax_click_calendar);
            document.getElementById(realDay).addEventListener("click", color_todayCalendar);
            document.getElementById(realDay).style.color = "#d9d9d9";
          }
          /* 3일 일 때 1일 2일 막기 */
          else document.getElementById(realDay).style.color = "gray";
        }
        /* 11월인데 12월로 넘겼을 경우 전부 예약가능 */
        else if (currentMonth < month) {
            document.getElementById(realDay).addEventListener("click", ajax_click_calendar);
            document.getElementById(realDay).addEventListener("click", color_todayCalendar);
            document.getElementById(realDay).style.color = "#d9d9d9";
          }
          /* 11월인데 10월로 넘겼을 경우 */
          else document.getElementById(realDay).style.color = "gray";
      }
  }
};

var block_time = function block_time() {
  var currentMonth = now.getMonth();
  var currentDate = now.getDate();

  for (var i = 0; i < 13; i += 2) {
    var time = document.querySelector(".reserveList").childNodes[i];
    if (currentMonth === month && currentDate === Number(date) && hour > time.name - 2) time.disabled = true;else time.disabled = false;
  }
};

var draw_calendar = function draw_calendar(year, month1, day, date) {
  // day : 0일 1월 2화 3수...
  // month1은 현재 or 지날달 or 다음달이 될 수 있다.
  var maxDate = month1 === 1 ? monthDate[month1](year) : monthDate[month1]; // 몇일 까지 있을까?

  var currentDate = new Date().getDate();
  var currentMonth = now.getMonth(); // 회색표시

  block_calendar(maxDate, new Date(year, month1, 1).getDay(), currentDate); // 달력 다음달 이번달 전달 해당날짜 칠하기

  if (month1 > currentMonth) document.getElementById(date + day - 1).style.backgroundColor = "#6495ed";
  if (month1 === currentMonth) document.getElementById(date + day - 1).style.backgroundColor = "#6495ed";
};

var clear_calendar = function clear_calendar() {
  for (var i = 0; i < 37; i++) {
    document.getElementById(i).innerText = null;
    document.getElementById(i).removeEventListener("click", ajax_click_calendar);
    document.getElementById(i).style.backgroundColor = "#302326";
  }
};

var display_header = function display_header(year, month) {
  header_year.innerHTML = "".concat(year, "\uB144");
  header_month.innerHTML = month;
};

var month_right = function month_right() {
  return_month_right();
  display_header(year, month + 1);
  clear_calendar();
  draw_calendar(year, month, new Date(year, month, 1).getDay(), 1);
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
  var getDate = month === 1 ? monthDate[month](year) : monthDate[month];
  draw_calendar(year, month, new Date(year, month, 1).getDay(), getDate);
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
  var currentMonth = now.getMonth();
  var currentDate = now.getDate();
  console.log("ajax_click_calendar");
  console.log(send); // 예약타임 블락하기

  block_time();
  var xhttp = new XMLHttpRequest();

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
/* 예약시간 클릭해서 확인눌러서 서버로 데이터보내기
 예약가능인원 보여주기 */


var ajax_click_reserveTime = function ajax_click_reserveTime(time) {
  debugger;
  var modal = document.getElementById("modal".concat(time));
  var reservedPeople = modal.childNodes[0].querySelectorAll("h2");
  var reservePeople = modal.childNodes[0].childNodes[4].value;
  open_modal(modal);
  modalClose.forEach(function () {
    addEventListener("click", close_modal);
  });
  var sendReservation = document.getElementById("sendReservation".concat(time));
  if (reservedPeople > reservePeople) sendReservation.addEventListener("click", ajax_send_reservationData);
  var send = sendDate(year, month, date, time); // 데이터 잘나오고~ 이제 서버로 보내자

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      // 디비 예약데이터 가져오기
      reservedPeople[0].innerHTML = "\uC608\uC57D\uAC00\uB2A5\uD55C 4\uC778\uD14C\uC774\uBE14 : ".concat(xhttp.responseText[1]);
      reservedPeople[1].innerHTML = "\uC608\uC57D\uAC00\uB2A5\uD55C 2\uC778\uD14C\uC774\uBE14 : ".concat(xhttp.responseText[3]);
    }
  };

  xhttp.open("post", "/ajax/getReservation", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(send));
}; // OK버튼 누르면 서버로 데이터 전송
// 예약인원 꽉찼을때 OK누르면 예외처리해야한다


var ajax_send_reservationData = function ajax_send_reservationData(event) {
  var modalParent = event.target.parentElement.parentElement;
  var modalContent = modalParent.querySelector(".modal-content");
  var time = event.target.parentElement.parentElement.id.slice(5, 7);
  var reservedPeople = modalContent.querySelector("h2");
  var send = sendDate(year, month, date, time);
  var reservationForm = {
    name: modalContent.childNodes[3].value,
    guests: modalContent.childNodes[4].value,
    restaurant: modalContent.childNodes[5].value,
    date: Number("".concat(send.year).concat(send.month).concat(send.date).concat(time)),
    bigId: big(),
    miniId: mini()
  };
  var data = JSON.stringify(reservationForm);
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      var res = JSON.parse(xhttp.responseText);
      console.log(res);

      if (!res.user) {
        alert("\uB85C\uADF8\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4");
        window.location.href = "http://localhost:4001".concat(res.url);
      } else if (res.accepted === false) {
        alert("예약초과!");
        window.location.href = "http://localhost:4001/reserve/finalReserve/restaurant:".concat(reservationForm.restaurant);
      } else {
        alert("".concat(reservationForm.name, "\uB2D8 ").concat(reservationForm.date, " \uC608\uC57D\uC644\uB8CC!"));
        window.location.href = "http://localhost:4001";
      }
    }
  };

  xhttp.open("post", "/ajax/postReservation", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(data);
};

var sendDate = function sendDate() {
  var sendDate;

  if (arguments.length === 3) {
    sendDate = {
      url: window.location.pathname,
      year: arguments.length <= 0 ? undefined : arguments[0],
      month: (arguments.length <= 1 ? undefined : arguments[1]) < 9 ? "0".concat((arguments.length <= 1 ? undefined : arguments[1]) + 1) : (arguments.length <= 1 ? undefined : arguments[1]) + 1,
      date: (arguments.length <= 2 ? undefined : arguments[2]) < 10 ? "0".concat(arguments.length <= 2 ? undefined : arguments[2]) : arguments.length <= 2 ? undefined : arguments[2]
    };
  }

  if (arguments.length === 4) {
    sendDate = {
      url: window.location.pathname,
      year: arguments.length <= 0 ? undefined : arguments[0],
      month: (arguments.length <= 1 ? undefined : arguments[1]) < 9 ? "0".concat((arguments.length <= 1 ? undefined : arguments[1]) + 1) : (arguments.length <= 1 ? undefined : arguments[1]) + 1,
      date: (arguments.length <= 2 ? undefined : arguments[2]) < 10 ? "0".concat(arguments.length <= 2 ? undefined : arguments[2]) : arguments.length <= 2 ? undefined : arguments[2],
      time: arguments.length <= 3 ? undefined : arguments[3]
    };
  }

  return sendDate;
};

var clickDate = function clickDate(event) {
  var clickDate = {
    year: year,
    month: month,
    date: event.target.innerHTML
  };
  date = clickDate.date;
  return clickDate;
};

var open_modal = function open_modal(modal) {
  modal.style.display = "block";
};

var close_modal = function close_modal(event) {
  var modal = event.target.parentElement.parentElement;
  if (event.target.className === "modal_close") modal.style.display = "none";else if (event.target.className === "fas fa-times") modal.parentElement.style.display = "none";
};

var currentDate = function currentDate() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() < 9 ? "0".concat(Number(now.getMonth() + 1)) : Number(now.getMonth()) + 1;
  var day = now.getDate() < 10 ? "0".concat(now.getDate()) : now.getDate();
  var hour = now.getHours() < 10 ? "0".concat(now.getHours()) : now.getHours();
  var minute = now.getMinutes() < 10 ? "0".concat(now.getMinutes()) : now.getMinutes();
  return "".concat(year).concat(month).concat(day, ":").concat(hour).concat(minute);
};

var changeColor = function changeColor() {
  var allTables = document.querySelectorAll(".table");
  debugger;

  for (var i = 0; i < allTables.length; i++) {
    if (allTables[i].childNodes[0].innerText === "사용중") {
      var overTime = void 0;
      var current = currentDate().slice(9, 14);
      var orderTime = allTables[i].childNodes[1].innerText.slice(9, 14);
      if (current.slice(0, 2) === orderTime.slice(0, 2)) overTime = current - orderTime;else overTime = current - orderTime - 40;
      if (overTime < 20) allTables[i].style.backgroundColor = "#76cc5f";else if (overTime < 40) allTables[i].style.backgroundColor = "#daa520";else allTables[i].style.backgroundColor = "#c02519";
    }
  }
};

var init = function init() {
  // btn_reservePopup.addEventListener("click", display_popup);
  display_popup();
  btn_right.addEventListener("click", month_right);
  btn_left.addEventListener("click", month_left);
  setInterval(changeColor, 3000);
};

var big = function big() {
  var tmp = document.querySelectorAll(".bigTables");
  var arr = [];

  for (var i = 0; i < tmp.length; i++) {
    arr.push(tmp[i].childNodes[0].childNodes[0].id);
  }

  return arr;
};

var mini = function mini() {
  var tmp = document.querySelectorAll(".miniTables");
  var arr = [];

  for (var i = 0; i < tmp.length; i++) {
    arr.push(tmp[i].childNodes[1].childNodes[0].id);
  }

  return arr;
};

init();