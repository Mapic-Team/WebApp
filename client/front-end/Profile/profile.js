import { default_pic } from "./defaultPic.js";

const dark = document.getElementById('themeDark');
const light = document.getElementById('themeLight');
const content = document.getElementById('content');
const privatemode = document.getElementById('privatemode');
const desc = document.getElementById('profDesc');
const updateDesc = document.getElementById('saveDesc');
const newDesc = document.getElementById('newDesc');
const themElems = ['content','modal-header','modal-body','newDesc','modal-dialog']
const picChange = document.getElementById('file-input');
const image = document.getElementById("circle");
let reader = new FileReader();
const logout = document.getElementById("logout");

let user = "";
let curUser = {};
let settings = {};
//initilize it to false, but we'll update it according to the db later
var privateCheck = false;
import { mapicCrud } from "../../CRUD.js";
image.src = "data:img/png;base64,"+default_pic;
console.log(curUser["hi"]);
//initiate the profile page

user = localStorage.getItem('user');

curUser = await mapicCrud.readUser(user);
curUser = curUser.data;
if(curUser["settings"] != undefined){
    settings = curUser.settings;
    if(Object.keys(settings).includes("theme")){
        updateTheme(curUser.settings["theme"]);
    }
    if(Object.keys(settings).includes("privateMode")){
        privateCheck = true;
    }
}

if(curUser["profilePicture"] != undefined){
    image.src = "data:img/png;base64,"+default_pic;
    await mapicCrud.updateProfilePicture(user,default_pic);
}
if(curUser["description"] != undefined){
    desc.innerHTML = curUser["description"];
}
else{
    desc.innerHTML = "I am new to Mapic!"
}

let bestPic = await mapicCrud.getMostLikedPic(user);
if (bestPic.data == null){
    document.getElementById("bestPost").innerHTML = "No pictures yet!";
}
else{
    const best = await mapicCrud.getPicture(bestPic.data);
    document.getElementById("best").src = "data:img/png;base64,"+best.picBaseID;
    document.getElementById("hearts").innerHTML = `:${best.like}`
}
//initialize the gallery
if(curUser.pictues.length > 0){
    const gallery = document.getElementById('galleryGrid')
    const div = document.createElement('div');
}

dark.addEventListener("click", async (event) => {
    //TODO LINK IT TO THE POUCHDB
    //remove the previous lists 
    updateTheme('darkTheme');
    //localStorage.setItem("theme","black");
    settings.theme = 'darkTheme';
    await mapicCrud.changeSetting(user,settings);
});

light.addEventListener("click", async (event)=>{
    //TODO LINK IT TO THE POUCHDB
    updateTheme('whiteTheme');
    //localStorage.setItem("theme","white");
    settings.theme = 'whiteTheme';
    console.log (settings)
    await mapicCrud.changeSetting(user,settings);
});

privatemode.addEventListener("click", async (event) =>{
    privateCheck = privateCheck?false:true;
    //console.log(privateCheck);
    //TODO LINK IT TO DB
    settings.isVisible = privateCheck;
    await mapicCrud.changeSetting(user,settings);
});

updateDesc.addEventListener("click",async (event)=>{
    //console.log("ok!");
    desc.innerHTML = newDesc.value;
    console.log(desc.innerHTML);
    newDesc.value = "Your new description!";
    //TODO LINK IT TO DB
    await mapicCrud.changeDescription(user,desc.innerHTML);
});

picChange.addEventListener("change",handleFiles ,false);
async function handleFiles(){
    const file = this.files[0];
    //console.log(file);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async readerEvent =>{
        var content = readerEvent.target.result;
        image.src = content;
        curUser.profilePicture = content;
        console.log(content.substring(22));
        await mapicCrud.updateProfilePicture(user,content.substring(22));
    }
    //updateDB();
}

logout.addEventListener("click", (event) => {
    //we clear the local storage so it knows we logged out
    localStorage.clear();
    location.href = "index.html";
});

document.getElementById("delete").addEventListener("click",async (event)=>{
    localStorage.clear();
    await mapicCrud.deleteUser(user);
    location.href = "index.html";
});

/*function updateDB(){
    updateUser(user,curUser.password, desc.innerHTML,image.src ,settings, curUser.pictures);
    console.log(curUser);
}
*/


function updateTheme(theme){
    for(let elem in themElems){
        //console.log(themElems[elem]);
        document.getElementById(themElems[elem]).setAttribute("class", themElems[elem]);
        document.getElementById(themElems[elem]).classList.add(theme);
    }
}
