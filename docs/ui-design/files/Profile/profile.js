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

//initilize it to false, but we'll update it according to the db later
var privateCheck = false;
dark.addEventListener("click", (event) => {
    //TODO LINK IT TO THE POUCHDB
    //remove the previous lists 
    updateTheme('darkTheme');
});

light.addEventListener("click", (event)=>{
    //TODO LINK IT TO THE POUCHDB
    updateTheme('whiteTheme');
});

privatemode.addEventListener("click", (event) =>{
    privateCheck = privateCheck?false:true;
    //console.log(privateCheck);
    //TODO LINK IT TO DB
});

updateDesc.addEventListener("click", (event)=>{
    //console.log("ok!");
    desc.innerHTML = newDesc.value;
    newDesc.value = "Your new description!";
    //TODO LINK IT TO DB
});

picChange.addEventListener("change",handleFiles ,false);
function handleFiles(){
    const file = this.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = readerEvent =>{
        var content = readerEvent.target.result;
        image.src = content;
        //probably add db to this?
    }
}
//TODO RETRIEVE DB PART.
function getfromDB(){}
function updateDB(){}

function updateTheme(theme){
    for(let elem in themElems){
        console.log(themElems[elem]);
        document.getElementById(themElems[elem]).setAttribute("class", themElems[elem]);
        document.getElementById(themElems[elem]).classList.add(theme);
    }
}