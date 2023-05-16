//import {readUser, createUser} from "../pouchDBCrud";

//import { createUser, readUser} from "../pouchDB.js";
import { pcrud } from "./profCrud.js";
//const check = require('profile.js')
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

/*function updateTheme(theme){
    for(let elem in themElems){
        console.log(themElems[elem]);
        document.getElementById(themElems[elem]).setAttribute("class", themElems[elem]);
        document.getElementById(themElems[elem]).classList.add(theme);
    }
}*/

document.getElementById("signup").addEventListener("click" ,async (event)=>{
    if(await isValidSignUp()){
        createUser(signNam.value,signPass.value);
        localStorage.setItem("user", signNam.value);
        location.href = "profile.html"
    }
});

document.getElementById("login").addEventListener("click" ,async (event)=>{
    if(await isValidLogin()){
        localStorage.setItem("user", logUser.value);
        location.href = "profile.html"
    }
});
/**
 * This function checks if the login info is valid or not after looking at the pouch DB stuff
 */
async function isValidLogin(){
    let exists = "";
    try{
        //we try to get the value from database
        exists = await readUser(logUser.value);
    }
    catch(err){
        //if we get an error it doesn't exist
        exists = false;
    }
    console.log(exists.password);
    if(isEmpty(logUser.value)||isEmpty(logPass.value)){
        document.getElementById("logwarning").innerHTML = "One of the Values is empty!";
        return false;
    }
    else if(!exists || exists.password != logPass.value){
        document.getElementById("logwarning").innerHTML = "Incorrect password and username combo!";
        return false;
    }
    return true;
}

/**
 * This function checks if the sign-in info is valid or not after looking at the pouch DB stuff
 */
async function isValidSignUp(){
    let exists = "";
    try{
        //we try to get the value from database
        exists = await readUser(signNam.value, signPass.value);
    }
    catch(err){
        //if we get an error it doesn't exist
        exists = false;
    }
    console.log(exists)
    if(isEmpty(signNam.value)||isEmpty(signPass.value)){
        document.getElementById("warning").innerHTML = "One of the Values is empty!";
        return false;
    }
    //check if we already have it in the database
    else if(exists){
        document.getElementById("warning").innerHTML = "User already exists!";
        return false;
    }
    return true;
}

function isEmpty(str) {
    //console.log(!str.trim().length)
    return !str.trim().length;
}