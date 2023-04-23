const themeChange = ["logUser","logPass","card","body","signNam","signPass"]
const logUser =  document.getElementById("logUser");
const logPass = document.getElementById("logPass");
const signNam = document.getElementById("signNam");
const signPass = document.getElementById("signPass");

function updateTheme(theme){
    for(let elem in themElems){
        console.log(themElems[elem]);
        document.getElementById(themElems[elem]).setAttribute("class", themElems[elem]);
        document.getElementById(themElems[elem]).classList.add(theme);
    }
}

document.getElementById("signup").addEventListener("click" ,(event)=>{
    if(isValidSignUp){
        localStorage.setItem("login", "True");
        localStorage.setItem("user", signNam.value);
        location.href = "profile.html"
    }
});
/**
 * This function checks if the login info is valid or not after looking at the pouch DB stuff
 */
function isValidLogin(){
    
}

/**
 * This function checks if the sign-in info is valid or not after looking at the pouch DB stuff
 */
function isValidSignUp(){
    
}