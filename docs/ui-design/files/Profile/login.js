const themeChange = ["logUser","logPass","card","body","signNam","signPass"]
const logUser =  document.getElementById("logUser");
const logPass = document.getElementById("logPass");
const signNam = document.getElementById("signNam");
const signPass = document.getElementById("signPass");


document.getElementById("pills-home-tab").addEventListener("click",(event)=>{
    signNam.value="";
    signPass.value= "";
    document.getElementById("warning").innerHTML = "";
});

document.getElementById("pills-profile-tab").addEventListener("click",(event)=>{
    logUser.value="";
    logPass.value= "";
    document.getElementById("logwarning").innerHTML = "";
});

function updateTheme(theme){
    for(let elem in themElems){
        console.log(themElems[elem]);
        document.getElementById(themElems[elem]).setAttribute("class", themElems[elem]);
        document.getElementById(themElems[elem]).classList.add(theme);
    }
}

document.getElementById("signup").addEventListener("click" ,(event)=>{
    if(isValidSignUp()){
        localStorage.setItem("login", "True");
        localStorage.setItem("user", signNam.value);
        location.href = "profile.html"
    }
});

document.getElementById("login").addEventListener("click" ,(event)=>{
    if(isValidLogin()){
       // localStorage.setItem("login", "True");
        //localStorage.setItem("user", signNam.value);
        //location.href = "profile.html"
    }
});
/**
 * This function checks if the login info is valid or not after looking at the pouch DB stuff
 */
function isValidLogin(){
    if(isEmpty(signNam.value)||isEmpty(signPass.value)){
        document.getElementById("logwarning").innerHTML = "One of the Values is empty!";
        return false;
    }
}

/**
 * This function checks if the sign-in info is valid or not after looking at the pouch DB stuff
 */
function isValidSignUp(){
    if(isEmpty(signNam.value)||isEmpty(signPass.value)){
        document.getElementById("warning").innerHTML = "One of the Values is empty!";
        return false;
    }
    if(false){

    }
    //check if we already have it in the database
    return true;
}

function isEmpty(str) {
    console.log(!str.trim().length)
    return !str.trim().length;
}