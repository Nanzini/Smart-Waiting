const checkbox = document.querySelectorAll(".check_input");
const checkValue = ['korean','japanese','west','chinese', 'southAsia'];
const selectValue = document.getElementById("tags");
const searchInput = document.querySelector(".searchInput");
function init(){
    selectValue.addEventListener("change",()=>{
        if(selectValue.value === '태그'){
            document.querySelector(".checkbox").style.display="block";
            searchInput.style.display="none";
        }
        else{
             document.querySelector(".checkbox").style.display="none";
             searchInput.style.display="block";
        }
    })
}

init();