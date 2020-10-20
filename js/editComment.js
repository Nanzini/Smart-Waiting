const btn_editComment = document.querySelectorAll(".editComment");
const btn_deleteComment = document.querySelectorAll(".deleteComment");
const btn_editCompleted = document.querySelectorAll(".editCompleted");
/* hover effect */
const img = document.querySelector(".restaurantImg");

const editComment = (event) => {

  let currentTarget;  // claaName comment 로 잡자
  if(event.target.tagName === "I")
    currentTarget = event.target.parentNode.parentNode.parentNode;
  
  else if(event.target.tagName === "SPAN")  currentTarget = event.target.parentNode.parentNode;
  // commentValue.disabled = false;
  currentTarget.childNodes[2].disabled = false;

  // 체크버튼 활성화
  currentTarget.childNodes[0].childNodes[2].style.opacity = "1";

  currentTarget.childNodes[0].childNodes[2].addEventListener("click",postEditComment(currentTarget))
};

const postEditComment = (currentTarget) => {
  return function(){
    // currentTarget : class = comment
  const id = currentTarget.childNodes[0].childNodes[0].id;
  const body = {
    id,
    content: currentTarget.childNodes[2].value,
  };
  console.log(body)
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      alert("수정완료!");
      location.reload(true);
    }
  };
  xhttp.open("post", "/ajax/postEditComment", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(body));
}
};

const deleteComment = (event) => {
  let currentTarget;  // icon으로 잡자
  if(event.target.tagName === "I")
    currentTarget = event.target.parentNode.parentNode;
  
  else if(event.target.tagName === "SPAN")  
    currentTarget = event.target.parentNode;
  const id = currentTarget.childNodes[0].id;
  const body = { id };
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      location.reload(true);
    }
  };
  xhttp.open("post", "/ajax/postDeleteComment", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(body));
};

const init = () => {
  if (btn_editComment) {
    for(let i=0; i<btn_editComment.length; i++){
      btn_editComment[i].addEventListener("click", editComment);
      btn_deleteComment[i].addEventListener("click", deleteComment);
    }
  }
  if(img){
    let original = `/uploads/${img.id}`;
    img.style.background = `url(${original}) no-repeat `;
    img.style.backgroundSize="400px 500px";
    img.addEventListener("mouseover",()=>{
      img.style.background = 'url(/uploads/OK.png) no-repeat center';
      img.style.backgroundSize="200px 250px";
    })
    
    img.addEventListener("mouseout",()=>{
      img.style.background = `url(${original}) no-repeat `;
      img.style.backgroundSize="400px 500px";
      
    })
  }
};
init();
