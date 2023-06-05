import { loginRequest } from "./requests.js";

const backToHome = () => {
    const button = document.querySelector(".header__button-home");

    button.addEventListener("click", () => {
        location.replace("../../");
    })
}

const goToRegister = () => {
    const button = document.querySelector(".header__button-register");

    button.addEventListener("click", () => {
        setTimeout(location.replace("./register.html"), 2000);
    })


}

const goLoginToRegister = () => {
    const loginButton = document.querySelector(".login__button-register");

    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        setTimeout(location.replace("./register.html"), 2000);
    })
}

const handleLogin = () => {
    const email = document.querySelector(".login__email");
    const password = document.querySelector(".login__password");
    const button = document.querySelector(".login__button-login");
    const spinner = document.querySelector(".spinner");

    let login = {
        email: null,
        password: null
    }

    button.addEventListener("click", async (e) => {
        e.preventDefault();
        spinner.classList.remove("hidden");
        const emailValue = email.value;
        const passwordValue = password.value;

        login.email = emailValue;
        login.password = passwordValue;
        await loginRequest(login);
       setTimeout(() => {
        spinner.classList.add("hidden");
       }, 3000); 
    })
}

goLoginToRegister();
goToRegister();
backToHome();
handleLogin();
