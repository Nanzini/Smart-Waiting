const good = document.querySelector(".good");
const checkbox = document.querySelector("input");
const label = document.querySelector("label")
const numGood = label.querySelector("span");

function init(){
    /* 0. 로그인 된 상태일 때 local get해서 좋아요 색칠먼저 하기 */
    checkbox.addEventListener("change",ajaxGood);

    /* 로그인 된 상태라면 */
    if(document.querySelector(".email")){
      let restaurant = location.pathname.slice(20,location.pathname.length);
      let email = document.querySelector(".email").innerText
      if(localStorage.getItem(`${restaurant}:${email}`) === "true"){
        checkbox.checked = true;
        label.querySelector("i").className = "fas fa-heart";
        // numGood.innerText =Number(numGood.innerText)+ 1;
      }
      else if(localStorage.getItem(`${restaurant}:${email}`) === "false"){
        checkbox.checked = false;
        label.querySelector("i").className = "far fa-heart";
        // numGood.innerText =Number(numGood.innerText)- 1;
      }
    }
}

/* 1. 좋아요 누르면 Ajax통신하기 */
const ajaxGood = () => {
  /* 좋아요 눌렀을 때 */
  const email= document.querySelector(".email").innerText
  debugger;
    if(checkbox.checked){
        const data = {
            good : true,
            url : location.pathname.slice(20,location.pathname.length),
            numGood : Number(numGood.innerText),
            email : email
        }
    const xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          label.querySelector("i").className = "fas fa-heart";
          numGood.innerText =Number(numGood.innerText)+ 1;
          /* 로그인 된 userId */ 
          let key = `${data.url}:${email}`;
          localStorage.setItem(key,true);
        }
      };
      xhttp.open("post", "/ajax/good", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(JSON.stringify(data));
    }
    /* 좋아요 해제 했을 때 */
    else{
        const data = {
            good : false,
            url : location.pathname.slice(20,location.pathname.length),
            numGood : Number(numGood.innerText),
            email : email
        }
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            label.querySelector("i").className = "far fa-heart";
            numGood.innerText =Number(numGood.innerText)- 1;
            let key = `${data.url}:${email}`;
            localStorage.setItem(key,false);
          }
        };
        xhttp.open("post", "/ajax/good", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(data));
    } 
}

/* 2. Ajax통신끝나고 나서 local에 저장하기 */
const storeGood = () => {

}

init();