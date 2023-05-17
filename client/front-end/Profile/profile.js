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

//initiate the profile page

user = localStorage.getItem('user');

curUser = await mapicCrud.readUser(user);
curUser = curUser.data;
document.getElementById('userid').innerHTML = user
if(curUser.settings != undefined){
    settings = curUser.settings;
    if(Object.keys(settings).includes("theme")){
        updateTheme(curUser.settings["theme"]);
    }
    if(Object.keys(settings).includes("privateMode")){
        privateCheck = true;
    }
}
//console.log(curUser.profilePicture);
if(curUser.profilePicture == undefined){
    image.src = "data:img/png;base64,"+default_pic;
    await mapicCrud.changeProfilePic(user,default_pic);
}
else{
    //console.log(curUser.profilePicture);
    image.src = "data:img/png;base64,"+curUser.profilePicture;
}
//console.log(curUser)
if(curUser.profileDescription != undefined){
    //console.log(curUser.profileDescription);
    desc.innerHTML = curUser.profileDescription;
}
else{
    desc.innerHTML = "I am new to Mapic!"
}

let bestPic = await mapicCrud.getMostLikedPic(user);
if (bestPic.data == null){
    document.getElementById("bestPost").innerHTML = "No pictures yet!";
}
else{
    //console.log(bestPic.data);
    document.getElementById("best").src = bestPic.data.picBase64;
    document.getElementById("hearts").innerHTML = `<i class="fa fa-solid fa-heart"></i>:${bestPic.data.like}`
}
//initialize the gallery
console.log(curUser.pictures == undefined||curUser.pictures.length == 0);
if(curUser.pictures == undefined||curUser.pictures.length == 0){
    document.getElementById('pictures').innerHTML = `<h4 class="modal-title">No pictures in gallery</h4>`;
}
else{
    console.log("hasphotos")
    document.getElementById('pictures').innerHTML =`
    <button type = "button" id="delPics" class="btn btn-danger">Delete Pictures</button>`;
    const gallery = document.createElement('div');
    gallery.classList.add('galleryGrid')
    console.log(curUser.pictures);
    for(let picid of curUser.pictures){
        console.log(picid)
        let galleryPic = document.createElement('img');
        galleryPic.classList.add('gridobj');
        let getPic = await mapicCrud.getPicture(picid);
        galleryPic.src = getPic.data.picBase64;
        galleryPic.addEventListener('click',(event)=>{
            if (galleryPic.classList.contains("picToBeDel")){
                galleryPic.classList.remove("picToBeDel");
                galleryPic.classList.add("gridobj");
                console.log(galleryPic.classList);
            }
            else{
                galleryPic.classList.remove("gridobj");
                galleryPic.classList.add("picToBeDel");
                console.log(galleryPic.classList);
            }
        });
        gallery.appendChild(galleryPic);
    }
    document.getElementById('pictures').appendChild(gallery);
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
        await mapicCrud.changeProfilePic(user,content.substring(22));
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

