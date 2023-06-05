import { renderDepartmentandCompanyNames, renderEmployeesList, renderUserInfos } from "./render.js";
import { employeeProfile, company, department, companyId, departmentId } from "./requests.js";

const authorized = () => {
    const token = JSON.parse(sessionStorage.getItem("@empresas:token"));
    const isAdm = JSON.parse(localStorage.getItem("@empresas:adm"));

    if (!token) {
        location.replace("../../");
    }

    if (isAdm) {
        location.replace("./adm.html");
    }
}

const logout = () => {
    const buttonLogout = document.querySelector(".header__button-logout");

    buttonLogout.addEventListener("click", () => {
        sessionStorage.removeItem("@empresas:token");
        localStorage.removeItem("@empresas:adm");
        localStorage.removeItem("@empresas:department__id");
        localStorage.removeItem("@empresas:company__id");
        location.replace("../../");
    })
}

const userOutOfWork = () => {
    const employeesInfos = document.querySelector(".employees__infos");
    const sectionEmployees = document.querySelector(".employees__lists");
    const sectionOutOfWork = document.querySelector(".outOfWork__container");

    if (companyId === null && departmentId === null) {
        employeesInfos.style.display = "none";
        sectionEmployees.style.display = "none";
        sectionOutOfWork.style.display = "flex";
    } else {
        employeesInfos.style.display = "flex";
        sectionEmployees.style.display = "block";
        sectionOutOfWork.style.display = "none";
    }
}


authorized();
logout();
renderUserInfos(employeeProfile);
renderDepartmentandCompanyNames(company, department);
renderEmployeesList(department);
userOutOfWork();



