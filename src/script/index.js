import { renderCards, renderSelect } from "./render.js";
import { requestAllCompanies, requestAllCategories, requestByCompanies, allCategories} from "./requests.js";

const handleSelector = () => {
    const selector = document.querySelector(".companys__selected");

    selector.addEventListener("change", async () => {
        const selectorValue = selector.value;
        localStorage.setItem("@empresas:value", selectorValue);

        if(selectorValue === "Todos"){
             await requestAllCompanies()
             await requestAllCategories()
             const companiesAll = JSON.parse(localStorage.getItem("@empresas:companiesAll"));
             const categories = JSON.parse(localStorage.getItem("@empresas:categories"));
             renderCards(companiesAll, categories);
        }else{
            await requestByCompanies(selectorValue);
            await requestAllCategories();
            const companies = JSON.parse(localStorage.getItem("@empresas:companies"));
            const categories = JSON.parse(localStorage.getItem("@empresas:categories"));
            renderCards(companies, categories);
        }

    })
}


const lastSelect = async () => {
    const selectorValue = localStorage.getItem("@empresas:value");
    const selector = document.querySelector(".companys__selected");

    if(selectorValue === "Todos"){
        await requestAllCompanies()
        await requestAllCategories()
        const companiesAll = JSON.parse(localStorage.getItem("@empresas:companiesAll"));
        const categories = JSON.parse(localStorage.getItem("@empresas:categories"));
        renderCards(companiesAll, categories);
   }else{
       await requestByCompanies(selectorValue);
       await requestAllCategories();
       const companies = JSON.parse(localStorage.getItem("@empresas:companies"));
       const categories = JSON.parse(localStorage.getItem("@empresas:categories"));
       renderCards(companies, categories);
   }

    selector.value = selectorValue;
}

const goToLogin = ()=>{
    const button = document.querySelector(".header__button-login");

    button.addEventListener("click", ()=>{
       setTimeout(location.replace("./src/pages/Login.html"), 3000);
    })
}

const goToRegister = ()=>{
    const button = document.querySelector(".header__button-register");

    button.addEventListener("click", ()=>{
       setTimeout(location.replace("./src/pages/register.html"), 3000);
    })
}

renderSelect(allCategories);
goToRegister();
goToLogin();
lastSelect();
handleSelector();

