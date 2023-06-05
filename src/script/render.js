import { allCategories, allCompanies, outOfWork, requestHireemployee, requestDismissEmployee, requestDepartmentById } from "./requests.js";

const viewModalClose = () => {
    const buttonClose = document.querySelector(".modal__view-close");
    const modalView = document.querySelector(".modal__view-controller");

    buttonClose.addEventListener("click", () => {
        modalView.close();
    })
}

const handleHireEmployee = () => {
    const contractButton = document.querySelector(".button__contract");
    const select = document.querySelector(".modal__view-select");
    const modalView = document.querySelector(".modal__view-controller");

    let count = 0
    let department = {
        department_id: null
    }

    contractButton.addEventListener("click", async (e) => {
        e.preventDefault();
        const employeeID = localStorage.getItem("@empresas:selectEmployee_id");
        const department_id = localStorage.getItem("@empresas:viewDepartment__id");

        const selectValue = select.value;

        if (selectValue === "Option Default") {
            count++
        }

        if (count != 0) {
            count = 0
            modalView.close();
            return toast("Por Favor, selecione um funcionário e tente novamente", red);
        }
        department.department_id = department_id;
        modalView.close();
        await requestHireemployee(employeeID, department);
        setTimeout(() => {
            location.reload();
        }, 3000)
    })
}

export const renderCards = (companies, categories) => {
    const ul = document.querySelector(".companys__list");
    ul.innerHTML = "";

    companies.forEach((company) => {
        const filterCategories = categories.filter((element) => element.id === company.category_id)

        const li = document.createElement("li");
        const h3 = document.createElement("h3");
        const span = document.createElement("span");

        h3.className = "title-3";
        h3.innerText = company.name;

        span.className = "button__chip";
        filterCategories.forEach((category) => {
            span.innerText = category.name;
        })

        li.append(h3, span);
        ul.appendChild(li);
    });
};

export const renderSelect = async (array) => {
    const select = document.querySelector(".companys__selected");
    select.innerHTML = "";

    const firstOption = document.createElement("option");
    firstOption.hidden = true;
    if (array === allCategories) {
        firstOption.innerText = "Selecionar Setor";
    } else if (array === allCompanies) {
        firstOption.innerText = "Selecionar Empresa";
    }

    const secondOption = document.createElement("option");
    secondOption.innerText = "Todos";
    secondOption.value = "Todos";

    select.append(firstOption, secondOption);

    if (array === allCategories) {
        array.forEach(category => {
            const option = document.createElement("option");

            option.value = category.name;
            option.innerText = category.name;

            select.appendChild(option);
        })
    } else if (array === allCompanies) {
        array.forEach(company => {
            const option = document.createElement("option");

            option.value = company.id;
            option.innerText = company.name;

            select.appendChild(option);
        })
    }

}

