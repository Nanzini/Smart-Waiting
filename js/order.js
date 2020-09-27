const bigTables = document.querySelectorAll(".bigTable");
const miniTables = document.querySelectorAll(".miniTable");
const modal = document.querySelector(".modal");
const modalClose = document.querySelector(".modal_close");
let current;

// menu
const btnMenu = document.querySelector(".btnMenu");
const modalMenu = document.getElementById("modalMenu");
const btnRegister = document.querySelector(".btnRegister");

// order
const btnLeft = document.querySelectorAll(".btnLeft");
const btnRight = document.querySelectorAll(".btnRight");
const btnOrder = document.querySelectorAll(".btnOrder");
const orderForm = document.querySelectorAll(".orderForm");
const btnBill = document.querySelectorAll(".btnBill");

const clickBigTable = (event) => {
  current = event.target;

  if (current.id === "" && current.parentNode.className === "table")
    current = current.parentNode.parentNode;
  else if (current.className === "table") current = current.parentNode;

  modal.style.display = "block";

  modalClose.addEventListener("click", closeModal);
  for (let i = 0; i < btnLeft.length; i++)
    btnLeft[i].addEventListener("click", clickLeft);

  for (let i = 0; i < btnRight.length; i++)
    btnRight[i].addEventListener("click", clickRight);

  for (let i = 0; i < btnOrder.length; i++) {
    btnOrder[i].addEventListener("click", clickOrder);
    btnBill[i].addEventListener("click", clickBill);
  }
};

const clickBill = (event) => {
  if (current.id === "" && current.parentNode.className === "table")
    current = current.parentNode;
  else if (current.className === "table") current;
  else current = current.childNodes[0];

  const body = {
    id: getID(),
    tableId: current.id,
    menu: [],
    createAt: 0,
    price: 0,
    table: current.parentNode.className,
  };
  console.log("bill : " + body.tableId);
  const xhttp = new XMLHttpRequest();
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

const menu = () => {
  const sendMenu = [];
  const tables = bigTables.length + miniTables.length;
  for (let i = 0; i < orderForm.length / tables; i++) {
    const form = document.getElementById(`orderForm${i}`);
    if (form.childNodes[2].innerText !== "0") {
      let tmp = {
        name: form.childNodes[2].className,
        price: form.childNodes[3].innerText,
        n: form.childNodes[2].innerText,
      };
      sendMenu.push(tmp);
    }
  }
  return sendMenu;
};

const getPrice = (menu) => {
  debugger;
  let price = 0;
  for (let i = 0; i < menu.length; i++) {
    price += menu[i].price * menu[i].n;
  }
  return price;
};

const currentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month =
    now.getMonth() < 10
      ? `0${Number(now.getMonth() + 1)}`
      : Number(now.getMonth()) + 1;

  const day = now.getDate() < 10 ? `0${now.getDate()}` : now.getDate();
  const hour = now.getHours() < 10 ? `0${now.getHours()}` : now.getHours();
  const minute =
    now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();
  return `${year}${month}${day}:${hour}${minute}`;
};

const clickOrder = (event) => {
  if (current.id === "" && current.parentNode.className === "table")
    current = current.parentNode;
  else if (current.className === "table") current;
  else current = current.childNodes[0];
  const tmp_menu = menu();
  const tmp_price = getPrice(tmp_menu);
  const body = {
    id: getID(),
    tableId: current.id,
    menu: tmp_menu,
    createAt: currentDate(),
    price: tmp_price,
    table: current.parentNode.className,
  };
  console.log("order : " + body.tableId);
  const xhttp = new XMLHttpRequest();
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
const clickRight = (event) => {
  try {
    let target = event.target.parentNode.childNodes[2];
    if (event.target.className === "btnRight")
      target.innerText = Number(target.innerText) + Number(1);
  } catch (error) {}
};
const clickLeft = (event) => {
  try {
    let target = event.target.parentNode.childNodes[2];
    if (event.target.className === "btnLeft") {
      if (target.innerText !== "0") {
        target.innerText = Number(target.innerText) - Number(1);
      }
    }
  } catch (error) {
    console.log("ha");
  }
};

const closeModal = (event) => {
  modal.style.display = "none";
};

const clickMenu = () => {
  modalMenu.style.display = "block";
  const modalMenuClose = modalMenu.querySelector(".modal_close");
  modalMenuClose.addEventListener("click", () => {
    modalMenu.style.display = "none";
  });
  btnRegister.addEventListener("click", menuRegister);
};

const getID = () => {
  const url = window.location.href;
  const index = url.indexOf("order");
  const id = url.slice(index + 6, url.length);
  return id;
};

const menuRegister = () => {
  const modalMenu = document.getElementById("modalMenu");
  const menuInput = modalMenu.childNodes[0];

  const body = {
    id: getID(),
    name: menuInput.childNodes[1].value,
    price: menuInput.childNodes[2].value,
    category: menuInput.childNodes[3].value,
  };
  const xhttp = new XMLHttpRequest();
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
const init = () => {
  for (let i = 0; i < bigTables.length; i++)
    bigTables[i].addEventListener("click", clickBigTable);

  for (let i = 0; i < miniTables.length; i++)
    miniTables[i].addEventListener("click", clickBigTable);

  btnMenu.addEventListener("click", clickMenu);
};

init();
