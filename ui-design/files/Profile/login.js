

import {checkUser, createUser} from "front-end\pouchDB.js";
var md5 = require('md5');
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
//check if we can signup as someone new
document.getElementById("signup").addEventListener("click" ,(event)=>{
    if(isValidSignUp()){
        localStorage.setItem("user", signNam.value);
        location.href = "profile.html"
    }
});

//check if we can login as this person or not
document.getElementById("login").addEventListener("click" ,async (event)=>{
    if(isValidLogin()){
        localStorage.setItem("user", logUser.value);
        location.href = "profile.html"
    }
});
/**
 * This function checks if the login info is valid or not after looking at the pouch DB stuff
 */
async function isValidLogin(){
    if(isEmpty(logUser.value)||isEmpty(logPass.value)){
        document.getElementById("logwarning").innerHTML = "One of the Values is empty!";
        return false;
    }
    else if(!exists || users[md5(logUser.value).password != logPass.value]){
        return false;
    }
    return true;
}

/**
 * This function checks if the sign-in info is valid or not after looking at the pouch DB stuff
 */
async function isValidSignUp(){
    if(isEmpty(signNam.value)||isEmpty(signPass.value)){
        document.getElementById("warning").innerHTML = "One of the Values is empty!";
        return false;
    }
    //check if we already have it in the database
    else if(!exists){
        document.getElementById("warning").innerHTML = "User already exists!";
        return false;
    }
    return true;
}

function isEmpty(str) {
    console.log(!str.trim().length)
    return !str.trim().length;
}