export const renderDepartamentsCards = (departaments, companies) => {
    const section = document.querySelector(".departments__cards");
    section.innerHTML = "";

    departaments.forEach(departament => {
        const ul = document.createElement("ul");
        const liCompanies = document.createElement("li");
        const h3 = document.createElement("h3");
        const spanDescription = document.createElement("span");
        const spanCompanie = document.createElement("span");
        const liLogos = document.createElement("li");
        const imgEye = document.createElement("img");
        const imgPen = document.createElement("img");
        const imgTrash = document.createElement("img");

        ul.className = "departments__list"

        liCompanies.className = "departments__list-name";

        h3.className = "title-3";
        h3.innerText = departament.name;


        spanDescription.className = "text-3";
        spanDescription.innerText = departament.description;


        companies.forEach(company => {
            if (company.id === departament.company_id) {
                spanCompanie.innerText = company.name;
            }
        })
        spanCompanie.className = "text-3";


        liLogos.className = "departments__list-logos";

        imgEye.className = "view__button"
        imgEye.src = "../assets/img/eye.png";
        imgEye.alt = "logo vizualizar";
        imgEye.id = departament.id;

        imgPen.className = "edit__button";
        imgPen.src = "../assets/img/pen.png";
        imgPen.alt = "logo editar";
        imgPen.id = departament.id;

        imgTrash.className = "delete__button";
        imgTrash.src = "../assets/img/trash.png";
        imgTrash.alt = "logo deletar";
        imgTrash.id = departament.id;

        imgEye.addEventListener("click", async () => {
            localStorage.setItem("@empresas:viewDepartment__id", imgEye.id);
            let employeeDepartment = await requestDepartmentById(imgEye.id);
            const modalView = document.querySelector(".modal__view-controller");
            let companyName = spanCompanie.innerText;
            let departamentName = h3.innerText;
            let departamentDescription = spanDescription.innerText;
            modalView.innerHTML = "";
            renderModalViewDepartment(outOfWork, departamentName, departamentDescription, companyName);
            renderModalViewCards(employeeDepartment, departamentName);
            handleHireEmployee();
            viewModalClose();
            modalView.showModal();
        })

        imgPen.addEventListener("click", () => {
            const modalEdit = document.querySelector(".modal__edit-controller");
            const inputDescription = document.querySelector(".modal__edit-description");
            let spanValue = spanDescription.innerText;
            inputDescription.value = spanValue;
            localStorage.setItem("@empresas:ButtonID", imgPen.id);
            modalEdit.showModal();
        })


        imgTrash.addEventListener("click", () => {
            const modalDelete = document.querySelector(".modal__delete-controller");
            const departmentName = document.querySelector(".delete__span");
            let h3Text = h3.innerText;
            departmentName.innerText = `${h3Text}`;
            localStorage.setItem("@empresas:deleteButtonId", imgTrash.id);
            modalDelete.showModal();
        })

        liCompanies.append(h3, spanDescription, spanCompanie);
        liLogos.append(imgEye, imgPen, imgTrash);
        ul.append(liCompanies, liLogos);
        section.appendChild(ul);
    })
}

export const renderEmptyCard = (name) => {
    const section = document.querySelector(".empty__departments");
    section.innerHTML = "";

    const paragraph = document.createElement("p");
    const companyName = document.createElement("span");


    paragraph.classList.add("text-4");
    companyName.classList.add("text-4");

    paragraph.innerText = "Empresa";
    companyName.innerText = ` ${name} `;
    paragraph.appendChild(companyName);
    paragraph.innerText += "não possui departamentos";


    section.appendChild(paragraph);

}

export const renderEmployeesCards = (employees) => {
    const section = document.querySelector(".employees__cards");
    section.innerHTML = "";
    const modalEdit = document.querySelector(".edit__employee-controller");
    const modalDelete = document.querySelector(".delete__employee-controller");

    employees.forEach(employee => {
        const ul = document.createElement("ul");
        const liEmployees = document.createElement("li");
        const h3 = document.createElement("h3");
        const spanName = document.createElement("span");
        const liLogos = document.createElement("li");
        const imgPen = document.createElement("img");
        const imgTrash = document.createElement("img");

        ul.className = "employees__list"

        liEmployees.className = "employees__list-name";

        h3.className = "title-3";
        h3.innerText = employee.name;

        spanName.className = "text-3";
        spanName.innerText = employee.email;



        liLogos.className = "employees__list-logos";

        imgPen.id = employee.id;
        imgPen.src = "../assets/img/pen.png";
        imgPen.alt = "logo editar";
        imgPen.addEventListener("click", () => {
            localStorage.setItem("@empresas:Employee_id", imgPen.id);
            modalEdit.showModal();
        })

        imgTrash.src = "../assets/img/trash.png";
        imgTrash.alt = "logo deletar";
        imgTrash.addEventListener("click", () => {
            localStorage.setItem("@empresas:Employee_id", imgPen.id);
            const employeeName = document.querySelector(".delete__employee-name");
            employeeName.innerText = h3.innerText;
            modalDelete.showModal();
        })

        liEmployees.append(h3, spanName);
        liLogos.append(imgPen, imgTrash);
        ul.append(liEmployees, liLogos);
        section.appendChild(ul);
    })

}

