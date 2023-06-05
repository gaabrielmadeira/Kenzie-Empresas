import { toast } from "./render.js";
import {red, registerUser} from "./requests.js";

const buttonHome = ()=>{
    const button = document.querySelector(".header__button-home");

    button.addEventListener("click", ()=>{
       setTimeout(location.replace("../../"), 3000);
    })
}

const goToRegister = ()=>{
    const button = document.querySelector(".header__button-login");

    button.addEventListener("click", ()=>{
       setTimeout(location.replace("./Login.html"), 3000);
    })
}

const returnToLogin = ()=>{
    const button = document.querySelector(".register__button-return");

    button.addEventListener("click", (e)=>{
        e.preventDefault();
        setTimeout(location.replace("./Login.html"), 3000);
    })
}

const handleRegister = ()=>{
    const inputName = document.querySelector(".register__input-name");
    const inputEmail = document.querySelector(".register__input-email");
    const inputPassword = document.querySelector(".register__input-password");
    const button = document.querySelector(".register__button-register");
    const spinner = document.querySelector(".spinner");
    let count = 0;
    let user = {
        name: null,
        email: null,
        password: null
    }

    button.addEventListener("click", async (e)=>{
        e.preventDefault()
        spinner.classList.remove("hidden");
        const nameValue = inputName.value;
        const emailValue = inputEmail.value;
        const passwordValue = inputPassword.value;

        if(nameValue === "" || emailValue === "" || passwordValue === ""){
           count ++;
        } 
        
        if(count != 0){
            count = 0
            spinner.classList.add("hidden");
            return toast("Por favor, preencha todos os campos", red)
        }else{  
            user.name = nameValue;
            user.email = emailValue;
            user.password = passwordValue;
            
            await registerUser(user);
           setTimeout(() => {
            spinner.classList.add("hidden");
           }, 3000); 
        }
    })
}


returnToLogin();
goToRegister();
buttonHome();
handleRegister();