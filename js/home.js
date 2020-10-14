const banner = document.querySelector(".banner");
const reservation = document.querySelector(".reservationMode");
const restaurant = document.querySelector(".restaurantMode");
const server = document.querySelector(".serverMode");

/* 가게등록할 때 form */
const file = document.getElementById("form_file");
const label_text = document.getElementById("label_text");
const label_img = document.getElementById("label_img");

const init = () =>{
  if(banner) banner.addEventListener("mouseover", changeBanner1);
  if (reservation){
  reservation.addEventListener('mouseover', hover(reservation));
  restaurant.addEventListener("mouseover", hover(restaurant));
  server.addEventListener("mouseover", hover(server));
  }
  if(file) file.addEventListener("change", changedFile(file,label_text,label_img));
  
}

const changedFile = (file,text,img) => {
  return function(){
  text.innerHTML = file.value;
  img.style.background = "url(/uploads/OK.png) no-repeat 50%";
  img.style.backgroundSize = "30px";
  console.log(file);
  }
}

const changeBanner1 = () => {
    banner.style.backgroundImage = "url('/uploads/home_reservation.png')";
    banner.addEventListener("mouseout", changeBanner2);
}

const changeBanner2 = () => {
    banner.style.backgroundImage = "url('/uploads/home_banner.png')";
}


const hover = (tmp) => {
  return function(){
  tmp.style.filter = "blur(0)";
  tmp.style.transform = "scale(1.2)";
  tmp.childNodes[0].style.display = "block";
  tmp.addEventListener("mouseout", sndHover(tmp));
  }
}

const sndHover = (tmp) => {
   return function(){
    tmp.style.filter = "blur(5px)";
    tmp.style.transform = "scale(1)";
    tmp.childNodes[0].style.display = "none";
   }
}


init();
