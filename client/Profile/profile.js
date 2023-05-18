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
import { mapicCrud } from "../CRUD.js";
image.src = "data:img/png;base64,"+default_pic;

//initiate the profile page

user = localStorage.getItem('user');
//we get the user from the database
curUser = await mapicCrud.readUser(user);
curUser = curUser.data;
//updates and renders the username
document.getElementById('userid').innerHTML = user
//old users didn't initialize with settings so we check if they have them, if so we upddate settings accordingly
if(curUser.settings != undefined){
    settings = curUser.settings;
    if(Object.keys(settings).includes("theme")){
        updateTheme(curUser.settings["theme"]);
    }
    if(Object.keys(settings).includes("privateMode")){
        privateCheck = true;
    }
}
//old profiles didn't initialize with profile pics so we give them the default here
if(curUser.profilePicture == undefined){
    image.src = "data:img/png;base64,"+default_pic;
    await mapicCrud.changeProfilePic(user,default_pic);
}
//else we get it from the gotten user
else{
    image.src = "data:img/png;base64,"+curUser.profilePicture;
}
//we see if they have a description, if they do update if else show default
if(curUser.profileDescription != undefined){
    desc.innerHTML = curUser.profileDescription;
}
else{
    desc.innerHTML = "I am new to Mapic!"
}
//we get the most liked picture the user has
let bestPic = await mapicCrud.getMostLikedPic(user);
//we first check if the user has any photos
if (bestPic.data == null){
    document.getElementById("bestPost").innerHTML = "No pictures yet!";
}
//it they do render the page accordingly
else{
    document.getElementById("best").src = bestPic.data.picBase64;
    document.getElementById("hearts").innerHTML = `<i class="fa fa-solid fa-heart"></i>:${bestPic.data.like}`
}
//initialize the gallery
//we check to see if we have any photos, old profiles didn't inistialize with a pictures array, so we check if it exists
if(curUser.pictures == undefined||curUser.pictures.length == 0){
    document.getElementById('pictures').innerHTML = `<h4 class="modal-title">No pictures in gallery</h4>`;
}
//This is for the gallery, we then go through all the photos in their library, find them one by one and then paste them into a grid
else{
    console.log("hasphotos")
    document.getElementById('pictures').innerHTML =`
    <button type = "button" id="delPics" class="btn btn-danger">Delete Pictures</button>`;
    const gallery = document.createElement('div');
    gallery.classList.add('galleryGrid')
    for(let picid of curUser.pictures){
        let pic = document.createElement('div');
        let galleryPic = document.createElement('img');
        pic.classList.add('gridobj');
        //we get the photo from the database
        let getPic = await mapicCrud.readPicture(picid);
        if (getPic.data!=null){
            galleryPic.src = getPic.data.picBase64;
            pic.id = picid;
            //this is how we determine what pictures are selected for deletion
            galleryPic.addEventListener('click',(event)=>{
                if (pic.classList.contains("picToBeDel")){
                    pic.classList.remove("picToBeDel");
                    pic.classList.add("gridobj");
                }
                else{
                    pic.classList.remove("gridobj");
                    pic.classList.add("picToBeDel");
                }
            });
            //add the photo to the division and that division to the gallery
            pic.appendChild(galleryPic)
            gallery.appendChild(pic);
        }
    }
    document.getElementById('pictures').appendChild(gallery);
}
//we change the theme to a darker one
dark.addEventListener("click", async (event) => {
    updateTheme('darkTheme');
    settings.theme = 'darkTheme';
    await mapicCrud.changeSetting(user,settings);
});
//we change the theme to a lighter one
light.addEventListener("click", async (event)=>{
    updateTheme('whiteTheme');
    settings.theme = 'whiteTheme';
    console.log (settings)
    await mapicCrud.changeSetting(user,settings);
});
//we change the setting to private mode, so only you can see your photos
privatemode.addEventListener("click", async (event) =>{
    privateCheck = privateCheck?false:true;
    settings.isVisible = privateCheck;
    await mapicCrud.changeSetting(user,settings);
});
//we update the description using this function
updateDesc.addEventListener("click",async (event)=>{
    desc.innerHTML = newDesc.value;
    console.log(desc.innerHTML);
    newDesc.value = "Your new description!";
    await mapicCrud.changeDescription(user,desc.innerHTML);
});
// we use this to change the profile picture
picChange.addEventListener("change",handleFiles ,false);
//we get an input of a photo and then extract the byte 64 and make that the profile pic source
async function handleFiles(){
    const file = this.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async readerEvent =>{
        var content = readerEvent.target.result;
        image.src = content;
        curUser.profilePicture = content;
        console.log(content.substring(22));
        await mapicCrud.changeProfilePic(user,content.substring(22));
    }
}

//we logout by clearing localStorage, as we use that to determine if the user is logged in 
logout.addEventListener("click", (event) => {
    //we clear the local storage so it knows we logged out
    localStorage.clear();
    location.href = "index.html";
});
//what happens when you press delete user, it asks the database to then delete that user
document.getElementById("delete").addEventListener("click",async (event)=>{
    localStorage.clear();
    await mapicCrud.deleteUser(user);
    location.href = "index.html";
});
//we take all the pictures with picToBeDel and delete them
document.getElementById("delPics").addEventListener('click',(event) =>{
    const collection = document.getElementsByClassName("picToBeDel");
    for (let i = 0; i < collection.length; i++) {
        mapicCrud.deletePicture(collection[0].id);
        collection[0].remove();
    }
})
//we take the list of all the visual items and change the theme accordingly 
function updateTheme(theme){
    for(let elem in themElems){
        document.getElementById(themElems[elem]).setAttribute("class", themElems[elem]);
        document.getElementById(themElems[elem]).classList.add(theme);
    }
}

