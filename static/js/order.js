"use strict";

var bigTables = document.querySelectorAll(".bigTable");
var miniTables = document.querySelectorAll(".miniTable");
var modal = document.querySelector(".modal");
var modalClose = document.querySelector(".modal_close");
var current; // menu

var btnMenu = document.querySelector(".btnMenu");
var modalMenu = document.getElementById("modalMenu");
var btnRegister = document.querySelector(".btnRegister"); // order

var btnLeft = document.querySelectorAll(".btnLeft");
var btnRight = document.querySelectorAll(".btnRight");
var btnOrder = document.querySelectorAll(".btnOrder");
var orderForm = document.querySelectorAll(".orderForm");
var btnBill = document.querySelectorAll(".btnBill");

var split = function split(str) {
  for (var i = 0; i < str.length; i++) {
    if (str[i] === " ") {
      var first = str.slice(0, i);
      var second = str.slice(i + 1, str.length);
      return [first, second];
    }
  }
};

var clickBigTable = function clickBigTable(event) {
  current = event.target;
  /* target : 눌린 테이블 id */

  /* current : bigTable */

  if (current.id === "" && current.parentNode.className === "table") current = current.parentNode.parentNode;else if (current.className === "table") current = event.target.parentNode;
  /* orderFOem에 메뉴 채우기 */

  var menu1 = {};
  var table = current.childNodes[0]; // table 1셀

  for (var i = 0; i < table.childNodes.length - 2; i++) {
    var tmp = split(table.childNodes[i].innerText);
    menu1[tmp[0]] = tmp[1];
  }

  current.nextSibling.style.display = "block";
  /* orderForm 0:X 1:form ... ㅁ지막 : OK -- 클릭 시 메뉴정보 form에 넣기 */

  var orderForm1 = current.nextSibling.childNodes[0];

  for (var key in menu1) {
    for (var _i = 1; _i < orderForm1.childElementCount - 1; _i++) {
      if (key === orderForm1.childNodes[_i].childNodes[0].innerText) {
        orderForm1.childNodes[_i].childNodes[2].innerText = menu1[key];
        /* price작업 */

        orderForm1.childNodes[_i].childNodes[5].innerText = orderForm1.childNodes[_i].childNodes[2].innerText * orderForm1.childNodes[_i].childNodes[4].innerText;
      }
    }
  }
  /* 총액 구하기 */
  // modal content


  var form = document.getElementById(current.id).nextSibling.childNodes[0];
  var tmp_menu = menu(form);
  var tmp_price = getPrice(tmp_menu);
  form.childNodes[form.childElementCount - 2].childNodes[0].innerText = "총액 : " + tmp_price;
  var close_modal = current.nextSibling.childNodes[0].childNodes[0];
  if (close_modal.className === "modal_close") close_modal.addEventListener("click", function () {
    current.nextSibling.style.display = "none";
  });else if (close_modal.className === "fas fa-times") close_modal.parentNode.addEventListener("click", function () {
    current.nextSibling.style.display = "none";
  });

  for (var _i2 = 0; _i2 < btnLeft.length; _i2++) {
    btnLeft[_i2].addEventListener("click", clickLeft);
  }

  for (var _i3 = 0; _i3 < btnRight.length; _i3++) {
    btnRight[_i3].addEventListener("click", clickRight);
  }

  for (var _i4 = 0; _i4 < btnOrder.length; _i4++) {
    btnOrder[_i4].addEventListener("click", clickOrder);
  }

  for (var _i5 = 0; _i5 < btnBill.length; _i5++) {
    btnBill[_i5].addEventListener("click", clickBill);
  }
};

var clickBill = function clickBill(event) {
  if (current.id === "" && current.parentNode.className === "table") current = current.parentNode;else if (current.className === "table") current;else current = current.childNodes[0];
  var body = {
    id: getID(),
    tableId: current.id,
    menu: [],
    createAt: 0,
    price: 0,
    table: current.parentNode.className
  };
  console.log("bill : " + body.tableId);
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      alert("정산되었습니다!");
      location.reload(true);
    }
  };

  xhttp.open("post", "/ajax/bill", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(body));
};