export const renderModalCreate = (array) => {
    const dialog = document.querySelector(".modal__create-controller");

    const container = document.createElement("div");
    const closeButton = document.createElement("img");
    const form = document.createElement("form");
    const title = document.createElement("h1");
    const inputName = document.createElement("input");
    const inputDescription = document.createElement("input");
    const select = document.createElement("select");
    const button = document.createElement("button");
    const firstOption = document.createElement("option");

    container.classList.add("modal__create-container");

    closeButton.classList.add("close__button");
    closeButton.src = "../assets/img/close.png";
    closeButton.alt = "close";

    title.classList.add("title-1-poppins");
    title.innerText = "Criar Departamento";

    inputName.classList.add("input__default", "create__input-name");
    inputName.type = "text";
    inputName.placeholder = "Nome do departamento";

    inputDescription.classList.add("input__default", "create__input-description");
    inputDescription.type = "text";
    inputDescription.placeholder = "Descrição";

    select.classList.add("input__default", "create__select");
    firstOption.hidden = true;
    firstOption.innerText = "Selecionar Empresa"
    select.appendChild(firstOption);
    array.forEach(company => {
        const option = document.createElement("option");

        option.value = company.id;
        option.innerText = company.name;
        select.appendChild(option);
    })


    button.classList.add("button__action-1", "modal__create-button");
    button.type = "submit";
    button.innerText = "Criar";

    form.append(title, inputName, inputDescription, select, button)
    container.append(closeButton, form);
    dialog.appendChild(container)

}

export const renderModalEdit = () => {
    const dialog = document.querySelector(".modal__edit-controller");

    const container = document.createElement("div");
    const closeButton = document.createElement("img");
    const form = document.createElement("form");
    const title = document.createElement("h1");
    const inputDescription = document.createElement("textarea");
    const saveButton = document.createElement("button");

    container.classList.add("modal__edit-container");

    closeButton.classList.add("close__button", "modal__edit-close");
    closeButton.src = "../assets/img/close.png";
    closeButton.alt = "close";

    title.classList.add("title-1-poppins");
    title.innerText = "Editar departamento";

    inputDescription.classList.add("input__default", "modal__edit-description");
    inputDescription.cols = "auto";
    inputDescription.rows = "auto";
    inputDescription.name = "description";


    saveButton.classList.add("button__action-1", "modal__edit-save");
    saveButton.innerText = "Salvar";

    form.append(title, inputDescription, saveButton);
    container.append(closeButton, form);
    dialog.appendChild(container);
}


export const renderModalDelete = () => {
    const dialog = document.querySelector(".modal__delete-controller");

    const modalContainer = document.createElement("div");
    const modalContent = document.createElement("div");
    const div = document.createElement("div");
    const closeButton = document.createElement("img");
    const paragraph = document.createElement("p");
    const removeButton = document.createElement("button");
    const departmentName = document.createElement("span");


    modalContainer.className = "modal__delete-container";
    modalContent.className = "modal__delete-content";
    closeButton.classList.add("close__button", "button__delete-close");
    closeButton.src = "../assets/img/close.png";
    closeButton.alt = "close";

    departmentName.classList.add("text-delete", "delete__span");

    paragraph.className = "text-delete";
    paragraph.innerHTML = 'Realmente deseja remover o departamento <span class="text-delete delete__span">Nome de uma empresa</span> e demitir seus funcionários?';

    removeButton.classList.add("button__action-2", "modal__button-remove");
    removeButton.type = "submit";
    removeButton.innerText = "Remover";

    div.append(paragraph, removeButton)
    modalContent.append(closeButton, div);
    modalContainer.appendChild(modalContent);
    dialog.appendChild(modalContainer);
}


export const renderUserInfos = (informations) => {
    const section = document.querySelector(".infoUser__container");
    section.innerHTML = "";

    const h1 = document.createElement("h1");
    const h3 = document.createElement("h3");

    h1.className = "title-2";
    h1.innerText = informations.name;

    h3.className = "text-5";
    h3.innerText = informations.email;

    section.append(h1, h3);
}

