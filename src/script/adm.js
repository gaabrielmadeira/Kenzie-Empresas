import { renderSelect, renderDepartamentsCards, renderEmptyCard, renderModalCreate, renderModalEdit, renderModalDelete, toast, renderEmployeesCards, renderModalEmployeesEdit, renderModalDeleteEmployee } from "./render.js";
import { allCompanies, departmentById, departmentAll, createDepartment, modifyDepartments, red, requestDeleteDepartment, employeesAll, requestEmployeesEdit, requestEmployeeDelete} from "./requests.js";


const authorized = () => {
    const token = JSON.parse(sessionStorage.getItem("@empresas:token"));
    const isAdm = JSON.parse(localStorage.getItem("@empresas:adm"));

    if (!token) {
        location.replace("../../");
    }

    if (!isAdm) {
        location.replace("./user.html");
    }
}

const logoutButton = () => {
    const button = document.querySelector(".header__button-logout");

    button.addEventListener("click", () => {
        setTimeout(location.replace("../../"), 3000);
        sessionStorage.removeItem("@empresas:token");
        localStorage.removeItem("@empresas:adm");
        localStorage.removeItem("@empresas:ButtonID");
        localStorage.removeItem("@empresas:description");
        localStorage.removeItem("@empresas:deleteButtonId");
        localStorage.removeItem("@empresas:Employee_id");
        localStorage.removeItem("@empresas:viewDepartment__id");
        localStorage.removeItem("@empresas:selectEmployee_id");
    })
}

const emptyCard = () => {
    const empty = document.querySelector(".empty__departments");
    const sectionCards = document.querySelector(".departments__cards");

    if (sectionCards.innerHTML === "") {
        empty.style.display = "flex";
        sectionCards.style.display = "none";
    } else {
        sectionCards.style.display = "flex";
        empty.style.display = "none";
    }
}

const handleSelect = () => {
    const select = document.querySelector(".companys__selected");

    select.addEventListener("change", async (e) => {
        console.log(e.target)
        const selectValue = select.value;
        let selectText = "";
        for(let i = 0; i < select.length; i++){
            if(select[i].selected){
                selectText = select[i].innerText;
            }
        }

        renderEmptyCard(selectText);

        if (selectValue === "Todos") {
            renderDepartamentsCards(departmentAll, allCompanies);
        } else {
            await departmentById(selectValue);
            const departaments = JSON.parse(localStorage.getItem("@empresas:departamentByid"));
            renderDepartamentsCards(departaments, allCompanies);
        }

        emptyCard();
    })
}


const showModalCreate = () => {
    const buttonCreate = document.querySelector(".create__button");
    const modal = document.querySelector(".modal__create-controller");

    buttonCreate.addEventListener("click", () => {
        modal.showModal()
    })
    renderModalCreate(allCompanies);
    handleModalCreate();
    modalCreateClose();
}

const modalCreateClose = () => {
    const closeButton = document.querySelector(".close__button");
    const createModal = document.querySelector(".modal__create-controller");

    closeButton.addEventListener("click", () => {
        createModal.close();
    })
}

const editModalClose = () => {
    const buttonClose = document.querySelector(".modal__edit-close");
    const modalEdit = document.querySelector(".modal__edit-controller");

    buttonClose.addEventListener("click", () => {
        modalEdit.close();
    })
}

const deleteModalClose = () => {
    const buttonClose = document.querySelector(".button__delete-close");
    const modalDelete = document.querySelector(".modal__delete-controller");

    buttonClose.addEventListener("click", () => {
        modalDelete.close();
    })
}

const deleteEmployeeModalClose = () => {
    const buttonClose = document.querySelector(".delete__employee-close");
    const modalDelete = document.querySelector(".delete__employee-controller");

    buttonClose.addEventListener("click", () => {
        modalDelete.close();
    })
}

const editEmployeesModalClose = () => {
    const closeButton = document.querySelector(".employee__edit-button-close");
    const modal = document.querySelector(".edit__employee-controller");

    closeButton.addEventListener("click", () => {
        modal.close();
    })
}


