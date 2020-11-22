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

const split = (str) => {
    for(let i=0; i<str.length; i++){
        if(str[i] ===" "){
            const first = str.slice(0,i);
            const second = str.slice(i+1,str.length);
            return [first,second];
        }
      }
}

const clickBigTable = (event) => {
  current = event.target;

  /* target : 눌린 테이블 id */
  /* current : bigTable */
  if (current.id === "" && current.parentNode.className === "table")
    current = current.parentNode.parentNode;
  else if (current.className === "table") current = event.target.parentNode;

  /* orderFOem에 메뉴 채우기 */
  let menu1 = {}
  const table = current.childNodes[0];  // table 1셀
  
    for(let i=0; i<table.childNodes.length-2; i++){
      let tmp = split(table.childNodes[i].innerText)
      menu1[tmp[0]] = tmp[1];
    }
  
    current.nextSibling.style.display = "block";

  /* orderForm 0:X 1:form ... ㅁ지막 : OK -- 클릭 시 메뉴정보 form에 넣기 */
  const orderForm1 = current.nextSibling.childNodes[0];
  for(let key in menu1){
    for(let i=1; i<orderForm1.childElementCount-1; i++){
      if(key === orderForm1.childNodes[i].childNodes[0].innerText){
        orderForm1.childNodes[i].childNodes[2].innerText = menu1[key];
        /* price작업 */
        orderForm1.childNodes[i].childNodes[5].innerText = 
        orderForm1.childNodes[i].childNodes[2].innerText*orderForm1.childNodes[i].childNodes[4].innerText
      }
    }
  }

  /* 총액 구하기 */
  // modal content
  const form = document.getElementById(current.id).nextSibling.childNodes[0]
  const tmp_menu = menu(form);
  const tmp_price = getPrice(tmp_menu);
  form.childNodes[form.childElementCount-2].childNodes[0].innerText="총액 : "+tmp_price;

  let close_modal = current.nextSibling.childNodes[0].childNodes[0];
  if(close_modal.className==="modal_close") close_modal.addEventListener("click", ()=>{
    current.nextSibling.style.display="none"
  });
  else if(close_modal.className==="fas fa-times") close_modal.parentNode.addEventListener("click", ()=>{
    current.nextSibling.style.display="none"
  });

  
  for (let i = 0; i < btnLeft.length; i++)
    btnLeft[i].addEventListener("click", clickLeft);
  

  for (let i = 0; i < btnRight.length; i++)
    btnRight[i].addEventListener("click", clickRight);

  for (let i = 0; i < btnOrder.length; i++) 
    btnOrder[i].addEventListener("click", clickOrder);

  for (let i = 0; i < btnBill.length; i++) 
    btnBill[i].addEventListener("click", clickBill);
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


const getPrice = (menu) => {
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
    now.getMonth() < 9
      ? `0${Number(now.getMonth() + 1)}`
      : Number(now.getMonth()) + 1;

  const day = now.getDate() < 10 ? `0${now.getDate()}` : now.getDate();
  const hour = now.getHours() < 10 ? `0${now.getHours()}` : now.getHours();
  const minute =
    now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();
  return `${year}${month}${day}:${hour}${minute}`;
};

const menu = (content) => {
  /* content : modal content */
  const sendMenu = [];
  
  const form = content.querySelectorAll(".orderForm");
  for (let i = 0; i < form.length; i++) {
    /* 메뉴개수가 0이 아닐 때 */
    if (form[i].childNodes[2].innerText !== "0") {
      let tmp = {
        name: form[i].childNodes[2].className,
        price: form[i].childNodes[5].innerText,
        n: form[i].childNodes[2].innerText,
      };
      sendMenu.push(tmp);
    }
  }
  return sendMenu;
};

const changeColor = () =>{
  const allTables = document.querySelectorAll(".table");
  debugger;
  for(let i=0; i<allTables.length; i++){
    if(allTables[i].childNodes[0].innerText !== "빈좌석" &&
    allTables[i].childNodes[0].innerText !== "예약석"){
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

const clickOrder = (event) => {
  if (current.id === "" && current.parentNode.className === "table")
    current = current.parentNode;
  else if (current.className === "table") current;
  else current = current.childNodes[0];
  
  /* modal content */
  let form = document.getElementById(current.id).parentNode.nextSibling.childNodes[0];
  const tmp_menu = menu(form);
  const tmp_price = getPrice(tmp_menu);
  const body = {
    id: getID(),
    /* 테이블 1개 */
    tableId: current.id,
    menu: tmp_menu,

    /* 사용중인 테이블이라면 createAt 기존의 데이터 보내 */
    createAt: (current.childNodes[0].innerText === "빈좌석" || current.childNodes[0].innerText === "예약석") ? currentDate() : current.lastChild.innerText,
    price: tmp_price,
    table: current.parentNode.className,
  };

  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      alert("등록되었습니다!");
      location.reload()
    }
  };
  xhttp.open("post", "/ajax/orderRegister", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(body));
};
const clickRight = (event) => {
  try {
    
    let target = event.target.parentNode.childNodes[2];
    /* modal content */
    const form = target.parentNode.parentNode;
    let price = target.nextSibling.nextSibling.innerText;
    if (event.target.className === "btnRight"){
      /* 버튼 누를 때 마다 가격 바뀌기 */
      target.innerText = Number(target.innerText) + Number(1);
      target.parentNode.lastChild.innerText = (Number(target.innerText))*price;

      /* 총액 계산하기 */
      const tmp_menu = menu(form);
      const tmp_price = getPrice(tmp_menu);
      form.childNodes[form.childElementCount-2].childNodes[0].innerText="총액 : "+tmp_price;
    }
  } catch (error) {}
};
const clickLeft = (event) => {
  try {
    let target = event.target.parentNode.childNodes[2];
    let price = target.nextSibling.nextSibling.innerText;
    if (event.target.className === "btnLeft") {
      if (target.innerText !== "0") {
        target.innerText = Number(target.innerText) - Number(1);
        target.parentNode.lastChild.innerText = (Number(target.innerText))*price;

              /* 총액 계산하기 */
      const tmp_menu = menu(form);
      const tmp_price = getPrice(tmp_menu);
      form.childNodes[form.childElementCount-2].childNodes[0].innerText="총액 : "+tmp_price;
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
  const menuInput = modalMenu.childNodes[0].childNodes[1];

  const body = {
    id: getID(),
    name: menuInput.childNodes[0].value,
    price: menuInput.childNodes[1].value,
    category: menuInput.childNodes[2].value,
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
  
  setInterval(changeColor,3000);
};

init();