export const renderDepartmentandCompanyNames = (company, department) => {
    const employeesInfos = document.querySelector(".employees__infos");
    employeesInfos.innerHTML = "";

    const h2Company = document.createElement("h2");
    const h2Department = document.createElement("h2");
    const spanSeparator = document.createElement("span");

    h2Company.className = "title-1-white";
    if (company === undefined) {
        h2Company.innerText = "Sem empresa";
    } else {
        h2Company.innerText = company.name;
    }
    spanSeparator.className = "title-1-white";
    spanSeparator.innerText = "-";
    spanSeparator.style.marginLeft = "0.3em";
    spanSeparator.style.marginRight = "0.3em";
    h2Company.appendChild(spanSeparator);

    h2Department.className = "title-1-white";
    if (department === undefined) {
        h2Department.innerText = "Sem departamento";
    } else {
        h2Department.innerText = department.name;
    }

    employeesInfos.append(h2Company, h2Department);

}

export const renderEmployeesList = (Departament) => {
    const section = document.querySelector(".employees__lists");
    const emptyEmployees = document.querySelector(".empty__employees");
    section.innerHTML = "";

    const ul = document.createElement("ul");
    ul.className = "employees__content";

    if (Departament === undefined) {
        return;
    }

    Departament.employees.forEach(employee => {
        const li = document.createElement("li");
        const h4 = document.createElement("h4");
        li.className = "employees__list";

        h4.className = "title-3";
        h4.innerText = employee.name;
        li.appendChild(h4);
        ul.appendChild(li);
        section.appendChild(ul);
    })
}

export const renderModalEmployeesEdit = () => {
    const dialog = document.querySelector(".edit__employee-controller");


    const divElement = document.createElement("div");
    const imgElement = document.createElement("img");
    const formElement = document.createElement("form");
    const h1Element = document.createElement("h1");
    const inputNameElement = document.createElement("input");
    const inputEmailElement = document.createElement("input");
    const buttonElement = document.createElement("button");

    divElement.className = "edit__employee-container";

    imgElement.className = "close__button employee__edit-button-close";
    imgElement.src = "../assets/img/close.png";
    imgElement.alt = "close";

    h1Element.className = "title-1-poppins";
    h1Element.textContent = "Editar usuário";

    inputNameElement.className = "input__default edit__employee-name";
    inputNameElement.type = "text";
    inputNameElement.placeholder = "Nome";

    inputEmailElement.className = "input__default edit__employee-email";
    inputEmailElement.type = "email";
    inputEmailElement.placeholder = "Email";

    buttonElement.className = "button__action-1 edit__employee-button";
    buttonElement.type = "submit";
    buttonElement.textContent = "Criar";

    divElement.appendChild(imgElement);
    divElement.appendChild(formElement);
    formElement.appendChild(h1Element);
    formElement.appendChild(inputNameElement);
    formElement.appendChild(inputEmailElement);
    formElement.appendChild(buttonElement);

    dialog.appendChild(divElement);

}

export const renderModalDeleteEmployee = () => {
    const dialog = document.querySelector(".delete__employee-controller");

    const modalContainer = document.createElement("div");
    const modalContent = document.createElement("div");
    const div = document.createElement("div");
    const closeButton = document.createElement("img");
    const paragraph = document.createElement("p");
    const removeButton = document.createElement("button");
    const employeeName = document.createElement("span");

    modalContainer.className = "delete__employee-container";
    modalContent.className = "delete__employee-content";
    closeButton.classList.add("close__button", "delete__employee-close");
    closeButton.src = "../assets/img/close.png";
    closeButton.alt = "close";

    employeeName.classList.add("text-delete", "delete__employee-name");

    paragraph.className = "text-delete";
    paragraph.innerHTML = 'Realmente deseja remover o funcionário(a) <span class="text-delete delete__employee-name">Nome</span></p>';

    removeButton.classList.add("button__action-2", "employee__button-remove");
    removeButton.type = "submit";
    removeButton.innerText = "Remover";

    div.append(paragraph, removeButton)
    modalContent.append(closeButton, div);
    modalContainer.appendChild(modalContent);
    dialog.appendChild(modalContainer);
}