var getPrice = function getPrice(menu) {
  var price = 0;

  for (var i = 0; i < menu.length; i++) {
    price += menu[i].price * menu[i].n;
  }

  return price;
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

var menu = function menu(content) {
  /* content : modal content */
  var sendMenu = [];
  var form = content.querySelectorAll(".orderForm");

  for (var i = 0; i < form.length; i++) {
    /* 메뉴개수가 0이 아닐 때 */
    if (form[i].childNodes[2].innerText !== "0") {
      var tmp = {
        name: form[i].childNodes[2].className,
        price: form[i].childNodes[5].innerText,
        n: form[i].childNodes[2].innerText
      };
      sendMenu.push(tmp);
    }
  }

  return sendMenu;
};

var changeColor = function changeColor() {
  var allTables = document.querySelectorAll(".table");
  debugger;

  for (var i = 0; i < allTables.length; i++) {
    if (allTables[i].childNodes[0].innerText !== "빈좌석" && allTables[i].childNodes[0].innerText !== "예약석") {
      var overTime = void 0;

      var _current = currentDate().slice(9, 14);

      var orderTime = allTables[i].childNodes[1].innerText.slice(9, 14);
      if (_current.slice(0, 2) === orderTime.slice(0, 2)) overTime = _current - orderTime;else overTime = _current - orderTime - 40;
      if (overTime < 20) allTables[i].style.backgroundColor = "#76cc5f";else if (overTime < 40) allTables[i].style.backgroundColor = "#daa520";else allTables[i].style.backgroundColor = "#c02519";
    }
  }
};

var clickOrder = function clickOrder(event) {
  if (current.id === "" && current.parentNode.className === "table") current = current.parentNode;else if (current.className === "table") current;else current = current.childNodes[0];
  /* modal content */

  var form = document.getElementById(current.id).parentNode.nextSibling.childNodes[0];
  var tmp_menu = menu(form);
  var tmp_price = getPrice(tmp_menu);
  var body = {
    id: getID(),

    /* 테이블 1개 */
    tableId: current.id,
    menu: tmp_menu,

    /* 사용중인 테이블이라면 createAt 기존의 데이터 보내 */
    createAt: current.childNodes[0].innerText === "빈좌석" || current.childNodes[0].innerText === "예약석" ? currentDate() : current.lastChild.innerText,
    price: tmp_price,
    table: current.parentNode.className
  };
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      alert("등록되었습니다!");
      location.reload();
    }
  };

  xhttp.open("post", "/ajax/orderRegister", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(body));
};

var clickRight = function clickRight(event) {
  try {
    var target = event.target.parentNode.childNodes[2];
    /* modal content */

    var _form = target.parentNode.parentNode;
    var price = target.nextSibling.nextSibling.innerText;

    if (event.target.className === "btnRight") {
      /* 버튼 누를 때 마다 가격 바뀌기 */
      target.innerText = Number(target.innerText) + Number(1);
      target.parentNode.lastChild.innerText = Number(target.innerText) * price;
      /* 총액 계산하기 */

      var tmp_menu = menu(_form);
      var tmp_price = getPrice(tmp_menu);
      _form.childNodes[_form.childElementCount - 2].childNodes[0].innerText = "총액 : " + tmp_price;
    }
  } catch (error) {}
};

var clickLeft = function clickLeft(event) {
  try {
    var target = event.target.parentNode.childNodes[2];
    var price = target.nextSibling.nextSibling.innerText;

    if (event.target.className === "btnLeft") {
      if (target.innerText !== "0") {
        target.innerText = Number(target.innerText) - Number(1);
        target.parentNode.lastChild.innerText = Number(target.innerText) * price;
        /* 총액 계산하기 */

        var tmp_menu = menu(form);
        var tmp_price = getPrice(tmp_menu);
        form.childNodes[form.childElementCount - 2].childNodes[0].innerText = "총액 : " + tmp_price;
      }
    }
  } catch (error) {
    console.log("ha");
  }
};

var closeModal = function closeModal(event) {
  modal.style.display = "none";
};

var clickMenu = function clickMenu() {
  modalMenu.style.display = "block";
  var modalMenuClose = modalMenu.querySelector(".modal_close");
  modalMenuClose.addEventListener("click", function () {
    modalMenu.style.display = "none";
  });
  btnRegister.addEventListener("click", menuRegister);
};

var getID = function getID() {
  var url = window.location.href;
  var index = url.indexOf("order");
  var id = url.slice(index + 6, url.length);
  return id;
};

var menuRegister = function menuRegister() {
  var modalMenu = document.getElementById("modalMenu");
  var menuInput = modalMenu.childNodes[0].childNodes[1];
  var body = {
    id: getID(),
    name: menuInput.childNodes[0].value,
    price: menuInput.childNodes[1].value,
    category: menuInput.childNodes[2].value
  };
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      alert("등록되었습니다!");
      location.reload(true);
    }
  };

  xhttp.open("post", "/ajax/menuRegister", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(body));
};

var init = function init() {
  for (var i = 0; i < bigTables.length; i++) {
    bigTables[i].addEventListener("click", clickBigTable);
  }

  for (var _i6 = 0; _i6 < miniTables.length; _i6++) {
    miniTables[_i6].addEventListener("click", clickBigTable);
  }

  btnMenu.addEventListener("click", clickMenu);
  setInterval(changeColor, 3000);
};

init();