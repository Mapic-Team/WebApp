//import {readUser, createUser} from "../pouchDBCrud";

//import { createUser, readUser} from "../pouchDB.js";

import { mapicCrud } from "../CRUD.js";
//const check = require('profile.js')
const logUser =  document.getElementById("logUser");
const logPass = document.getElementById("logPass");
const signNam = document.getElementById("signNam");
const signPass = document.getElementById("signPass");

//This is how the taabs work 
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

//this is the signup and login button functionality
document.getElementById("signup").addEventListener("click" ,async (event)=>{
    if(await isValidSignUp()){
        await mapicCrud.createUser(signNam.value,signPass.value);
        localStorage.setItem("user", signNam.value);
        location.href = "profile.html"
    }
});

document.getElementById("login").addEventListener("click" ,async (event)=>{
    if(await isValidLogin()){
        localStorage.setItem("user", logUser.value);
        location.href = "index.html"
    }
});
/**
 * This function checks if the login info is valid or not after looking at the pouch DB stuff
 */
async function isValidLogin(){
    let exists = "";
    //we check if the either field is empty, is they are then prevent login
    if(isEmpty(logUser.value)||isEmpty(logPass.value)){
        document.getElementById("logwarning").innerHTML = "One of the Values is empty!";
        return false;
    }
    try{
        //we try to get the value from database
         exists = await mapicCrud.readUser(logUser.value);

    }
    catch(err){
        //if we get an error it doesn't exist
        return false;
    }   
    //we check if the user exists and the password is correct if not prevent login
    if(!exists.success || exists.data.password != logPass.value){
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
    //if either field is empty we give out a warning and prevent signuo
    if(isEmpty(signNam.value)||isEmpty(signPass.value)){
        document.getElementById("warning").innerHTML = "One of the Values is empty!";
        return false;
    }
    //check if we already have it in the database
        //we try to get the value from database
    exists = await mapicCrud.readUser(signNam.value);
    //if we can get a user that means we can't use that username so prevent sign in
     if(exists.success){
        document.getElementById("warning").innerHTML = "User already exists!";
        return false;
    }
    return true;
}
//we see if the selected string is empty or not
function isEmpty(str) {
    return !str.trim().length;
}