export const renderModalViewDepartment = (employees, name, description, company) => {
    const modalViewController = document.querySelector(".modal__view-controller");

    const divModalViewContainer = document.createElement("div");
    const imgCloseButton = document.createElement("img");
    const h1ViewTitle = document.createElement("h1");
    const divModalViewDescription = document.createElement("div");
    const pDescription = document.createElement("p");
    const pText = document.createElement("p");
    const form = document.createElement("form");
    const selectModalView = document.createElement("select");
    const optionDefault = document.createElement("option");
    const buttonAction = document.createElement("button");
    const ulModalViewCards = document.createElement("ul");



    divModalViewContainer.className = "modal__view-container";

    imgCloseButton.className = "close__button modal__view-close";
    imgCloseButton.src = "../assets/img/close.png";
    imgCloseButton.alt = "close";

    h1ViewTitle.className = "title-1-poppins view__title";
    h1ViewTitle.innerText = name;

    divModalViewDescription.className = "modal__view-description";

    pDescription.className = "title-3";
    pDescription.innerText = description;

    pText.className = "text-3";
    pText.innerText = company;

    selectModalView.className = "modal__view-select";
    optionDefault.selected = true;
    optionDefault.hidden = true;
    optionDefault.value = "Option Default"
    optionDefault.innerText = "Selecionar Usuário";

    employees.forEach(employee => {
        const option = document.createElement("option");
        option.value = employee.id;
        option.innerText = employee.name;
        selectModalView.appendChild(option);
    })

    selectModalView.addEventListener("change", () => {
        const selectValue = selectModalView.value;
        localStorage.setItem("@empresas:selectEmployee_id", selectValue);
    });

    buttonAction.className = "button__action-1 button__contract";
    buttonAction.textContent = "Contratar";

    ulModalViewCards.className = "modal__view-cards";



    divModalViewContainer.append(imgCloseButton, h1ViewTitle, divModalViewDescription, form, ulModalViewCards);

    divModalViewDescription.append(pDescription, pText);

    form.append(selectModalView, buttonAction);
    selectModalView.appendChild(optionDefault);

    modalViewController.appendChild(divModalViewContainer);
}

const renderModalViewCards = (departments, departmentName) => {
    const ulModalViewCards = document.querySelector(".modal__view-cards");
    const modalView = document.querySelector(".modal__view-controller");
    ulModalViewCards.innerHTML = "";

    const emptyDiv = document.createElement("div");
    const emptyText = document.createElement("h2");

    emptyDiv.className = "modal__view-emptyEmployees";
    emptyText.innerText = "Este departamento não possui funcionários";
    emptyText.className = "title-1-poppins";

    emptyDiv.appendChild(emptyText);

    if (departments.employees.length === 0) {
        ulModalViewCards.appendChild(emptyDiv);
    } else {
        departments.employees.forEach(employee => {
            const liModalViewList = document.createElement("li");
            const divListContent = document.createElement("div");
            const h3Username = document.createElement("h3");
            const pCompanyName = document.createElement("p");
            const buttonDismiss = document.createElement("button");

            liModalViewList.className = "modal__view-list";
            divListContent.className = "modal__view-content";
            h3Username.className = "title-3";
            h3Username.innerText = employee.name;
            pCompanyName.className = "text-3";
            pCompanyName.innerText = departmentName;
            buttonDismiss.className = "button__dismiss";
            buttonDismiss.innerText = "Desligar";
            buttonDismiss.id = employee.id;

            buttonDismiss.addEventListener("click", async (e) => {
                e.preventDefault()
                let EmployeeId = buttonDismiss.id;
                await requestDismissEmployee(EmployeeId);
                modalView.close();
                setTimeout(() => {
                    location.reload();
                }, 3000);
            });

            liModalViewList.append(divListContent, buttonDismiss);
            divListContent.append(h3Username, pCompanyName);
            ulModalViewCards.appendChild(liModalViewList);
        });
    }
}




export const toast = async (message, color) => {

    const body = document.querySelector("body");
    const container = document.createElement("div");
    const text = document.createElement("p");

    container.classList.add("toast__container", "toast__add");
    container.style.backgroundColor = color;

    text.innerText = message;

    container.appendChild(text);

    body.appendChild(container);

    setTimeout(() => {
        container.classList.add("toast__remove")
    }, 2000);

    setTimeout(() => {
        body.removeChild(container)
    }, 3000);
}