const handleModalCreate = () => {
    const inputName = document.querySelector(".create__input-name");
    const inputDescription = document.querySelector(".create__input-description");
    const select = document.querySelector(".create__select");
    const createButton = document.querySelector(".modal__create-button");
    const modal = document.querySelector(".modal__create-controller");
    let count = 0;
    let departament = {
        name: null,
        description: null,
        company_id: null
    }

    createButton.addEventListener("click", async (e) => {
        e.preventDefault();
        let inputNameValue = inputName.value;
        let inputDescriptionValue = inputDescription.value;
        const selectValue = select.value;

        if (inputNameValue === "" || inputDescriptionValue === "" || selectValue === "Selecionar Empresa") {
            count++;
        }
        if (count != 0) {
            count = 0
            modal.close();
            return toast("Por favor, preencha os campos vazios e tente novamente", red);
        } else {
            departament.name = inputNameValue;
            departament.description = inputDescriptionValue;
            departament.company_id = selectValue;
            inputNameValue = "";
            inputDescriptionValue = "";

            await createDepartment(departament);
            modal.close();
            setTimeout(() => {
                location.reload();
            }, 2500);
            
        }
    })
}


const handleModalModify = () => {
    const buttonSave = document.querySelector(".modal__edit-save");
    const input = document.querySelector(".modal__edit-description");
    const modal = document.querySelector(".modal__edit-controller");
    let count = 0;
    let modify = {
        description: null
    };

    buttonSave.addEventListener("click", async (e) => {
        e.preventDefault();
        const companyId = localStorage.getItem("@empresas:ButtonID");
        let inputValue = input.value;

        if (input.value === "") {
            count++
        }

        if (count != 0) {
            count = 0
            modal.close()
            return toast("Por Favor, Preencha o formulário e tente novamente", red);
        } else {
            modify.description = inputValue;
            await modifyDepartments(companyId, modify);

            inputValue = "";
            modal.close();
            setTimeout(() => {
                location.reload();
            }, 2500);
        }

    });

};

const handleDelete = () => {
    const buttonDelete = document.querySelector(".modal__button-remove");
    const modal = document.querySelector(".modal__delete-controller");
    let departmentID = "";

    buttonDelete.addEventListener("click", async (e) => {
        e.preventDefault();
        departmentID = localStorage.getItem("@empresas:deleteButtonId");
        await requestDeleteDepartment(departmentID);
        modal.close();
        setTimeout(() => {
            location.reload();
        }, 2500);
    })
}

const handleEmployeeDelete = () => {
    const buttonDelete = document.querySelector(".employee__button-remove");
    const modal = document.querySelector(".delete__employee-controller");
    let employeeID = "";

    buttonDelete.addEventListener("click", async (e) => {
        e.preventDefault();
        employeeID = localStorage.getItem("@empresas:Employee_id");
        await requestEmployeeDelete(employeeID);
        modal.close();
        setTimeout(() => {
            location.reload();
        }, 2500);
    })
}

const handleEmployeeEdit = () => {
    const inputName = document.querySelector(".edit__employee-name");
    const inputEmail = document.querySelector(".edit__employee-email");
    const buttonCreate = document.querySelector(".edit__employee-button");
    const modalEdit = document.querySelector(".edit__employee-controller");
    let count = 0;
    let employeeID = {
        name: null,
        email: null
    }

    buttonCreate.addEventListener("click", async (e) => {
        e.preventDefault();
        const employee_id = localStorage.getItem("@empresas:Employee_id");
        let inputNameValue = inputName.value;
        let inputEmailValue = inputEmail.value;

        if (inputNameValue === "" || inputEmailValue === "") {
            count++
        }

        if (count != 0) {
            count = 0
            modalEdit.close()
            return toast("Por Favor, preencha todos os formulários e tente novamente", red)
        } else {
            employeeID.name = inputNameValue;
            employeeID.email = inputEmailValue;
            await requestEmployeesEdit(employee_id, employeeID);
            modalEdit.close()
            setTimeout(() => {
                location.reload();
            }, 2500);
        }
    })
}



authorized();
renderDepartamentsCards(departmentAll, allCompanies);
renderSelect(allCompanies);
renderEmployeesCards(employeesAll);
renderModalEdit();
renderModalDelete();
renderModalEmployeesEdit();
renderModalDeleteEmployee();
handleSelect();
showModalCreate();
editModalClose();
deleteModalClose();
editEmployeesModalClose();
deleteEmployeeModalClose();
logoutButton();
handleModalModify();
handleDelete();
handleEmployeeEdit();
handleEmployeeDelete();











