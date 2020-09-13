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

var clickBigTable = function clickBigTable(event) {
  current = event.target;
  if (current.id === "" && current.parentNode.className === "table") current = current.parentNode.parentNode;
  if (current.id === "table") current = current.parentNode;
  console.log(current);
  modal.style.display = "block";
  modalClose.addEventListener("click", closeModal);

  for (var i = 0; i < btnLeft.length; i++) {
    btnLeft[i].addEventListener("click", clickLeft);
  }

  for (var _i = 0; _i < btnRight.length; _i++) {
    btnRight[_i].addEventListener("click", clickRight);
  }

  for (var _i2 = 0; _i2 < btnOrder.length; _i2++) {
    btnOrder[_i2].addEventListener("click", clickOrder);

    btnBill[_i2].addEventListener("click", clickBill);
  }
};

var clickBill = function clickBill(event) {
  console.log(event.target.parentNode);
  console.log(current.id);
  var body = {
    id: getID(),
    tableId: current.id,
    menu: [],
    createAt: 0,
    price: 0,
    table: current.parentNode.className
  };
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

var menu = function menu() {
  var sendMenu = [];
  var tables = bigTables.length + miniTables.length;

  for (var i = 0; i < orderForm.length / tables; i++) {
    var form = document.getElementById("orderForm".concat(i));

    if (form.childNodes[2].innerText !== "0") {
      var tmp = {
        name: form.childNodes[2].className,
        price: form.childNodes[3].innerText,
        n: form.childNodes[2].innerText
      };
      sendMenu.push(tmp);
    }
  }

  return sendMenu;
};

var getPrice = function getPrice(menu) {
  debugger;
  var price = 0;

  for (var i = 0; i < menu.length; i++) {
    price += menu[i].price * menu[i].n;
  }

  return price;
};

var currentDate = function currentDate() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() < 10 ? "0".concat(Number(now.getMonth() + 1)) : Number(now.getMonth()) + 1;
  var day = now.getDate() < 10 ? "0".concat(now.getDate()) : now.getDate();
  var hour = now.getHours() < 10 ? "0".concat(now.getHours()) : now.getHours();
  var minute = now.getMinutes() < 10 ? "0".concat(now.getMinutes()) : now.getMinutes();
  return "".concat(year).concat(month).concat(day, ":").concat(hour).concat(minute);
};

var clickOrder = function clickOrder() {
  var tmp_menu = menu();
  var tmp_price = getPrice(tmp_menu);
  var body = {
    id: getID(),
    tableId: current.id,
    menu: tmp_menu,
    createAt: currentDate(),
    price: tmp_price,
    table: current.parentNode.className
  };
  console.log(body);
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      alert("등록되었습니다!");
      location.reload(true);
    }
  };

  xhttp.open("post", "/ajax/orderRegister", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(body));
};

var clickRight = function clickRight(event) {
  try {
    var target = event.target.parentNode.childNodes[2];
    if (event.target.className === "btnRight") target.innerText = Number(target.innerText) + Number(1);
  } catch (error) {}
};

var clickLeft = function clickLeft(event) {
  try {
    var target = event.target.parentNode.childNodes[2];

    if (event.target.className === "btnLeft") {
      if (target.innerText !== "0") {
        target.innerText = Number(target.innerText) - Number(1);
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
  var menuInput = modalMenu.childNodes[0];
  var body = {
    id: getID(),
    name: menuInput.childNodes[1].value,
    price: menuInput.childNodes[2].value,
    category: menuInput.childNodes[3].value
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

  for (var _i3 = 0; _i3 < miniTables.length; _i3++) {
    miniTables[_i3].addEventListener("click", clickBigTable);
  }

  btnMenu.addEventListener("click", clickMenu);
};

init();