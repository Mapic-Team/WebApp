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

import { mapicCrud } from "../../CRUD.js";


//initiate the profile page
user = localStorage.getItem('user');
curUser = await mapicCrud.readUser(user);
console.log(curUser);

/*curUser = await readUser(user);
console.log(curUser.pictures)
document.getElementById('userid').innerHTML = `${user}`;
settings = curUser["settings"];
if(Object.keys(settings).includes("theme")){
    updateTheme(curUser.settings["theme"]);
}
desc.innerHTML = curUser['profileDescription'];
            //sessionStorage.setItem("pic",content);
            //probably add db to this?
image.src = curUser["profilePicture"];
if(curUser.pictures.length == 0){
    console.log(document.getElementById("bestPost").innerHTML)
    document.getElementById("bestPost").innerHTML = "No pictures yet!";
}
*/
//initilize it to false, but we'll update it according to the db later
var privateCheck = false;

dark.addEventListener("click", (event) => {
    //TODO LINK IT TO THE POUCHDB
    //remove the previous lists 
    updateTheme('darkTheme');
    //localStorage.setItem("theme","black");
    settings.theme = 'darkTheme';
    updateDB();
});

light.addEventListener("click", (event)=>{
    //TODO LINK IT TO THE POUCHDB
    updateTheme('whiteTheme');
    //localStorage.setItem("theme","white");
    settings.theme = 'whiteTheme';
    console.log (settings)
    updateDB();
});

privatemode.addEventListener("click", (event) =>{
    privateCheck = privateCheck?false:true;
    //console.log(privateCheck);
    //TODO LINK IT TO DB
    settings.isVisible = privateCheck;
    updateDB();
});

updateDesc.addEventListener("click", (event)=>{
    //console.log("ok!");
    desc.innerHTML = newDesc.value;
    console.log(desc.innerHTML);
    newDesc.value = "Your new description!";
    //TODO LINK IT TO DB
    updateDB();
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
        console.log(curUser.profilePicture);
        await mapicCrud.updateProfilePicture(user,content);
        //console.log(content);
        //sessionStorage.setItem("pic",content);
        //probably add db to this?
    }
    //updateDB();
}

logout.addEventListener("click", (event) => {
    //we clear the local storage so it knows we logged out
    localStorage.clear();
    location.href = "index.html";
});
//TODO RETRIEVE DB PART.

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
