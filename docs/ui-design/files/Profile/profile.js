const dark = document.getElementById('themeDark');
const light = document.getElementById('themeLight');
const content = document.getElementById('content');
const privatemode = document.getElementById('privatemode');

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

function updateTheme(theme){
    for(let elem in themElems){
        console.log(themElems[elem]);
        document.getElementById(themElems[elem]).setAttribute("class", themElems[elem]);
        document.getElementById(themElems[elem]).classList.add(theme);
    }
}
