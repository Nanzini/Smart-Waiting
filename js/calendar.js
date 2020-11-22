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

const display_popup = () => {
  // 오늘 날짜에 해당하는 달력불러오기!
  display_header(year, month + 1);
  draw_calendar(year, month, new Date(year, month, 1).getDay(), date);
  block_time();
};

const color_todayCalendar = () => {
  // 하나만 색칠하기
  const clickDate = event.target.id;
  const clickedElement = document.getElementById(clickDate);
  for (let i = 0; i < 36; i++)
    document.getElementById(i).style.backgroundColor = "#302326";
  if (clickedElement.style.color !== "gray")
    clickedElement.style.backgroundColor = "#6495ed";
};

const block_calendar = (maxDate, day, currentDate) => {
  const month = document.getElementById("header_month").innerText-1;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  for (let i = 0; i < maxDate; i++) {
    const realDay = day + i;
    document.getElementById(realDay).innerText = i + 1;

    /* 예약불가 2020년인데 2019년으로 넘겻을 때 */
    if(currentYear > year)
      document.getElementById(realDay).style.color = "gray";
    /* 2020년인데 2021년으로 넘겼을 때 예약가능 */
    else if(currentYear < year){
      document
          .getElementById(realDay)
          .addEventListener("click", ajax_click_calendar);
        document
          .getElementById(realDay)
          .addEventListener("click", color_todayCalendar);
          document.getElementById(realDay).style.color = "#d9d9d9";
    }
    else{
      /* 같은 달일 때 이미 지나버린 날짜 골라내서 블락하기 */
      if (currentMonth === month) {
        /* 3일일 때 1일 2일외에 다 가능 */
        if (currentDate + day - 1 <= realDay) {
          document
            .getElementById(realDay)
            .addEventListener("click", ajax_click_calendar);
          document
            .getElementById(realDay)
            .addEventListener("click", color_todayCalendar);
          document.getElementById(realDay).style.color = "#d9d9d9";
        }
        /* 3일 일 때 1일 2일 막기 */ 
        else document.getElementById(realDay).style.color = "gray";
      } 
      /* 11월인데 12월로 넘겼을 경우 전부 예약가능 */
      else if (currentMonth < month) {
        document
          .getElementById(realDay)
          .addEventListener("click", ajax_click_calendar);
        document
          .getElementById(realDay)
          .addEventListener("click", color_todayCalendar);
        document.getElementById(realDay).style.color = "#d9d9d9";
      } 
      /* 11월인데 10월로 넘겼을 경우 */
      else document.getElementById(realDay).style.color = "gray";
    }
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
      hour > time.name - 2
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
    document.getElementById(i).style.backgroundColor = "#302326";
  }
};
const display_header = (year, month) => {
  header_year.innerHTML = `${year}년`;
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

  console.log("ajax_click_calendar");
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

/* 예약시간 클릭해서 확인눌러서 서버로 데이터보내기
 예약가능인원 보여주기 */
const ajax_click_reserveTime = (time) => {
  debugger
  const modal = document.getElementById(`modal${time}`);
  const reservedPeople = modal.childNodes[0].querySelectorAll("h2");
  const reservePeople = modal.childNodes[0].childNodes[4].value;
  open_modal(modal);
  modalClose.forEach(() => {
    addEventListener("click", close_modal);
  });
  const sendReservation = document.getElementById(`sendReservation${time}`);
  if (reservedPeople > reservePeople)
    sendReservation.addEventListener("click", ajax_send_reservationData);

  const send = sendDate(year, month, date, time);

  // 데이터 잘나오고~ 이제 서버로 보내자
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      // 디비 예약데이터 가져오기

      reservedPeople[0].innerHTML = `예약가능한 4인테이블 : ${xhttp.responseText[1]}`;
      reservedPeople[1].innerHTML = `예약가능한 2인테이블 : ${xhttp.responseText[3]}`;
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
    bigId: big(),
    miniId: mini(),
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
  else if (event.target.className==="fas fa-times") modal.parentElement.style.display = "none";
};

const currentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month =
    now.getMonth() < 9
      ? `0${Number(now.getMonth() + 1)}`
      : Number(now.getMonth()) + 1;

  const day = now.getDate() < 10 ? `0${now.getDate()}` : now.getDate();
  const hour = now.getHours() < 10 ? `0${now.getHours()}` : now.getHours();
  const minute =
    now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();
  return `${year}${month}${day}:${hour}${minute}`;
};

const changeColor = () =>{
  const allTables = document.querySelectorAll(".table");
  debugger;
  for(let i=0; i<allTables.length; i++){
    if(allTables[i].childNodes[0].innerText === "사용중"){
      let overTime;
      let current = currentDate().slice(9,14);
      let orderTime = allTables[i].childNodes[1].innerText.slice(9,14);
      if(current.slice(0,2) === orderTime.slice(0,2)) overTime = current - orderTime;
      else  overTime = current- orderTime - 40;
      
      if(overTime < 20) allTables[i].style.backgroundColor="#76cc5f"
      else if(overTime <40) allTables[i].style.backgroundColor="#daa520"
      else  allTables[i].style.backgroundColor="#c02519"
    }
  }
    
}

const init = () => {
  // btn_reservePopup.addEventListener("click", display_popup);
  display_popup();
  btn_right.addEventListener("click", month_right);
  btn_left.addEventListener("click", month_left);
  setInterval(changeColor,3000);
};

const big = () => {
  const tmp = document.querySelectorAll(".bigTables");
  let arr = [];
  for (let i = 0; i < tmp.length; i++)
    arr.push(tmp[i].childNodes[0].childNodes[0].id);
  return arr;
};

const mini = () => {
  const tmp = document.querySelectorAll(".miniTables");
  let arr = [];
  for (let i = 0; i < tmp.length; i++)
    arr.push(tmp[i].childNodes[1].childNodes[0].id);
  return arr;
};

init();
