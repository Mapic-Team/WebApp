const dark = document.getElementById('themeDark');
const light = document.getElementById('themeLight');
const content = document.getElementById('content');

dark.addEventListener("click", (event) => {
    //TODO LINK IT TO THE POUCHDB
    //remove the previous lists 
    updateTheme('darkTheme');
});

light.addEventListener("click", (event)=>{
    //TODO LINK IT TO THE POUCHDB
    updateTheme('whiteTheme');
});
